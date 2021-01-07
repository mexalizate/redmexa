# Generated by Django 2.2.3 on 2019-07-24 14:28

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import django_prometheus.models


class Migration(migrations.Migration):

    dependencies = [
        ("system_pay", "0003_auto_20190114_1551"),
    ]

    operations = [
        migrations.CreateModel(
            name="SystemPayAlias",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="created",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(auto_now=True, verbose_name="modified"),
                ),
                (
                    "identifier",
                    models.UUIDField(
                        unique=True, verbose_name="Alias de la carte bancaire"
                    ),
                ),
                (
                    "active",
                    models.BooleanField(
                        default=True, verbose_name="L'alias est actif côté systempay"
                    ),
                ),
                (
                    "expiry_date",
                    models.DateField(
                        verbose_name="Date d'expiration de la carte bancaire"
                    ),
                ),
            ],
            options={"abstract": False},
        ),
        migrations.AddField(
            model_name="systempaytransaction",
            name="subscription",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="payments.Subscription",
            ),
        ),
        migrations.AlterField(
            model_name="systempaytransaction",
            name="payment",
            field=models.ForeignKey(
                editable=False,
                null=True,
                on_delete=django.db.models.deletion.PROTECT,
                to="payments.Payment",
            ),
        ),
        migrations.AddField(
            model_name="systempaytransaction",
            name="alias",
            field=models.ForeignKey(
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="system_pay.SystemPayAlias",
            ),
        ),
    ]
