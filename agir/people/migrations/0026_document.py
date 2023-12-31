# Generated by Django 3.2.18 on 2023-05-15 13:00

from django.db import migrations, models
import django.db.models.deletion
import dynamic_filenames


class Migration(migrations.Migration):
    dependencies = [
        ("people", "0025_person_action_radius"),
    ]

    operations = [
        migrations.CreateModel(
            name="Document",
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
                    "titre",
                    models.CharField(max_length=200, verbose_name="Titre du document"),
                ),
                ("date", models.DateField(verbose_name="Date du document")),
                (
                    "type",
                    models.CharField(
                        choices=[("RF", "Reçu fiscal")],
                        max_length=5,
                        verbose_name="Type de document",
                    ),
                ),
                (
                    "fichier",
                    models.FileField(
                        upload_to=dynamic_filenames.FilePattern(
                            filename_pattern="people/person/documents/{uuid:.30base32}{ext}"
                        ),
                        verbose_name="Fichier",
                    ),
                ),
                (
                    "person",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="documents",
                        related_query_name="document",
                        to="people.person",
                    ),
                ),
            ],
        ),
    ]
