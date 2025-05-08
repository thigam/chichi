# etl/flightDataETL.py
import requests, psycopg2, os, datetime
from dateutil.rrule import rrule, DAILY
from dotenv import load_dotenv

load_dotenv()
AMADEUS_CLIENT_ID     = os.getenv('AMADEUS_CLIENT_ID')
AMADEUS_CLIENT_SECRET = os.getenv('AMADEUS_CLIENT_SECRET')
DATABASE_URL          = os.getenv('DATABASE_URL')

TOKEN_URL       = "https://test.api.amadeus.com/v1/security/oauth2/token"
FLIGHT_OFFERS   = "https://test.api.amadeus.com/v2/shopping/flight-offers"

def get_token():
    r = requests.post(TOKEN_URL, data={
      "grant_type":"client_credentials",
      "client_id":AMADEUS_CLIENT_ID,
      "client_secret":AMADEUS_CLIENT_SECRET
    })
    r.raise_for_status()
    return r.json()['access_token']

def get_airports():
    """Fetch all IATA codes from your airports table."""
    conn = psycopg2.connect(DATABASE_URL)
    cur  = conn.cursor()
    cur.execute("SELECT code FROM airports")
    codes = [row[0] for row in cur.fetchall()]
    cur.close(); conn.close()
    return codes

def fetch_offers(origin, dest, date, token):
    params = {
      "originLocationCode": origin,
      "destinationLocationCode": dest,
      "departureDate": date,
      "adults": 1,
      "max": 10
    }
    r = requests.get(FLIGHT_OFFERS, headers={
        "Authorization": f"Bearer {token}"
      }, params=params)
    if r.status_code != 200:
      print("Error", origin, dest, date, r.text)
      return []
    return r.json().get('data', [])

def insert(flights):
    conn = psycopg2.connect(DATABASE_URL)
    cur  = conn.cursor()
    for offer in flights:
      seg = offer['itineraries'][0]['segments'][0]
      carrier = seg.get('carrierCode')
      num     = seg.get('number')
      fn      = f"{carrier}{num}" if carrier and num else None
      dep, arr = seg['departure']['iataCode'], seg['arrival']['iataCode']
      dt, at   = seg['departure']['at'], seg['arrival']['at']
      price    = offer.get('price',{}).get('total')
      if not all([fn, carrier, dep, arr, dt, at, price]):
        continue
      cur.execute("""
        INSERT INTO flights
          (flight_number, airline_id, departure_airport_id, arrival_airport_id, departure_time, arrival_time, price)
        VALUES (
          %s,
          (SELECT airline_id FROM airlines WHERE code=%s),
          (SELECT airport_id FROM airports  WHERE code=%s),
          (SELECT airport_id FROM airports  WHERE code=%s),
          %s,%s,%s
        )
        ON CONFLICT (flight_number, departure_time) DO NOTHING;
      """, (fn, carrier, dep, arr, dt, at, price))
    conn.commit(); cur.close(); conn.close()

if __name__=='__main__':
    token  = get_token()
    codes  = get_airports()
    # build date list: Jul 1 → Jul 31 2025
    dates = [dt.strftime("%Y-%m-%d")
             for dt in rrule(DAILY,
                              dtstart=datetime.date(2025,7,1),
                              until =datetime.date(2025,7,31))]
    # loop all ordered pairs
    for o in codes:
      for d in codes:
        if o==d: continue
        for date in dates:
          offs = fetch_offers(o,d,date,token)
          if offs:
            insert(offs)
    print("ETL done for July routes.")

