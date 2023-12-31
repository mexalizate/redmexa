# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-07 16:17
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
import django.core.serializers.json
from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [("polls", "0003_auto_20171107_1600")]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="rules",
            field=django.contrib.postgres.fields.jsonb.JSONField(
                default=dict,
                encoder=django.core.serializers.json.DjangoJSONEncoder,
                help_text="Un object JSON décrivant les règles. Actuellement, sont reconnues `min_options` et`max_options",
                verbose_name="Les règles du vote",
            ),
        )
    ]
