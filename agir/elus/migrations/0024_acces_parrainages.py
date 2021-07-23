# Generated by Django 3.1.13 on 2021-07-19 10:36

import datetime

import django.contrib.postgres.fields.ranges
from django.db import migrations, models
import django.db.models.deletion
import psycopg2.extras


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0005_add_subscriptions"),
        ("elus", "0023_auto_20210611_1038"),
    ]

    operations = [
        migrations.AlterField(
            model_name="mandatdepartemental",
            name="dates",
            field=django.contrib.postgres.fields.ranges.DateRangeField(
                default=psycopg2.extras.DateRange(
                    datetime.date(2021, 7, 1), datetime.date(2027, 3, 31), "[)"
                ),
                help_text="La date de fin correspond à la date théorique de fin du mandat si elle est dans le futur et à la date effective sinon.",
                verbose_name="Début et fin du mandat",
            ),
        ),
        migrations.AlterField(
            model_name="mandatregional",
            name="dates",
            field=django.contrib.postgres.fields.ranges.DateRangeField(
                default=psycopg2.extras.DateRange(
                    datetime.date(2021, 7, 1), datetime.date(2027, 3, 31), "[)"
                ),
                help_text="La date de fin correspond à la date théorique de fin du mandat si elle est dans le futur et à la date effective sinon.",
                verbose_name="Début et fin du mandat",
            ),
        ),
        migrations.CreateModel(
            name="AccesApplicationParrainages",
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
                    "etat",
                    models.CharField(
                        choices=[
                            ("A", "En attente"),
                            ("V", "Validée"),
                            ("R", "Refusée"),
                        ],
                        default="A",
                        max_length=1,
                        verbose_name="État de la demande",
                    ),
                ),
                (
                    "person",
                    models.OneToOneField(
                        on_delete=django.db.models.deletion.CASCADE, to="people.person"
                    ),
                ),
            ],
            options={
                "verbose_name": "Accès à l'application de recherches de parrainages",
                "verbose_name_plural": "Accès à l'application de recherches de parrainages",
                "ordering": ("etat", "person"),
            },
        ),
    ]
