# Generated by Django 3.1.11 on 2021-05-21 09:41

from django.db import migrations


def forward(apps, schema_editor):
    Activity = apps.get_model("activity", "Activity")
    Activity.objects.filter(type="new-event-aroundme").update(type="event-suggestion")


def backward(apps, schema_editor):
    Activity = apps.get_model("activity", "Activity")
    Activity.objects.filter(type="event-suggestion").update(type="new-event-aroundme")


class Migration(migrations.Migration):
    dependencies = [
        ("activity", "0016_auto_20210519_1009"),
    ]

    operations = [
        migrations.RunPython(forward, backward),
    ]
