import gzip
from importlib.resources import open_binary

from django.core.management import BaseCommand
from django.db import connection
from django.utils.translation import gettext_lazy as _

CREATE_TEMP_TABLES = """
CREATE TEMPORARY TABLE temp_mexicanstate (
  code text,
  name text,
  geometry geometry
);

CREATE TEMPORARY TABLE temp_mexicanmunicipio (
  code text,
  name text,
  type text,
  geometry geometry
);

CREATE TEMPORARY TABLE temp_usstate (
  code text,
  name text,
  type text,
  code_usps text,
  geometry geometry
);

CREATE TEMPORARY TABLE temp_uscounty (
  code text,
  name text,
  full_name text,
  state_code text,
  geometry geometry
);

CREATE TEMPORARY TABLE temp_uszipcode (
  code text,
  official_city text,
  timezone text,
  coordinates geometry
);

CREATE TEMPORARY TABLE temp_uszipcodecountyrel (
  zip_code text,
  county_code text,
  principal boolean,
  weight decimal
)
"""

COPY_SQL = """COPY {table} ({columns}) FROM STDIN CSV QUOTE AS '"';"""

UPDATE_MEXICAN_STATES = """
INSERT INTO geodata_mexicanstate (code, name, geometry) 
SELECT code, name, ST_multi(geometry)
FROM temp_mexicanstate
ON CONFLICT(code) DO UPDATE SET
 name = excluded.name,
 geometry = excluded.geometry;
"""

UPDATE_MEXICAN_MUNICIPIOS = """
INSERT INTO geodata_mexicanmunicipio (code, name, type, geometry, state_id)
SELECT m.code, m.name, m.type, ST_multi(m.geometry), s.id
FROM temp_mexicanmunicipio m
JOIN geodata_mexicanstate s
ON SUBSTRING(m.code FROM 1 FOR 2) = s.code
ON CONFLICT(code) DO UPDATE SET
 name = excluded.name,
 type = excluded.type,
 geometry = excluded.geometry,
 state_id = excluded.state_id;
"""

UPDATE_US_STATES = """
INSERT INTO geodata_usstate (code, code_usps, name, type, geometry) 
SELECT code, code_usps, name, type, ST_multi(geometry)
FROM temp_usstate
ON CONFLICT(code) DO UPDATE SET
 code_usps = excluded.code_usps,
 name = excluded.name,
 type = excluded.type,
 geometry = excluded.geometry;
"""

UPDATE_US_COUNTIES = """
INSERT INTO geodata_uscounty (code, name, full_name, geometry, state_id)
SELECT m.code, m.name, m.full_name, ST_multi(m.geometry), s.id
FROM temp_uscounty m
JOIN geodata_usstate s
ON SUBSTRING(m.code FROM 1 FOR 2) = s.code
ON CONFLICT(code) DO UPDATE SET
 name = excluded.name,
 full_name = excluded.full_name,
 geometry = excluded.geometry,
 state_id = excluded.state_id;
"""

UPDATE_US_ZIPCODES = """
INSERT INTO geodata_uszipcode (code, official_city, timezone, coordinates)
SELECT code, official_city, timezone, coordinates
FROM temp_uszipcode
ON CONFLICT(code) DO UPDATE SET
  official_city = excluded.official_city,
  timezone = excluded.timezone,
  coordinates = excluded.coordinates;
"""

UPDATE_US_ZIPCODES_COUNTIES = """
INSERT INTO geodata_uszipcodecountyrel (zip_code_id, county_id, principal, weight)
SELECT z.id, c.id, t.principal, t.weight
FROM temp_uszipcodecountyrel AS t
JOIN geodata_uszipcode AS z
 ON t.zip_code = z.code
JOIN geodata_uscounty AS c
 ON t.county_code = c.code
ON CONFLICT(zip_code_id, county_id) DO UPDATE SET
 principal = excluded.principal,
 weight = excluded.weight;
"""

FILE_TO_TABLE = [
    ("mexico_estados.csv.gz", "temp_mexicanstate"),
    ("mexico_municipios.csv.gz", "temp_mexicanmunicipio"),
    ("us_states.csv.gz", "temp_usstate"),
    ("us_counties.csv.gz", "temp_uscounty"),
    ("us_zipcodes.csv.gz", "temp_uszipcode"),
    ("us_zipcodes_counties.csv.gz", "temp_uszipcodecountyrel"),
]


class Command(BaseCommand):
    help = _("Sync up geographical data into the database")

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TEMP_TABLES)

            for file_name, table_name in FILE_TO_TABLE:
                with open_binary("agir.geodata.data", file_name) as _fd, gzip.open(
                    _fd, "rt"
                ) as fd:
                    columns = fd.readline().strip().split(",")
                    cursor.copy_expert(
                        COPY_SQL.format(table=table_name, columns=",".join(columns)),
                        fd,
                    )

            cursor.execute(UPDATE_MEXICAN_STATES)
            cursor.execute(UPDATE_MEXICAN_MUNICIPIOS)
            cursor.execute(UPDATE_US_STATES)
            cursor.execute(UPDATE_US_COUNTIES)
            cursor.execute(UPDATE_US_ZIPCODES)
            cursor.execute(UPDATE_US_ZIPCODES_COUNTIES)
