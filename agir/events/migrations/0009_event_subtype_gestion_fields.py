# Generated by Django 3.1.13 on 2021-07-13 09:32

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0008_event_timezone"),
    ]

    operations = [
        migrations.AddField(
            model_name="eventsubtype",
            name="related_project_type",
            field=models.CharField(
                blank=True,
                choices=[
                    ("CON", "Conférence de presse"),
                    ("REU", "Réunion publique et meetings"),
                    ("REU-loc", "Réunion publique organisée localement"),
                    ("REU-ora", "Réunion publique avec un orateur national"),
                    ("REU-can", "Réunion publique avec un candidat"),
                    ("REU-mee", "Meeting"),
                    ("DEB", "Débats et conférences"),
                    ("DEB-aso", "Débat organisé par une association"),
                    ("DEB-con", "Conférence"),
                    ("DEB-caf", "Café-débat"),
                    ("DEB-pro", "Projection et débat"),
                    ("MAN", "Manifestations et événements publics"),
                    ("MAN-loc", "Manifestation ou marche organisée localement"),
                    ("MAN-nat", "Manifestation ou marche nationale"),
                    ("MAN-pic", "Pique-nique ou apéro citoyen"),
                    ("MAN-eco", "Écoute collective"),
                    ("MAN-fet", "Fête (auberge espagnole)"),
                    ("MAN-car", "Caravane"),
                    ("ACT", "Autres actions publiques"),
                    ("EVE", "Événements spécifiques"),
                    ("EVE-AMF", "AMFiS d'été"),
                    ("EVE-CON", "Convention"),
                    ("RH", "Dépenses RH mensuelles"),
                ],
                max_length=10,
                null=True,
                verbose_name="Type de projet de gestion associé",
            ),
        ),
        migrations.AddField(
            model_name="eventsubtype",
            name="required_documents",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(
                    choices=[
                        ("ATT-GRA", "Attestation de gratuité"),
                        ("ATT-CON", "Attestation de concours en nature"),
                        ("ATT-REG", "Attestation de réglement des consommations"),
                        (
                            "ATT-ESP",
                            "Demande d'autorisation d'occupation de l'espace public",
                        ),
                    ],
                    max_length=10,
                ),
                default=list,
                size=None,
                verbose_name="Attestations requises",
            ),
        ),
        migrations.AlterField(
            model_name="eventsubtype",
            name="type",
            field=models.CharField(
                choices=[
                    ("G", "Réunion privée de groupe"),
                    ("M", "Événement public"),
                    ("A", "Action publique"),
                    ("O", "Autre"),
                ],
                max_length=1,
                verbose_name="Type d'événement",
            ),
        ),
    ]
