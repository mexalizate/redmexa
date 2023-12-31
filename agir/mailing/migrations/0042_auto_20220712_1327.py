# Generated by Django 3.2.13 on 2022-07-12 11:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mailing", "0041_segment_registration_date_before"),
    ]

    operations = [
        migrations.AddField(
            model_name="segment",
            name="elu_depute",
            field=models.BooleanField(
                default=True, verbose_name="Avec un mandat de député"
            ),
        ),
        migrations.AddField(
            model_name="segment",
            name="elu_depute_europeen",
            field=models.BooleanField(
                default=True, verbose_name="avec un mandat de député européen"
            ),
        ),
    ]
