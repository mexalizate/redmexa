# Generated by Django 3.2.18 on 2023-04-19 16:04

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("nuntius", "0024_alter_mosaicoimage_file"),
        ("events", "0029_event_event_speaker_foreign_to_many2many"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="email_campaign",
            field=models.OneToOneField(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="event",
                related_query_name="event",
                to="nuntius.campaign",
                verbose_name="Campagne e-mail",
            ),
        ),
        migrations.AddField(
            model_name="eventsubtype",
            name="campaign_template",
            field=models.ForeignKey(
                blank=True,
                help_text="Si une campagne a été sélectionné, celle-ci pourra être utilisée comme modèle pour créer automatiquement une campagne pour un événement de ce type.",
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                related_name="event_subtypes",
                related_query_name="event_subytpe",
                to="nuntius.campaign",
                verbose_name="Modèle de campagne e-mail",
            ),
        ),
    ]
