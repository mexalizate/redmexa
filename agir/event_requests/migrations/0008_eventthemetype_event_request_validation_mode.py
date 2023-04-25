# Generated by Django 3.2.18 on 2023-04-19 08:57

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("event_requests", "0007_auto_20230418_1034"),
    ]

    operations = [
        migrations.AddField(
            model_name="eventthemetype",
            name="event_request_validation_mode",
            field=models.CharField(
                choices=[
                    ("S", "Validation automatique à la sélection d'un·e intervenant·e"),
                    ("M", "Validation manuelle après sélection des intervenant·es"),
                ],
                default="S",
                max_length=1,
                verbose_name="mode de validation des demandes d'évenements",
            ),
        ),
    ]
