# Generated by Django 3.2.13 on 2022-06-19 12:16

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("gestion", "0039_alter_document_type"),
    ]

    operations = [
        migrations.AddField(
            model_name="document",
            name="meta",
            field=models.JSONField(default=dict, verbose_name="métadonnées"),
        ),
    ]
