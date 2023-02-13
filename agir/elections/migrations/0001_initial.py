# Generated by Django 3.2.12 on 2022-05-13 11:54

import agir.lib.model_fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import django_countries.fields
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("data_france", "0033_circonscriptionconsulaire_pays"),
        ("people", "0015_add_person_created_id_index"),
    ]

    operations = [
        migrations.CreateModel(
            name="PollingStationOfficer",
            fields=[
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                (
                    "location_name",
                    models.CharField(
                        blank=True, max_length=255, verbose_name="nom du lieu"
                    ),
                ),
                (
                    "location_address1",
                    models.CharField(
                        blank=True, max_length=100, verbose_name="adresse (1ère ligne)"
                    ),
                ),
                (
                    "location_address2",
                    models.CharField(
                        blank=True, max_length=100, verbose_name="adresse (2ème ligne)"
                    ),
                ),
                (
                    "location_citycode",
                    models.CharField(
                        blank=True, max_length=20, verbose_name="code INSEE"
                    ),
                ),
                (
                    "location_city",
                    models.CharField(blank=True, max_length=100, verbose_name="ville"),
                ),
                (
                    "location_zip",
                    models.CharField(
                        blank=True, max_length=20, verbose_name="code postal"
                    ),
                ),
                (
                    "location_state",
                    models.CharField(blank=True, max_length=40, verbose_name="état"),
                ),
                (
                    "location_country",
                    django_countries.fields.CountryField(
                        blank=True, default="FR", max_length=2, verbose_name="pays"
                    ),
                ),
                (
                    "first_name",
                    models.CharField(
                        help_text="Tous les prénoms, tels qu'indiqués à l'état civil",
                        max_length=255,
                        verbose_name="prénoms",
                    ),
                ),
                (
                    "last_name",
                    models.CharField(
                        help_text="Le nom de famille, tel qu'indiqué à l'état civil",
                        max_length=255,
                        verbose_name="nom de famille",
                    ),
                ),
                (
                    "birth_name",
                    models.CharField(
                        blank=True,
                        help_text="Le nom de naissance, si différent du nom de famille",
                        max_length=255,
                        verbose_name="nom de naissance",
                    ),
                ),
                (
                    "gender",
                    models.CharField(
                        choices=[("F", "Femme"), ("M", "Homme")],
                        help_text="Le genre tel qu'indiqué à l'état civil",
                        max_length=1,
                        verbose_name="genre",
                    ),
                ),
                ("birth_date", models.DateField(verbose_name="date de naissance")),
                (
                    "birth_city",
                    models.CharField(max_length=255, verbose_name="ville de naissance"),
                ),
                (
                    "birth_country",
                    django_countries.fields.CountryField(
                        default="FR", max_length=2, verbose_name="pays de naissance"
                    ),
                ),
                (
                    "polling_station",
                    models.CharField(max_length=255, verbose_name="bureau de vote"),
                ),
                (
                    "voter_id",
                    models.CharField(
                        max_length=255, verbose_name="numéro national d'électeur"
                    ),
                ),
                (
                    "role",
                    models.CharField(
                        choices=[
                            ("AT", "Assesseur·e titulaire"),
                            ("AS", "Assesseur·e suppléant·e"),
                            ("D", "Délégué·e"),
                        ],
                        max_length=2,
                        verbose_name="rôle",
                    ),
                ),
                (
                    "has_mobility",
                    models.BooleanField(
                        default=False,
                        help_text="Peut ou non se déplacer dans un bureau de vote différent du sien",
                        verbose_name="Peut se déplacer",
                    ),
                ),
                (
                    "available_voting_dates",
                    agir.lib.model_fields.ChoiceArrayField(
                        base_field=models.CharField(
                            choices=[
                                (
                                    "2022-06-12",
                                    "12 juin 2022 — 1er tour des législatives",
                                ),
                                (
                                    "2022-06-19",
                                    "19 juin 2022 — 2nd tour des législatives",
                                ),
                            ],
                            max_length=255,
                            verbose_name="date du scrutin",
                        ),
                        default=list,
                        size=None,
                        verbose_name="dates de disponibilité",
                    ),
                ),
                (
                    "contact_email",
                    models.EmailField(max_length=254, verbose_name="adresse email"),
                ),
                (
                    "contact_phone",
                    models.CharField(max_length=30, verbose_name="numéro de téléphone"),
                ),
                (
                    "remarks",
                    models.TextField(blank=True, default="", verbose_name="remarques"),
                ),
                (
                    "person",
                    models.OneToOneField(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="polling_station_officer",
                        related_query_name="polling_station_officer",
                        to="people.person",
                        verbose_name="personne",
                    ),
                ),
                (
                    "voting_circonscription_legislative",
                    models.ForeignKey(
                        help_text="Circonscription législative d'inscription aux liste électorales",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="polling_station_officers",
                        related_query_name="polling_station_officer",
                        to="data_france.circonscriptionlegislative",
                        verbose_name="circonscription législative",
                    ),
                ),
                (
                    "voting_commune",
                    models.ForeignKey(
                        blank=True,
                        help_text="Commune d'inscription aux liste électorales",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="polling_station_officers",
                        related_query_name="polling_station_officer",
                        to="data_france.commune",
                        verbose_name="commune",
                    ),
                ),
                (
                    "voting_consulate",
                    models.ForeignKey(
                        blank=True,
                        help_text="Circonscription consulaire d'inscription aux liste électorales",
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="polling_station_officers",
                        related_query_name="polling_station_officer",
                        to="data_france.circonscriptionconsulaire",
                        verbose_name="circonscription consulaire",
                    ),
                ),
            ],
            options={
                "verbose_name": "assesseur·e / délégué·e de bureau de vote",
                "verbose_name_plural": "assesseur·es / délégué·es de bureau de vote",
                "ordering": ("-modified",),
            },
        ),
        migrations.AddIndex(
            model_name="pollingstationofficer",
            index=models.Index(
                fields=["modified"], name="elections_p_modifie_1075d0_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="pollingstationofficer",
            index=models.Index(
                fields=["id", "modified"], name="elections_p_id_8b6a00_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="pollingstationofficer",
            index=models.Index(
                fields=["voting_commune"], name="elections_p_voting__5d0c31_idx"
            ),
        ),
        migrations.AddIndex(
            model_name="pollingstationofficer",
            index=models.Index(
                fields=["voting_consulate"], name="elections_p_voting__6ce462_idx"
            ),
        ),
        migrations.AddConstraint(
            model_name="pollingstationofficer",
            constraint=models.UniqueConstraint(
                fields=("contact_email",),
                name="polling_station_officer_unique_for_email",
            ),
        ),
    ]
