# Generated by Django 3.2.20 on 2023-10-20 17:26


import django.contrib.gis.db.models.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("geodata", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="USCounty",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        editable=False,
                        help_text="Five-digits code that uniquely identify a county or equivalent, as standardized by ANSI",
                        max_length=5,
                        unique=True,
                        verbose_name="ANSI code",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        editable=False, max_length=100, verbose_name="name"
                    ),
                ),
                (
                    "full_name",
                    models.CharField(
                        editable=False,
                        help_text="full name of the county, including area description",
                        max_length=200,
                        verbose_name="full name",
                    ),
                ),
                (
                    "geometry",
                    django.contrib.gis.db.models.fields.MultiPolygonField(
                        geography=True, srid=4326, verbose_name="Geometry"
                    ),
                ),
            ],
            options={
                "verbose_name": "US county",
                "verbose_name_plural": "US counties",
                "ordering": ("code",),
            },
        ),
        migrations.CreateModel(
            name="USState",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        editable=False,
                        help_text="Two-digits code that uniquely identify a state or territory of the US, as standardized by ANSI",
                        max_length=2,
                        unique=True,
                        verbose_name="ANSI code",
                    ),
                ),
                (
                    "code_usps",
                    models.CharField(
                        editable=False,
                        help_text="Two-letters code attributed by the US Postal Service to every State and territory.",
                        max_length=2,
                        unique=True,
                        verbose_name="USPS code",
                    ),
                ),
                (
                    "name",
                    models.CharField(
                        editable=False, max_length=100, verbose_name="name"
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("S", "State"), ("O", "outlying area")],
                        editable=False,
                        max_length=1,
                        verbose_name="type",
                    ),
                ),
                (
                    "geometry",
                    django.contrib.gis.db.models.fields.MultiPolygonField(
                        geography=True, srid=4326, verbose_name="Geometry"
                    ),
                ),
            ],
            options={
                "verbose_name": "US state",
                "ordering": ("code",),
            },
        ),
        migrations.CreateModel(
            name="USZipCode",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "code",
                    models.CharField(
                        editable=False,
                        max_length=5,
                        unique=True,
                        verbose_name="zip code",
                    ),
                ),
                (
                    "official_city",
                    models.CharField(
                        editable=False, max_length=50, verbose_name="official city name"
                    ),
                ),
                (
                    "timezone",
                    models.CharField(
                        editable=False, max_length=50, verbose_name="timezone"
                    ),
                ),
                (
                    "coordinates",
                    django.contrib.gis.db.models.fields.PointField(
                        editable=False,
                        geography=True,
                        srid=4326,
                        verbose_name="average coordinates",
                    ),
                ),
            ],
            options={
                "verbose_name": "US zip code",
                "verbose_name_plural": "US zip codes",
                "ordering": ("code",),
            },
        ),
        migrations.CreateModel(
            name="USZipCodeCountyRel",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "weight",
                    models.DecimalField(
                        decimal_places=2,
                        editable=False,
                        help_text="Weight of this county in this zip code.",
                        max_digits=5,
                        verbose_name="weight",
                    ),
                ),
                (
                    "principal",
                    models.BooleanField(
                        editable=False,
                        help_text="Whether this county is the principal county for this zip code.",
                        verbose_name="Principal county",
                    ),
                ),
                (
                    "county",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="zip_code_relations",
                        related_query_name="zip_code_relation",
                        to="geodata.uscounty",
                    ),
                ),
                (
                    "zip_code",
                    models.ForeignKey(
                        editable=False,
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="county_relations",
                        related_query_name="county_relation",
                        to="geodata.uszipcode",
                    ),
                ),
            ],
            options={
                "unique_together": {("zip_code", "county")},
            },
        ),
        migrations.AddField(
            model_name="uszipcode",
            name="counties",
            field=models.ManyToManyField(
                related_name="zip_codes",
                related_query_name="zip_code",
                through="geodata.USZipCodeCountyRel",
                to="geodata.USCounty",
            ),
        ),
        migrations.AddField(
            model_name="uscounty",
            name="state",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.PROTECT,
                related_name="counties",
                related_query_name="county",
                to="geodata.usstate",
                verbose_name="State",
            ),
        ),
    ]
