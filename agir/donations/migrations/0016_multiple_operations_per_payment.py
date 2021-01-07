# Generated by Django 2.2.8 on 2019-12-13 16:54

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("donations", "0015_auto_20190804_1831"),
    ]

    operations = [
        migrations.AlterField(
            model_name="operation",
            name="payment",
            field=models.ForeignKey(
                blank=True,
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="payments.Payment",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="operation", unique_together={("payment", "group")}
        ),
    ]
