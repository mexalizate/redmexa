# Generated by Django 3.1.14 on 2022-01-12 15:15

import agir.lib.history
import agir.lib.models
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion


CREATE_PREFIXES_FUNCTION = """
CREATE FUNCTION prefixes_array (text)
 RETURNS text[]
 AS 'SELECT ARRAY_AGG(substring($1 FROM 1 FOR i)) FROM generate_series(0, char_length($1)) AS s(i);'
 LANGUAGE SQL
 IMMUTABLE
 RETURNS NULL ON NULL INPUT
 PARALLEL SAFE;
"""

DROP_PREFIXES_FUNCTION = """
DROP FUNCTION prefixes_array (text);
"""


class Migration(migrations.Migration):

    dependencies = [
        ("people", "0015_add_person_created_id_index"),
        ("contenttypes", "0002_remove_content_type_name"),
        ("auth", "0012_alter_user_first_name_max_length"),
        ("elus", "0032_valeurs_initiales_index"),
    ]

    operations = [
        migrations.RunSQL(
            sql=CREATE_PREFIXES_FUNCTION, reverse_sql=DROP_PREFIXES_FUNCTION
        ),
        migrations.CreateModel(
            name="Scrutin",
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
                ("nom", models.CharField(max_length=60, verbose_name="Nom du scrutin")),
                (
                    "type_scrutin",
                    models.CharField(
                        choices=[
                            ("LUT", "Scrutin de liste à un tour"),
                            ("LDT", "Scrutin de liste à deux tours"),
                            ("UDT", "Scrutin uninominal à deux tours"),
                        ],
                        max_length=10,
                        verbose_name="Type de scrutin",
                    ),
                ),
                (
                    "circonscription_content_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="contenttypes.contenttype",
                    ),
                ),
                ("date", models.DateField(verbose_name="Date du scrutin")),
            ],
            bases=(agir.lib.history.HistoryMixin, models.Model),
            options={"ordering": ("-date",)},
        ),
        migrations.CreateModel(
            name="Candidature",
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
                    "code",
                    models.CharField(
                        default=agir.lib.utils.numero_unique,
                        editable=False,
                        help_text="Code unique pour identifier une candidature.",
                        max_length=7,
                        unique=True,
                        verbose_name="Code candidature",
                    ),
                ),
                ("circonscription_object_id", models.IntegerField()),
                (
                    "etat",
                    models.IntegerField(
                        choices=[
                            (-50, "État inconnu"),
                            (-20, "Rejeté (raison à préciser)"),
                            (-10, "Rejeté car incomplet"),
                            (0, "Pas encore relue"),
                            (10, "Complet"),
                            (20, "Retenu pour examen"),
                            (100, "Choisie et validée"),
                        ],
                        default=0,
                        verbose_name="État de cette candidature",
                    ),
                ),
                (
                    "date",
                    models.DateTimeField(
                        editable=False,
                        help_text="Date à laquelle la candidature a été reçue",
                        null=True,
                        verbose_name="Date de candidature",
                    ),
                ),
                (
                    "type_candidature",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("", "Inapplicable"),
                            ("T", "Titulaire"),
                            ("S", "Suppléant"),
                            ("I", "Indifférent"),
                        ],
                        max_length=1,
                        verbose_name="type de candidature souhaitée",
                    ),
                ),
                (
                    "nom",
                    models.CharField(max_length=255, verbose_name="nom de famille"),
                ),
                ("prenom", models.CharField(max_length=255, verbose_name="prénom")),
                (
                    "sexe",
                    models.CharField(
                        choices=[("M", "Masculin"), ("F", "Féminin")],
                        max_length=1,
                        verbose_name="sexe à l'état civil",
                    ),
                ),
                (
                    "date_naissance",
                    models.DateField(verbose_name="date de naissance"),
                ),
                (
                    "code_postal",
                    models.CharField(max_length=20, verbose_name="Code postal"),
                ),
                (
                    "ville",
                    models.CharField(max_length=200, verbose_name="Ville"),
                ),
                (
                    "categorie_socio_professionnelle",
                    models.IntegerField(
                        choices=[
                            (1, "Agriculteurs exploitants"),
                            (10, "Agriculteurs exploitants"),
                            (11, "Agriculteurs sur petite exploitation"),
                            (12, "Agriculteurs sur moyenne exploitation"),
                            (13, "Agriculteurs sur grande exploitation"),
                            (2, "Artisans, commerçants et chefs d'entreprise"),
                            (21, "Artisans"),
                            (22, "Commerçants et assimilés"),
                            (23, "Chefs d'entreprise de 10 salariés ou plus"),
                            (3, "Cadres et professions intellectuelles supérieures"),
                            (31, "Professions libérales et assimilés"),
                            (
                                32,
                                "Cadres de la fonction publique, professions intellectuelles et  artistiques",
                            ),
                            (33, "Cadres de la fonction publique"),
                            (34, "Professeurs, professions scientifiques"),
                            (
                                35,
                                "Professions de l'information, des arts et des spectacles",
                            ),
                            (36, "Cadres d'entreprise"),
                            (37, "Cadres administratifs et commerciaux d'entreprise"),
                            (38, "Ingénieurs et cadres techniques d'entreprise"),
                            (4, "Professions Intermédiaires"),
                            (
                                41,
                                "Professions intermédiaires de l'enseignement, de la santé, de la fonction publique et assimilés",
                            ),
                            (42, "Professeurs des écoles, instituteurs et assimilés"),
                            (
                                43,
                                "Professions intermédiaires de la santé et  du travail social",
                            ),
                            (44, "Clergé, religieux"),
                            (
                                45,
                                "Professions intermédiaires administratives de la fonction publique",
                            ),
                            (
                                46,
                                "Professions intermédiaires administratives et commerciales des entreprises",
                            ),
                            (47, "Techniciens"),
                            (48, "Contremaîtres, agents de maîtrise"),
                            (5, "Employés"),
                            (51, "Employés de la fonction publique"),
                            (
                                52,
                                "Employés civils et agents de service de la fonction publique",
                            ),
                            (53, "Policiers et militaires"),
                            (54, "Employés administratifs d'entreprise"),
                            (55, "Employés de commerce"),
                            (56, "Personnels des services directs aux particuliers"),
                            (6, "Ouvriers"),
                            (61, "Ouvriers qualifiés"),
                            (62, "Ouvriers qualifiés de type industriel"),
                            (63, "Ouvriers qualifiés de type artisanal"),
                            (64, "Chauffeurs"),
                            (
                                65,
                                "Ouvriers qualifiés de la manutention, du magasinage et du transport",
                            ),
                            (66, "Ouvriers non qualifiés"),
                            (67, "Ouvriers non qualifiés de type industriel"),
                            (68, "Ouvriers non qualifiés de type artisanal"),
                            (69, "Ouvriers agricoles"),
                            (7, "Retraités"),
                            (71, "Anciens agriculteurs exploitants"),
                            (72, "Anciens artisans, commerçants, chefs d'entreprise"),
                            (73, "Anciens cadres et professions intermédiaires"),
                            (74, "Anciens cadres"),
                            (75, "Anciennes professions intermédiaires"),
                            (76, "Anciens employés et ouvriers"),
                            (77, "Anciens employés"),
                            (78, "Anciens ouvriers"),
                            (8, "Autres personnes sans activité professionnelle"),
                            (81, "Chômeurs n'ayant jamais travaillé"),
                            (82, "Inactifs divers (autres que retraités)"),
                            (83, "Militaires du contingent"),
                            (84, "Elèves, étudiants"),
                            (
                                85,
                                "Personnes diverses sans activité  professionnelle de moins de 60 ans (sauf retraités)",
                            ),
                            (
                                86,
                                "Personnes diverses sans activité professionnelle de 60 ans et plus (sauf retraités)",
                            ),
                        ],
                        null=True,
                        verbose_name="Catégorie socioprofessionnelle",
                    ),
                ),
                (
                    "profession_foi",
                    agir.lib.models.DescriptionField(verbose_name="profession de foi"),
                ),
                (
                    "informations",
                    agir.lib.models.DescriptionField(
                        blank=True,
                        help_text="Merci de n'indiquer que des éléments factuels.",
                        verbose_name="informations supplémentaires",
                    ),
                ),
                (
                    "meta",
                    models.JSONField(
                        blank=True,
                        default=dict,
                        help_text="éléments techniques supplémentaires",
                        verbose_name="autres données",
                    ),
                ),
                (
                    "circonscription_content_type",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="contenttypes.contenttype",
                    ),
                ),
                (
                    "person",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="candidatures",
                        related_query_name="candidature",
                        to="people.person",
                    ),
                ),
                (
                    "scrutin",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.PROTECT, to="elus.scrutin"
                    ),
                ),
            ],
            bases=(agir.lib.history.HistoryMixin, models.Model),
        ),
        migrations.CreateModel(
            name="Autorisation",
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
                    "prefixes",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.CharField(max_length=20),
                        default=list,
                        help_text="Préfixes des circonscriptions sur lesquelles portent les permissions.",
                        size=None,
                        verbose_name="préfixes",
                    ),
                ),
                (
                    "ecriture",
                    models.BooleanField(
                        default=False, verbose_name="Droits de modification"
                    ),
                ),
                (
                    "groupe",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="auth.group"
                    ),
                ),
                (
                    "scrutin",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE, to="elus.scrutin"
                    ),
                ),
            ],
        ),
    ]