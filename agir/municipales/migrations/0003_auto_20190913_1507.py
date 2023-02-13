# Generated by Django 2.2.4 on 2019-09-13 13:07

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):
    dependencies = [("municipales", "0002_auto_20190830_1414")]

    operations = [
        migrations.AddField(
            model_name="communepage",
            name="created",
            field=models.DateTimeField(
                default=django.utils.timezone.now,
                editable=False,
                verbose_name="created",
            ),
        ),
        migrations.AddField(
            model_name="communepage",
            name="modified",
            field=models.DateTimeField(auto_now=True, verbose_name="modified"),
        ),
    ]
