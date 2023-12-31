# Generated by Django 3.1.7 on 2021-04-06 15:17

from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone
import uuid


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("people", "0004_display_name_and_image"),
        ("groups", "0002_creer_sous_types"),
    ]

    operations = [
        migrations.CreateModel(
            name="Subscription",
            fields=[
                (
                    "created",
                    models.DateTimeField(
                        default=django.utils.timezone.now,
                        editable=False,
                        verbose_name="date de création",
                    ),
                ),
                (
                    "modified",
                    models.DateTimeField(
                        auto_now=True, verbose_name="dernière modification"
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
                (
                    "type",
                    models.CharField(
                        choices=[("email", "Email"), ("push", "Push")],
                        max_length=5,
                        verbose_name="Type",
                    ),
                ),
                (
                    "activity_type",
                    models.CharField(
                        choices=[
                            ("waiting-payment", "Paiement en attente"),
                            ("group-invitation", "Invitation à un groupe"),
                            ("new-member", "Nouveau membre dans le groupe"),
                            (
                                "group-membership-limit-reminder",
                                "Les membres du groupes sont de plus en plus nombreux",
                            ),
                            ("new-message", "Nouveau message dans un de vos groupes"),
                            (
                                "new-comment",
                                "Nouveau commentaire dans une de vos discussions",
                            ),
                            (
                                "waiting-location-group",
                                "Préciser la localisation du groupe",
                            ),
                            (
                                "group-coorganization-invite",
                                "Invitation à coorganiser un groupe reçue",
                            ),
                            (
                                "waiting-location-event",
                                "Préciser la localisation d'un événement",
                            ),
                            (
                                "group-coorganization-accepted",
                                "Invitation à coorganiser un groupe acceptée",
                            ),
                            (
                                "group-info-update",
                                "Mise à jour des informations du groupe",
                            ),
                            (
                                "accepted-invitation-member",
                                "Invitation à rejoindre un groupe acceptée",
                            ),
                            (
                                "new-attendee",
                                "Un nouveau participant à votre événement",
                            ),
                            ("event-update", "Mise à jour d'un événement"),
                            (
                                "new-event-mygroups",
                                "Votre groupe organise un événement",
                            ),
                            ("new-report", "Nouveau compte-rendu d'événement"),
                            ("new-event-aroundme", "Nouvel événement près de chez moi"),
                            ("cancelled-event", "Événement annulé"),
                            ("referral-accepted", "Personne parrainée"),
                            ("announcement", "Associée à une annonce"),
                            (
                                "transferred-group-member",
                                "Un membre d'un groupe a été transferé vers un autre groupe",
                            ),
                            (
                                "new-members-through-transfer",
                                "De nouveaux membres ont été transferés vers le groupe",
                            ),
                            ("group-creation-confirmation", "Groupe créé"),
                        ],
                        max_length=50,
                        verbose_name="Type",
                    ),
                ),
                (
                    "membership",
                    models.ForeignKey(
                        null=True,
                        on_delete=django.db.models.deletion.CASCADE,
                        to="groups.membership",
                    ),
                ),
                (
                    "person",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="notification_subscriptions",
                        to="people.person",
                    ),
                ),
            ],
        ),
        migrations.AddConstraint(
            model_name="subscription",
            constraint=models.UniqueConstraint(
                fields=("person", "type", "activity_type", "membership"),
                name="unique_with_membership",
            ),
        ),
        migrations.AddConstraint(
            model_name="subscription",
            constraint=models.UniqueConstraint(
                condition=models.Q(membership=None),
                fields=("person", "type", "activity_type"),
                name="unique_without_membership",
            ),
        ),
    ]
