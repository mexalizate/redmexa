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
"""

COPY_SQL = """COPY {table} ({columns}) FROM STDIN CSV QUOTE AS '"';"""

UPDATE_STATES = """
INSERT INTO geodata_mexicanstate (code, name, geometry) 
SELECT code, name, ST_multi(geometry)
FROM temp_mexicanstate
ON CONFLICT(code) DO UPDATE SET
 name = excluded.name,
 geometry = excluded.geometry;
"""

UPDATE_MUNICIPIOS = """
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


class Command(BaseCommand):
    help = _("Sync up geographical data into the database")

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            cursor.execute(CREATE_TEMP_TABLES)

            with open_binary(
                "agir.geodata.data", "mexico_estados.csv.gz"
            ) as _fd, gzip.open(_fd, "rt") as fd:
                columns = fd.readline().strip().split(",")
                cursor.copy_expert(
                    COPY_SQL.format(
                        table="temp_mexicanstate", columns=",".join(columns)
                    ),
                    fd,
                )

            with open_binary(
                "agir.geodata.data", "mexico_municipios.csv.gz"
            ) as _fd, gzip.open(_fd, "rt") as fd:
                columns = fd.readline().strip().split(",")
                cursor.copy_expert(
                    COPY_SQL.format(
                        table="temp_mexicanmunicipio", columns=",".join(columns)
                    ),
                    fd,
                )

            cursor.execute(UPDATE_STATES)
            cursor.execute(UPDATE_MUNICIPIOS)
