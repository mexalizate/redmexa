# Generated by Django 3.2.20 on 2023-10-20 23:22

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("people", "0032_person_municipio"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="person",
            name="mandates",
        ),
        migrations.RemoveField(
            model_name="person",
            name="membre_reseau_elus",
        ),
    ]