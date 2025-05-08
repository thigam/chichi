import requests
import psycopg2
import os
import datetime
from dotenv import load_dotenv

load_dotenv()  # Load environment variables from the .env file

# Configuration: get Amadeus credentials and DB connection URL from environment variables
AMADEUS_CLIENT_ID = os.getenv('AMADEUS_CLIENT_ID')
AMADEUS_CLIENT_SECRET = os.getenv('AMADEUS_CLIENT_SECRET')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://username:password@localhost:5432/flightdb')

# Amadeus API endpoints for the test environment
TOKEN_URL = "https://test.api.amadeus.com/v1/security/oauth2/token"
FLIGHT_OFFERS_URL = "https://test.api.amadeus.com/v2/shopping/flight-offers"

"""print("Client ID:", AMADEUS_CLIENT_ID)
print("Client Secret:", AMADEUS_CLIENT_SECRET)"""


def get_amadeus_access_token():
    """
    Request an OAuth access token from Amadeus.
    """
    params = {
        "grant_type": "client_credentials",
        "client_id": AMADEUS_CLIENT_ID,
        "client_secret": AMADEUS_CLIENT_SECRET
    }
    response = requests.post(TOKEN_URL, data=params)
    response.raise_for_status()
    token_data = response.json()
    return token_data.get("access_token")

def fetch_flight_data():
    """
    Fetch flight offers from the Amadeus API using the access token.
    Adjust query parameters as needed.
    """
    access_token = get_amadeus_access_token()
    # Example query parameters (modify as needed for your searches)
    params = {
        "originLocationCode": "NBO",         # Nairobi's IATA code
        "destinationLocationCode": "JNB",      # Johannesburg's IATA code
        "departureDate": "2025-12-10",           # Date in yyyy-mm-dd format
        "adults": 1,
        "max": 10
    }
    headers = {
        "Authorization": f"Bearer {access_token}"
    }
    response = requests.get(FLIGHT_OFFERS_URL, headers=headers, params=params)
    if response.status_code != 200:
        print("Error response:", response.text)
    response.raise_for_status()
    data = response.json()
    # Amadeus returns flight offers in the "data" key
    return data.get('data', [])

def insert_flights(flights):
    """
    Insert fetched flights into PostgreSQL.
    This example takes the first itinerary and its first segment from each flight offer.
    Adjust the data extraction logic if needed.
    """
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    for offer in flights:
        first_segment = offer['itineraries'][0]['segments'][0]

        carrier = first_segment.get('carrierCode')
        num     = first_segment.get('number')
        flight_number = f"{carrier}{num}" if carrier and num else None

        dep = first_segment['departure']['iataCode']
        arr = first_segment['arrival']['iataCode']
        dep_time = first_segment['departure']['at']
        arr_time = first_segment['arrival']['at']
        price    = offer.get('price', {}).get('total')

        # skip incomplete
        if not all([flight_number, carrier, dep, arr, dep_time, arr_time, price]):
            print("⏭ skipping:", first_segment)
            continue

        cur.execute("""
          INSERT INTO flights
            (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price)
          VALUES
            (
              %s,
              (SELECT airline_id FROM airlines WHERE code = %s),
              (SELECT airport_id FROM airports  WHERE code = %s),
              (SELECT airport_id FROM airports  WHERE code = %s),
              %s, %s, %s
            )
          ON CONFLICT (flight_number, departure_time) DO NOTHING;
        """, (flight_number, carrier, dep, arr, dep_time, arr_time, price))
    
    conn.commit()
    cur.close()
    conn.close()

if __name__ == '__main__':
    flights = fetch_flight_data()
    insert_flights(flights)
    print("ETL process completed using Amadeus API.")

