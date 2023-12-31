# Generated by Django 2.1.5 on 2019-01-14 14:51

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [("polls", "0011_auto_20190114_1514")]

    operations = [
        migrations.AlterField(
            model_name="poll",
            name="created",
            field=models.DateTimeField(
                default=django.utils.timezone.now,
                editable=False,
                verbose_name="created",
            ),
        ),
        migrations.AlterField(
            model_name="pollchoice",
            name="created",
            field=models.DateTimeField(
                default=django.utils.timezone.now,
                editable=False,
                verbose_name="created",
            ),
        ),
        migrations.AlterField(
            model_name="polloption",
            name="created",
            field=models.DateTimeField(
                default=django.utils.timezone.now,
                editable=False,
                verbose_name="created",
            ),
        ),
    ]
