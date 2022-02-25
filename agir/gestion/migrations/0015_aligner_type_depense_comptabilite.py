# Generated by Django 3.1.14 on 2022-02-04 18:27

from django.db import migrations, models


CHANGEMENTS_TYPES = [
    ("HCC-G", "PIM-CON", True),
    ("IMM-S", "REU-LOC", True),
    ("HCC-C", "HCC", False),
]


def changer_type_sens_direct(apps, schema):
    Depense = apps.get_model("gestion", "Depense")

    for ancien, nouveau, _ in CHANGEMENTS_TYPES:
        Depense.objects.filter(type=ancien).update(type=nouveau)


def changer_type_sens_inverse(apps, schema):
    Depense = apps.get_model("gestion", "Depense")

    for ancien, nouveau, inverser in CHANGEMENTS_TYPES:
        if inverser:
            Depense.objects.filter(type=nouveau).update(type=ancien)


class Migration(migrations.Migration):

    dependencies = [
        ("gestion", "0014_fournisseur_type_siren"),
    ]

    operations = [
        migrations.AlterField(
            model_name="depense",
            name="type",
            field=models.CharField(
                choices=[
                    ("REU", "Frais divers liées aux réunions publiques"),
                    (
                        "REU-IMP",
                        "Impression et envoi de cartons d'invitation pour une réunion publique",
                    ),
                    (
                        "REU-LOC",
                        "Utilisation d'un local pour les besoins d'une réunion publique",
                    ),
                    ("REU-AME", "Aménagements apportés au local "),
                    ("REU-EC", "Éclairage et sonorisation"),
                    ("REU-ORD", "Éclairage et sonorisation"),
                    ("REU-AUT", "Autres frais liés à une réunion publique"),
                    ("PIM", "Publication et impression (hors R39)"),
                    ("PIM-CON", "Frais de conception et d'impression"),
                    ("PIM-POS", "Frais de distribution et postaux"),
                    ("PIM-PRO", "Frais de promotion"),
                    ("PIM-AUT", "Autres frais d'impression et de publication"),
                    ("AFM", "Achats de fournitures et marchandises"),
                    ("AFM-B", "Achats de fourniture de bureau"),
                    ("AFM-G", "Achats de goodies"),
                    ("AFM-M", "Dépenses de matériel"),
                    ("FBC", "Frais bancaires"),
                    ("FDV", "Frais divers"),
                    ("FRH", "Frais de réception et d'hébergement"),
                    ("FRH-H", "Frais d'hébergement"),
                    ("FRH-A", "Frais de restauration"),
                    ("HEC", "Honoraires de l'expert comptable"),
                    ("HCC", "Honoraires et conseils en communication"),
                    ("IMM", "Location ou mise à disposition immobilière"),
                    ("IMM-L", "Loyers de location"),
                    ("IMM-T", "Travaux au local"),
                    ("IMM-AUT", "Autres frais immobiliers"),
                    ("PAU", "Propagande audiovisuelle"),
                    ("PAU-CON", "Frais de conception et de réalisation audiovisuelle"),
                    (
                        "PAU-DIS",
                        "Frais de reproduction, diffusion et de distribution audiovisuelle",
                    ),
                    ("PAU-PRO", "Frais de promotion audiovisuelle"),
                    ("PAU-AUT", "Autres frais audiovisuels"),
                    ("TRA", "Transports et déplacement"),
                    ("TRA-T", "Billets de train"),
                    ("TRA-A", "Billets d'avion"),
                    ("TRA-L", "Location d'un véhicule"),
                    ("TRA-K", "Frais kilométriques"),
                    ("SAL", "Salaires"),
                    ("REF", "Refacturation"),
                ],
                max_length=7,
                verbose_name="Type de dépense",
            ),
        ),
        migrations.RunPython(
            code=changer_type_sens_direct, reverse_code=changer_type_sens_inverse
        ),
    ]