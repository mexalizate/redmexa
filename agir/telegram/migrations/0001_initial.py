# Generated by Django 2.2.7 on 2019-11-15 14:43

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [migrations.swappable_dependency(settings.NUNTIUS_SEGMENT_MODEL)]

    operations = [
        migrations.CreateModel(
            name="TelegramSession",
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
                    "phone_number",
                    phonenumber_field.modelfields.PhoneNumberField(
                        max_length=128,
                        region=None,
                        unique=True,
                        verbose_name="Numéro de téléphone",
                    ),
                ),
                (
                    "session_string",
                    models.TextField(
                        blank=True, editable=False, verbose_name="Chaîne de session"
                    ),
                ),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="TelegramGroup",
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
                    "name",
                    models.CharField(
                        max_length=100, verbose_name="Nom du groupe / channel"
                    ),
                ),
                (
                    "telegram_id",
                    models.BigIntegerField(
                        editable=False,
                        null=True,
                        verbose_name="Identifiant du groupe sur Telegram",
                    ),
                ),
                (
                    "type",
                    models.CharField(
                        choices=[("channel", "Channel"), ("supergroup", "Supergroupe")],
                        max_length=10,
                    ),
                ),
                (
                    "admin_session",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="groups",
                        to="telegram.TelegramSession",
                        verbose_name="La session Telegram admin de ce groupe.",
                    ),
                ),
                (
                    "segment",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT,
                        related_name="telegram_groups",
                        to=settings.NUNTIUS_SEGMENT_MODEL,
                        verbose_name="Le segment sur lequel se baser pour constituer la liste.",
                    ),
                ),
            ],
            options={"abstract": False},
        ),
    ]
