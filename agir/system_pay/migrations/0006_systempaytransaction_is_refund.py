# Generated by Django 2.2.5 on 2019-10-08 16:04

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("system_pay", "0005_systempaytransaction_uuid")]

    operations = [
        migrations.AddField(
            model_name="systempaytransaction",
            name="is_refund",
            field=models.BooleanField(default=False, verbose_name="Remboursement"),
        )
    ]
