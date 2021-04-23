# Generated by Django 3.1.8 on 2021-04-22 14:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0006_auto_20210422_1532"),
    ]

    operations = [
        migrations.AddField(
            model_name="versement",
            name="intitule",
            field=models.CharField(
                default="INTITULE PAR DEFAUT",
                max_length=200,
                verbose_name="Intitulé du réglement",
            ),
            preserve_default=False,
        ),
    ]
