# Generated by Django 3.2.16 on 2023-01-09 14:49

from django.db import migrations, models


def creer_sous_type_boucle_departementale(apps, schema):
    SupportGroupSubtype = apps.get_model("groups", "SupportGroupSubtype")

    SupportGroupSubtype.objects.update_or_create(
        label="boucle départementale",
        defaults={
            "type": "D",  # TYPE_BOUCLE_DEPARTEMENTALE
            "description": "Boucle départementale",
            "visibility": "D",  # VISIBILITY_ADMIN
        },
    )


def supprimer_sous_type_boucle_departementale(apps, schema):
    SupportGroupSubtype = apps.get_model("groups", "SupportGroupSubtype")
    SupportGroupSubtype.objects.filter(type="D").delete()


class Migration(migrations.Migration):
    dependencies = [
        ("groups", "0013_add_supportgroup_editable_field"),
    ]

    operations = [
        migrations.AlterField(
            model_name="supportgroup",
            name="type",
            field=models.CharField(
                choices=[
                    ("L", "Groupe local"),
                    ("B", "Groupe thématique"),
                    ("F", "Groupe fonctionnel"),
                    ("D", "Boucle départementale"),
                ],
                default="L",
                max_length=1,
                verbose_name="type de groupe",
            ),
        ),
        migrations.AlterField(
            model_name="supportgroupsubtype",
            name="type",
            field=models.CharField(
                choices=[
                    ("L", "Groupe local"),
                    ("B", "Groupe thématique"),
                    ("F", "Groupe fonctionnel"),
                    ("D", "Boucle départementale"),
                ],
                max_length=1,
                verbose_name="type de groupe",
            ),
        ),
        migrations.RunPython(
            code=creer_sous_type_boucle_departementale,
            reverse_code=supprimer_sous_type_boucle_departementale,
        ),
    ]
