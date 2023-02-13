# Generated by Django 3.1.7 on 2021-04-01 15:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("events", "0003_has_priority_field_on_event_subtype"),
    ]

    operations = [
        migrations.AddField(
            model_name="event",
            name="online_url",
            field=models.URLField(
                blank=True, default="", verbose_name="Url de visio-conférence"
            ),
        ),
    ]
