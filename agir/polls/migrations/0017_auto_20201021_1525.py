# Generated by Django 3.1.2 on 2020-10-21 13:25

import django.core.serializers.json
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("polls", "0016_poll_authorized_segment"),
    ]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="rules",
            field=models.JSONField(
                default=dict,
                encoder=django.core.serializers.json.DjangoJSONEncoder,
                help_text="Un object JSON décrivant les règles. Actuellement, sont reconnues `options`,`min_options`, `max_options` et `verified_user`",
                verbose_name="Les règles du vote",
            ),
        ),
        migrations.AlterField(
            model_name="pollchoice",
            name="selection",
            field=models.JSONField(
                encoder=django.core.serializers.json.DjangoJSONEncoder
            ),
        ),
    ]
