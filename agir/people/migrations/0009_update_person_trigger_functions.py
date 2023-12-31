# Generated by Django 3.1.13 on 2021-11-16 13:58

from django.db import migrations

REMOVE_OLD_SEARCH_TRIGGERS_AND_FUNCTIONS = """
DROP TRIGGER IF EXISTS update_search_field_when_email_modified ON people_personemail;
DROP FUNCTION IF EXISTS process_update_email();
DROP FUNCTION IF EXISTS update_people_search_field_from_id(people_person.id%TYPE);
DROP TRIGGER IF EXISTS update_person_search_field_when_modified ON people_person;
DROP FUNCTION IF EXISTS process_update_person();
DROP FUNCTION IF EXISTS get_people_tsvector(
  people_person.id%TYPE, people_person.first_name%TYPE, people_person.last_name%TYPE, people_person.location_zip%TYPE
);
DROP FUNCTION IF EXISTS email_to_tsvector(people_personemail.address%TYPE);
"""

CREATE_NEW_SEARCH_TRIGGERS_AND_FUNCTIONS = """
CREATE FUNCTION email_to_tsvector(email people_personemail.address%TYPE) RETURNS tsvector AS $$
DECLARE
  email_parts text[];
BEGIN
  email_parts := string_to_array(email, '@');
  RETURN 
    setweight(
      to_tsvector('simple_unaccented', email) ||
      to_tsvector('simple_unaccented', regexp_replace(email_parts[1], '[-._]', ' ', 'g')) ,
    'A') ||
    setweight(to_tsvector('simple_unaccented', email_parts[2]), 'D');
END;
$$ LANGUAGE plpgsql;


CREATE FUNCTION get_people_tsvector(
  _id people_person.id%TYPE, first_name people_person.first_name%TYPE,
  last_name people_person.last_name%TYPE, location_zip people_person.location_zip%TYPE
) RETURNS tsvector AS $$
DECLARE
  email RECORD;
  search tsvector;
BEGIN
    --
    -- Return the search vector associated with the person information
    --
    search :=
      setweight(
        to_tsvector('simple_unaccented', coalesce(first_name, '')) || 
        to_tsvector('simple_unaccented', coalesce(last_name, '')), 'B'
      ) ||
      setweight(to_tsvector('simple_unaccented', coalesce(location_zip, '')), 'D');

    FOR email in SELECT address FROM people_personemail WHERE person_id = _id LOOP
      search := search || email_to_tsvector(email.address);
    END LOOP;

    RETURN search;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION process_update_person() RETURNS TRIGGER AS $$
BEGIN
    --
    -- Trigger function to update search field on person instance when it is created or updated
    -- 
    --
    NEW.search := get_people_tsvector(NEW.id, NEW.first_name, NEW.last_name, NEW.location_zip);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE FUNCTION update_people_search_field_from_id(person_id people_person.id%TYPE) RETURNS VOID AS $$
BEGIN
  --
  -- Update search vector for the person identified by person_id
  -- 
  UPDATE people_person SET search = get_people_tsvector(id, first_name, last_name, location_zip) WHERE id = person_id;
END
$$ LANGUAGE plpgsql;

CREATE FUNCTION process_update_email() RETURNS TRIGGER AS $$
BEGIN
  --
  -- Trigger function to update the corresponding person's search vector
  -- when an email is created, updated or deleted
  --
  IF (tg_op = 'INSERT') THEN
    PERFORM update_people_search_field_from_id(NEW.person_id);
  ELSIF (tg_op = 'DELETE') THEN
    PERFORM update_people_search_field_from_id(OLD.person_id);
  ELSIF (tg_op = 'UPDATE' AND (OLD.address <> NEW.address OR OLD.person_id <> NEW.person_id)) THEN
    PERFORM update_people_search_field_from_id(NEW.person_id);
  END IF;
    RETURN NULL;
END
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_person_search_field_when_modified
BEFORE INSERT OR UPDATE ON people_person
  FOR EACH ROW EXECUTE PROCEDURE process_update_person();

CREATE TRIGGER update_search_field_when_email_modified
AFTER INSERT OR UPDATE OR DELETE ON people_personemail
  FOR EACH ROW EXECUTE PROCEDURE process_update_email();

UPDATE people_person SET search = get_people_tsvector(id, first_name, last_name, location_zip);
"""


class Migration(migrations.Migration):
    dependencies = [
        ("people", "0008_contact"),
    ]

    operations = [
        migrations.RunSQL(
            sql=REMOVE_OLD_SEARCH_TRIGGERS_AND_FUNCTIONS,
            reverse_sql=migrations.RunSQL.noop,
        ),
        migrations.RunSQL(
            sql=CREATE_NEW_SEARCH_TRIGGERS_AND_FUNCTIONS,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
