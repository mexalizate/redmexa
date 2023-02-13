# Generated by Django 3.2.16 on 2022-11-29 16:29

import agir.donations.model_fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("payments", "0002_auto_20211027_1611"),
        ("donations", "0022_payer_name"),
    ]

    operations = [
        migrations.AddField(
            model_name="monthlyallocation",
            name="departement",
            field=models.CharField(
                blank=True,
                choices=[
                    ("01", "01 - Ain"),
                    ("02", "02 - Aisne"),
                    ("03", "03 - Allier"),
                    ("04", "04 - Alpes-de-Haute-Provence"),
                    ("05", "05 - Hautes-Alpes"),
                    ("06", "06 - Alpes-Maritimes"),
                    ("07", "07 - Ardèche"),
                    ("08", "08 - Ardennes"),
                    ("09", "09 - Ariège"),
                    ("10", "10 - Aube"),
                    ("11", "11 - Aude"),
                    ("12", "12 - Aveyron"),
                    ("13", "13 - Bouches-du-Rhône"),
                    ("14", "14 - Calvados"),
                    ("15", "15 - Cantal"),
                    ("16", "16 - Charente"),
                    ("17", "17 - Charente-Maritime"),
                    ("18", "18 - Cher"),
                    ("19", "19 - Corrèze"),
                    ("2A", "2A - Corse-du-Sud"),
                    ("2B", "2B - Haute-Corse"),
                    ("21", "21 - Côte-d'Or"),
                    ("22", "22 - Côtes-d'Armor"),
                    ("23", "23 - Creuse"),
                    ("24", "24 - Dordogne"),
                    ("25", "25 - Doubs"),
                    ("26", "26 - Drôme"),
                    ("27", "27 - Eure"),
                    ("28", "28 - Eure-et-Loir"),
                    ("29", "29 - Finistère"),
                    ("30", "30 - Gard"),
                    ("31", "31 - Haute-Garonne"),
                    ("32", "32 - Gers"),
                    ("33", "33 - Gironde"),
                    ("34", "34 - Hérault"),
                    ("35", "35 - Ille-et-Vilaine"),
                    ("36", "36 - Indre"),
                    ("37", "37 - Indre-et-Loire"),
                    ("38", "38 - Isère"),
                    ("39", "39 - Jura"),
                    ("40", "40 - Landes"),
                    ("41", "41 - Loir-et-Cher"),
                    ("42", "42 - Loire"),
                    ("43", "43 - Haute-Loire"),
                    ("44", "44 - Loire-Atlantique"),
                    ("45", "45 - Loiret"),
                    ("46", "46 - Lot"),
                    ("47", "47 - Lot-et-Garonne"),
                    ("48", "48 - Lozère"),
                    ("49", "49 - Maine-et-Loire"),
                    ("50", "50 - Manche"),
                    ("51", "51 - Marne"),
                    ("52", "52 - Haute-Marne"),
                    ("53", "53 - Mayenne"),
                    ("54", "54 - Meurthe-et-Moselle"),
                    ("55", "55 - Meuse"),
                    ("56", "56 - Morbihan"),
                    ("57", "57 - Moselle"),
                    ("58", "58 - Nièvre"),
                    ("59", "59 - Nord"),
                    ("60", "60 - Oise"),
                    ("61", "61 - Orne"),
                    ("62", "62 - Pas-de-Calais"),
                    ("63", "63 - Puy-de-Dôme"),
                    ("64", "64 - Pyrénées-Atlantiques"),
                    ("65", "65 - Hautes-Pyrénées"),
                    ("66", "66 - Pyrénées-Orientales"),
                    ("67", "67 - Bas-Rhin"),
                    ("68", "68 - Haut-Rhin"),
                    ("69", "69 - Rhône"),
                    ("70", "70 - Haute-Saône"),
                    ("71", "71 - Saône-et-Loire"),
                    ("72", "72 - Sarthe"),
                    ("73", "73 - Savoie"),
                    ("74", "74 - Haute-Savoie"),
                    ("75", "75 - Paris"),
                    ("76", "76 - Seine-Maritime"),
                    ("77", "77 - Seine-et-Marne"),
                    ("78", "78 - Yvelines"),
                    ("79", "79 - Deux-Sèvres"),
                    ("80", "80 - Somme"),
                    ("81", "81 - Tarn"),
                    ("82", "82 - Tarn-et-Garonne"),
                    ("83", "83 - Var"),
                    ("84", "84 - Vaucluse"),
                    ("85", "85 - Vendée"),
                    ("86", "86 - Vienne"),
                    ("87", "87 - Haute-Vienne"),
                    ("88", "88 - Vosges"),
                    ("89", "89 - Yonne"),
                    ("90", "90 - Territoire de Belfort"),
                    ("91", "91 - Essonne"),
                    ("92", "92 - Hauts-de-Seine"),
                    ("93", "93 - Seine-Saint-Denis"),
                    ("94", "94 - Val-de-Marne"),
                    ("95", "95 - Val-d'Oise"),
                    ("971", "971 - Guadeloupe"),
                    ("972", "972 - Martinique"),
                    ("973", "973 - Guyane"),
                    ("974", "974 - La Réunion"),
                    ("976", "976 - Mayotte"),
                    ("975", "975 - Saint-Pierre-et-Miquelon"),
                    ("977", "977 - Saint-Barthélemy"),
                    ("978", "978 - Saint-Martin"),
                    ("984", "984 - Terres australes et antarctiques françaises"),
                    ("986", "986 - Wallis et Futuna"),
                    ("987", "987 - Polynésie française"),
                    ("988", "988 - Nouvelle-Calédonie"),
                    ("989", "989 - Île de Clipperton"),
                ],
                default=None,
                max_length=200,
                null=True,
                verbose_name="département",
            ),
        ),
        migrations.AddField(
            model_name="monthlyallocation",
            name="type",
            field=models.CharField(
                choices=[
                    ("group", "à un groupe d'action"),
                    ("departement", "à une caisse départementale"),
                    ("cns", "à la caisse nationale de solidarité"),
                ],
                default="group",
                max_length=200,
                verbose_name="type",
            ),
        ),
        migrations.CreateModel(
            name="DepartementOperation",
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
                ("created", models.DateTimeField(auto_now_add=True)),
                ("modified", models.DateTimeField(auto_now=True)),
                (
                    "amount",
                    agir.donations.model_fields.BalanceField(
                        help_text="La valeur doit être positive pour une augmentation d'allocation et négative pour une diminution.",
                        verbose_name="montant net",
                    ),
                ),
                (
                    "departement",
                    models.CharField(
                        choices=[
                            ("01", "01 - Ain"),
                            ("02", "02 - Aisne"),
                            ("03", "03 - Allier"),
                            ("04", "04 - Alpes-de-Haute-Provence"),
                            ("05", "05 - Hautes-Alpes"),
                            ("06", "06 - Alpes-Maritimes"),
                            ("07", "07 - Ardèche"),
                            ("08", "08 - Ardennes"),
                            ("09", "09 - Ariège"),
                            ("10", "10 - Aube"),
                            ("11", "11 - Aude"),
                            ("12", "12 - Aveyron"),
                            ("13", "13 - Bouches-du-Rhône"),
                            ("14", "14 - Calvados"),
                            ("15", "15 - Cantal"),
                            ("16", "16 - Charente"),
                            ("17", "17 - Charente-Maritime"),
                            ("18", "18 - Cher"),
                            ("19", "19 - Corrèze"),
                            ("2A", "2A - Corse-du-Sud"),
                            ("2B", "2B - Haute-Corse"),
                            ("21", "21 - Côte-d'Or"),
                            ("22", "22 - Côtes-d'Armor"),
                            ("23", "23 - Creuse"),
                            ("24", "24 - Dordogne"),
                            ("25", "25 - Doubs"),
                            ("26", "26 - Drôme"),
                            ("27", "27 - Eure"),
                            ("28", "28 - Eure-et-Loir"),
                            ("29", "29 - Finistère"),
                            ("30", "30 - Gard"),
                            ("31", "31 - Haute-Garonne"),
                            ("32", "32 - Gers"),
                            ("33", "33 - Gironde"),
                            ("34", "34 - Hérault"),
                            ("35", "35 - Ille-et-Vilaine"),
                            ("36", "36 - Indre"),
                            ("37", "37 - Indre-et-Loire"),
                            ("38", "38 - Isère"),
                            ("39", "39 - Jura"),
                            ("40", "40 - Landes"),
                            ("41", "41 - Loir-et-Cher"),
                            ("42", "42 - Loire"),
                            ("43", "43 - Haute-Loire"),
                            ("44", "44 - Loire-Atlantique"),
                            ("45", "45 - Loiret"),
                            ("46", "46 - Lot"),
                            ("47", "47 - Lot-et-Garonne"),
                            ("48", "48 - Lozère"),
                            ("49", "49 - Maine-et-Loire"),
                            ("50", "50 - Manche"),
                            ("51", "51 - Marne"),
                            ("52", "52 - Haute-Marne"),
                            ("53", "53 - Mayenne"),
                            ("54", "54 - Meurthe-et-Moselle"),
                            ("55", "55 - Meuse"),
                            ("56", "56 - Morbihan"),
                            ("57", "57 - Moselle"),
                            ("58", "58 - Nièvre"),
                            ("59", "59 - Nord"),
                            ("60", "60 - Oise"),
                            ("61", "61 - Orne"),
                            ("62", "62 - Pas-de-Calais"),
                            ("63", "63 - Puy-de-Dôme"),
                            ("64", "64 - Pyrénées-Atlantiques"),
                            ("65", "65 - Hautes-Pyrénées"),
                            ("66", "66 - Pyrénées-Orientales"),
                            ("67", "67 - Bas-Rhin"),
                            ("68", "68 - Haut-Rhin"),
                            ("69", "69 - Rhône"),
                            ("70", "70 - Haute-Saône"),
                            ("71", "71 - Saône-et-Loire"),
                            ("72", "72 - Sarthe"),
                            ("73", "73 - Savoie"),
                            ("74", "74 - Haute-Savoie"),
                            ("75", "75 - Paris"),
                            ("76", "76 - Seine-Maritime"),
                            ("77", "77 - Seine-et-Marne"),
                            ("78", "78 - Yvelines"),
                            ("79", "79 - Deux-Sèvres"),
                            ("80", "80 - Somme"),
                            ("81", "81 - Tarn"),
                            ("82", "82 - Tarn-et-Garonne"),
                            ("83", "83 - Var"),
                            ("84", "84 - Vaucluse"),
                            ("85", "85 - Vendée"),
                            ("86", "86 - Vienne"),
                            ("87", "87 - Haute-Vienne"),
                            ("88", "88 - Vosges"),
                            ("89", "89 - Yonne"),
                            ("90", "90 - Territoire de Belfort"),
                            ("91", "91 - Essonne"),
                            ("92", "92 - Hauts-de-Seine"),
                            ("93", "93 - Seine-Saint-Denis"),
                            ("94", "94 - Val-de-Marne"),
                            ("95", "95 - Val-d'Oise"),
                            ("971", "971 - Guadeloupe"),
                            ("972", "972 - Martinique"),
                            ("973", "973 - Guyane"),
                            ("974", "974 - La Réunion"),
                            ("976", "976 - Mayotte"),
                            ("975", "975 - Saint-Pierre-et-Miquelon"),
                            ("977", "977 - Saint-Barthélemy"),
                            ("978", "978 - Saint-Martin"),
                            (
                                "984",
                                "984 - Terres australes et antarctiques françaises",
                            ),
                            ("986", "986 - Wallis et Futuna"),
                            ("987", "987 - Polynésie française"),
                            ("988", "988 - Nouvelle-Calédonie"),
                            ("989", "989 - Île de Clipperton"),
                        ],
                        max_length=200,
                        verbose_name="département",
                    ),
                ),
                (
                    "payment",
                    models.ForeignKey(
                        blank=True,
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        to="payments.payment",
                    ),
                ),
            ],
            options={
                "verbose_name": "Opération départementale",
                "verbose_name_plural": "Opérations départementales",
                "unique_together": {("payment", "departement")},
            },
        ),
        migrations.CreateModel(
            name="CNSOperation",
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
                ("created", models.DateTimeField(auto_now_add=True)),
                ("modified", models.DateTimeField(auto_now=True)),
                (
                    "amount",
                    agir.donations.model_fields.BalanceField(
                        help_text="La valeur doit être positive pour une augmentation d'allocation et négative pour une diminution.",
                        verbose_name="montant net",
                    ),
                ),
                (
                    "payment",
                    models.ForeignKey(
                        blank=True,
                        editable=False,
                        null=True,
                        on_delete=django.db.models.deletion.PROTECT,
                        to="payments.payment",
                    ),
                ),
            ],
            options={
                "verbose_name": "Opération CNS",
                "verbose_name_plural": "Opérations CNS",
                "unique_together": {("payment",)},
            },
        ),
    ]
