# Generated by Django 2.2.8 on 2020-01-17 15:29

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [("mailing", "0021_auto_20200117_1520")]

    operations = [
        migrations.AddField(
            model_name="segment",
            name="force_non_insoumis",
            field=models.BooleanField(
                default=False,
                help_text="Inclut par exemple les ancien⋅es donateurices non inscrits sur la plateforme. À utiliser uniquement si vous savez très bien ce que vous faites.",
                verbose_name="Envoyer y compris aux non insoumis",
            ),
        )
    ]
