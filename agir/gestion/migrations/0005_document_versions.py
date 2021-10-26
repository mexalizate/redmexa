# Generated by Django 3.1.12 on 2021-07-08 15:03

from django.db import migrations, models
import django.db.models.deletion
import dynamic_filenames


creer_version_initiale = """
INSERT INTO gestion_versiondocument (date, titre, fichier, document_id)
SELECT modified as date, 'Version initiale' AS titre, fichier AS fichier, id AS document_id
FROM gestion_document
WHERE fichier != '';
"""


sauvegarder_derniere_version_sur_document = """
WITH dernieres_versions AS (
  SELECT DISTINCT ON (document_id) document_id, fichier
  FROM gestion_versiondocument
  ORDER BY document_id, date DESC
)
UPDATE gestion_document AS d
SET fichier = v.fichier
FROM dernieres_versions AS v
WHERE v.document_id = d.id;
"""


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0004_instancecherchable_numero"),
    ]

    operations = [
        migrations.AlterField(
            model_name="projet",
            name="type",
            field=models.CharField(
                choices=[
                    ("CON", "Conférence de presse"),
                    ("REU", "Réunion publique et meetings"),
                    ("REU-loc", "Réunion publique organisée localement"),
                    ("REU-ora", "Réunion publique avec un orateur national"),
                    ("REU-can", "Réunion publique avec un candidat"),
                    ("REU-mee", "Meeting"),
                    ("DEB", "Débats et conférences"),
                    ("DEB-aso", "Débat organisé par une association"),
                    ("DEB-con", "Conférence"),
                    ("DEB-caf", "Café-débat"),
                    ("DEB-pro", "Projection et débat"),
                    ("MAN", "Manifestations et événements publics"),
                    ("MAN-loc", "Manifestation ou marche organisée localement"),
                    ("MAN-nat", "Manifestation ou marche nationale"),
                    ("MAN-pic", "Pique-nique ou apéro citoyen"),
                    ("MAN-eco", "Écoute collective"),
                    ("MAN-fet", "Fête (auberge espagnole)"),
                    ("MAN-car", "Caravane"),
                    ("ACT", "Autres actions publiques"),
                    ("EVE", "Événements spécifiques"),
                    ("EVE-AMF", "AMFiS d'été"),
                    ("EVE-CON", "Convention"),
                    ("RH", "Dépenses RH mensuelles"),
                ],
                max_length=10,
                verbose_name="Type de projet",
            ),
        ),
        migrations.CreateModel(
            name="VersionDocument",
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
                    "date",
                    models.DateTimeField(
                        auto_now_add=True, verbose_name="Date de téléchargement"
                    ),
                ),
                (
                    "titre",
                    models.CharField(
                        max_length=200, verbose_name="Titre de la version"
                    ),
                ),
                (
                    "fichier",
                    models.FileField(
                        upload_to=dynamic_filenames.FilePattern(
                            filename_pattern="gestion/documents/{uuid:.2base32}/{uuid}{ext}"
                        ),
                        verbose_name="Fichier pour cette version",
                    ),
                ),
                (
                    "document",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="versions",
                        related_query_name="version",
                        to="gestion.document",
                    ),
                ),
            ],
            options={"verbose_name": "Version", "ordering": ("document", "date")},
        ),
        migrations.RunSQL(
            sql=creer_version_initiale,
            reverse_sql=sauvegarder_derniere_version_sur_document,
        ),
        migrations.RemoveField(model_name="document", name="fichier",),
    ]