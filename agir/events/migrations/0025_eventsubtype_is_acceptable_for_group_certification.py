# Generated by Django 3.2.18 on 2023-03-10 13:10

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0024_event_event_speaker"),
    ]

    operations = [
        migrations.AddField(
            model_name="eventsubtype",
            name="is_acceptable_for_group_certification",
            field=models.BooleanField(
                default=True,
                help_text="Les événements récents de ce sous-type seront pris en compte (ou non) pour ouvrir le droit à un groupe d'action à la certification",
                verbose_name="Accepté pour la certification",
            ),
        ),
        migrations.AlterField(
            model_name="eventsubtype",
            name="is_editable",
            field=models.BooleanField(
                default=True,
                help_text="Les événements de ce sous-type pourront être modifiés par les organisateur·ices, et non seulement par les administrateur·ices",
                verbose_name="Les événements de ce sous-type seront modifiables",
            ),
        ),
    ]