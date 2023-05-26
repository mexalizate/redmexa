# Generated by Django 3.2.18 on 2023-05-23 15:00

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("system_pay", "0012_auto_20201021_1525"),
    ]

    operations = [
        migrations.AlterField(
            model_name="systempaytransaction",
            name="status",
            field=models.IntegerField(
                choices=[
                    (0, "Paiement en attente"),
                    (1, "Paiement terminé"),
                    (2, "Paiement abandonné au milieu"),
                    (3, "Paiement annulé avant remise"),
                    (4, "Paiement refusé par la banque"),
                    (6, "Paiement annulé et remboursé après remise"),
                ],
                default=0,
                verbose_name="status",
            ),
        ),
    ]