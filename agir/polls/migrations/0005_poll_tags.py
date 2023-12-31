# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-07 17:01
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0004_auto_20171107_1717"),
    ]

    operations = [
        migrations.AddField(
            model_name="poll",
            name="tags",
            field=models.ManyToManyField(
                blank=True,
                related_name="polls",
                related_query_name="poll",
                to="people.PersonTag",
            ),
        )
    ]
