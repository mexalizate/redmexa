# Generated by Django 3.1.2 on 2020-10-21 13:25

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("system_pay", "0011_auto_20200817_1841"),
    ]

    operations = [
        migrations.AlterField(
            model_name="systempaytransaction",
            name="webhook_calls",
            field=models.JSONField(
                blank=True, default=list, verbose_name="Événements de paiement"
            ),
        ),
    ]
