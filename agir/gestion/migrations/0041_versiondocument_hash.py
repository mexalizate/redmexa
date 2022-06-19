# Generated by Django 3.2.13 on 2022-06-19 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0040_document_meta"),
    ]

    operations = [
        migrations.AddField(
            model_name="versiondocument",
            name="hash",
            field=models.CharField(
                default="", editable=False, max_length=32, verbose_name="Hash MD5"
            ),
            preserve_default=False,
        ),
    ]
