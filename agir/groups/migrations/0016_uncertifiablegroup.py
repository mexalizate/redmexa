# Generated by Django 3.2.18 on 2023-03-16 11:10

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("groups", "0015_membership_meta"),
    ]

    operations = [
        migrations.CreateModel(
            name="UncertifiableGroup",
            fields=[],
            options={
                "verbose_name": "Groupe décertifiable",
                "verbose_name_plural": "Groupes décertifiables",
                "proxy": True,
                "default_permissions": ("view", "change"),
                "indexes": [],
                "constraints": [],
            },
            bases=("groups.supportgroup",),
        ),
    ]