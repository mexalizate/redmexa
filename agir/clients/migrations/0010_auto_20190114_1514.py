# Generated by Django 2.1.5 on 2019-01-14 14:14

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [("clients", "0009_auto_20181114_1514")]

    operations = [
        migrations.AlterField(
            model_name="client",
            name="created",
            field=models.DateTimeField(
                default=django.utils.timezone.now, verbose_name="created"
            ),
        ),
        migrations.AlterField(
            model_name="client",
            name="modified",
            field=models.DateTimeField(auto_now=True, verbose_name="modified"),
        ),
    ]
