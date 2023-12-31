# -*- coding: utf-8 -*-
# Generated by Django 1.11.5 on 2017-11-06 16:45
from __future__ import unicode_literals

import django.contrib.postgres.fields.jsonb
from django.db import migrations, models
import django.utils.timezone
import uuid


class Migration(migrations.Migration):
    replaces = [
        ("polls", "0001_initial"),
        ("polls", "0002_polloption"),
        ("polls", "0003_pollchoice"),
    ]

    initial = True

    dependencies = [
        ("people", "0001_creer_modeles"),
    ]

    operations = [
        migrations.CreateModel(
            name="Poll",
            fields=[
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
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                ("title", models.CharField(max_length=255)),
                ("description", models.TextField()),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="PollOption",
            fields=[
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
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                ("description", models.TextField()),
                (
                    "poll",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="polls.Poll"
                    ),
                ),
            ],
            options={"abstract": False},
        ),
        migrations.CreateModel(
            name="PollChoice",
            fields=[
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
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="modified",
                    ),
                ),
                (
                    "id",
                    models.UUIDField(
                        default=uuid.uuid4,
                        editable=False,
                        help_text="UUID interne à l'API pour identifier la ressource",
                        primary_key=True,
                        serialize=False,
                        verbose_name="UUID",
                    ),
                ),
                ("selection", django.contrib.postgres.fields.jsonb.JSONField()),
                (
                    "person",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="people.Person"
                    ),
                ),
                (
                    "poll",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="polls.Poll"
                    ),
                ),
            ],
            options={"abstract": False},
        ),
    ]
