# Generated by Django 2.1.3 on 2018-11-14 14:14

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("clients", "0008_oauth2_provider_old_models")]

    operations = [
        migrations.AlterField(
            model_name="client",
            name="scopes",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.CharField(
                    choices=[
                        ("view_profile", "Voir votre profil"),
                        ("edit_profile", "Changer votre profil"),
                        ("edit_event", "Éditer vos événements"),
                        (
                            "edit_rsvp",
                            "Voir et éditer vos participations aux événements",
                        ),
                        ("edit_supportgroup", "Éditer vos groupes d'action"),
                        (
                            "edit_membership",
                            "Voir et éditer vos participations aux groupes d'action",
                        ),
                        ("edit_authorization", "Éditer vos autorisations d'accès"),
                    ],
                    max_length=255,
                ),
                blank=True,
                default=list,
                help_text="La liste des scopes autorisés pour ce client.",
                size=None,
            ),
        )
    ]
