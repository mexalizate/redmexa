# Generated by Django 2.2.8 on 2019-12-13 15:08

import django.contrib.gis.db.models.fields
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("mailing", "0019_segment_countries")]

    operations = [
        migrations.AlterField(
            model_name="segment",
            name="area",
            field=django.contrib.gis.db.models.fields.MultiPolygonField(
                blank=True,
                null=True,
                srid=4326,
                verbose_name="Limiter à un territoire définit manuellement",
            ),
        )
    ]
