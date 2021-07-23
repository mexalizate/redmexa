# Generated by Django 3.1.13 on 2021-07-09 14:29
import datetime

import agir.elus.models
import django.contrib.postgres.fields.ranges
from django.db import migrations, models
import django.db.models.deletion
import psycopg2.extras


class Migration(migrations.Migration):

    dependencies = [
        ("data_france", "0024_circonscriptionlegislative_depute"),
        ("people", "0005_add_subscriptions"),
        ("elus", "0024_acces_parrainages"),
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
            name="MandatDepute",
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
                    "dates",
                    django.contrib.postgres.fields.ranges.DateRangeField(
                        default=psycopg2.extras.DateRange(
                            datetime.date(2017, 7, 1), datetime.date(2022, 6, 30), "[)"
                        ),
                        help_text="La date de fin correspond à la date théorique de fin du mandat si elle est dans le futur et à la date effective sinon.",
                        verbose_name="Début et fin du mandat",
                    ),
                ),
                (
                    "statut",
                    models.CharField(
                        choices=[
                            ("INC", "Personne à contacter"),
                            ("DEM", "Mandat ajouté par la personne via son profil"),
                            ("IMP", "Importé par une opération automatique"),
                            ("FXP", "Faux-positif ou fausse déclaration"),
                            ("INS", "Mandat vérifié et confirmé"),
                        ],
                        default="INC",
                        help_text="Indique la qualité de l'information sur cet⋅te élu⋅e, indépendamment des questions politiques et de son appartenance au réseau des élus. Une valeur « Vérifié » signifie que : 1) il a été vérifié que le mandat existe réellement et 2) le compte éventuellement associé appartient bien à la personne élue.",
                        max_length=3,
                        verbose_name="Statut",
                    ),
                ),
                (
                    "conseil",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="data_france.circonscriptionlegislative",
                        verbose_name="Circonscription",
                    ),
                ),
                (
                    "email_officiel",
                    models.ForeignKey(
                        help_text="L'adresse avec laquelle contacter l'élu pour des questions officielles",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="people.personemail",
                        verbose_name="Adresse email officielle",
                    ),
                ),
                (
                    "person",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="mandats_deputes",
                        related_query_name="mandat_depute",
                        to="people.person",
                        verbose_name="Élu",
                    ),
                ),
                (
                    "reference",
                    models.ForeignKey(
                        blank=True,
                        help_text="La fiche correspondant à cet élu dans la base de l'AN",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        to="data_france.depute",
                        verbose_name="Référence dans les données AN",
                    ),
                ),
            ],
            options={
                "verbose_name": "Mandat de député⋅e",
                "verbose_name_plural": "Mandats de député⋅e",
                "ordering": ("person", "conseil"),
            },
            bases=(
                agir.elus.models.UniqueWithinDates,
                agir.elus.models.MandatHistoryMixin,
                models.Model,
            ),
        ),
    ]
