# Generated by Django 2.0.6 on 2018-06-22 14:15

from django.db import migrations


class Migration(migrations.Migration):

    initial = True

    dependencies = [("payments", "0001_creer_modeles")]

    operations = [
        migrations.CreateModel(
            name="CheckPayment",
            fields=[],
            options={
                "verbose_name": "Paiement par chèque",
                "verbose_name_plural": "Paiements par chèque",
                "proxy": True,
                "indexes": [],
            },
            bases=("payments.payment",),
        )
    ]
