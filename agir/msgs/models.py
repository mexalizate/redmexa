import reversion
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from django.db import models
from stdimage import StdImageField
from django.utils.translation import gettext as _

from agir.groups.models import Membership
from agir.lib.models import TimeStampedModel, BaseAPIResource


class UserReport(TimeStampedModel):
    reporter = models.ForeignKey(
        "people.Person",
        on_delete=models.SET_NULL,
        verbose_name=_("Personne à l'origine du signalement"),
        null=True,
    )

    content_type = models.ForeignKey(
        ContentType, on_delete=models.PROTECT, verbose_name="Type"
    )
    object_id = models.UUIDField()
    reported_object = GenericForeignKey()

    def __str__(self):
        return f"Signalement ({self.id})"

    class Meta:
        verbose_name = "Alertado"
        verbose_name_plural = "Alertados"


class SupportGroupMessageQuerySet(models.QuerySet):
    def active(self):
        return self.filter(
            deleted=False,
            author__role__is_active=True,
        ).exclude(
            supportgroup__is_private_messaging_enabled=False,
            required_membership_type__gte=Membership.MEMBERSHIP_TYPE_MANAGER,
        )


class SupportGroupMessageCommentQuerySet(models.QuerySet):
    def active(self):
        return self.filter(
            deleted=False,
            author__role__is_active=True,
        ).exclude(
            message__supportgroup__is_private_messaging_enabled=False,
            message__required_membership_type__gte=Membership.MEMBERSHIP_TYPE_MANAGER,
        )


class AbstractMessage(BaseAPIResource):
    author = models.ForeignKey(
        "people.Person",
        editable=False,
        on_delete=models.SET_NULL,
        verbose_name=_("Auteur"),
        null=True,
    )
    text = models.TextField(_("Contenu"), max_length=2000)
    image = StdImageField()
    reports = GenericRelation(UserReport)
    deleted = models.BooleanField(_("Supprimé"), default=False)

    class Meta:
        abstract = True


@reversion.register()
class SupportGroupMessage(AbstractMessage):
    objects = SupportGroupMessageQuerySet.as_manager()

    subject = models.CharField(
        "Objet", max_length=150, null=False, blank=True, default=""
    )
    supportgroup = models.ForeignKey(
        "groups.SupportGroup",
        editable=False,
        on_delete=models.PROTECT,
        verbose_name=_("Groupe / équipe"),
        related_name="messages",
    )
    linked_event = models.ForeignKey(
        "events.Event",
        blank=True,
        null=True,
        on_delete=models.PROTECT,
        verbose_name=_("Événement lié"),
    )
    required_membership_type = models.IntegerField(
        "required_membershiptype",
        choices=Membership.MEMBERSHIP_TYPE_CHOICES,
        default=Membership.MEMBERSHIP_TYPE_FOLLOWER,
    )
    recipient_mutedlist = models.ManyToManyField(
        "people.Person",
        related_name=_("messages_muted"),
        verbose_name=_("Liste de personnes en sourdine"),
        blank=True,
    )
    is_locked = models.BooleanField(
        verbose_name=_("Message verrouillé"),
        default=False,
    )
    readonly = models.BooleanField(
        verbose_name=_("Message en lecture seule"),
        default=False,
        help_text=_("Le message s'affichera mais il ne sera pas possible d'y répondre"),
    )

    def __str__(self):
        return f"id: {self.pk} | {self.author} --> '{self.text}' | required_membership_type: {str(self.required_membership_type)} | supportgroup: {self.supportgroup}"

    class Meta:
        verbose_name = "Mensaje de grupo"
        verbose_name_plural = "Mensajes de grupos"


@reversion.register()
class SupportGroupMessageComment(AbstractMessage):
    objects = SupportGroupMessageCommentQuerySet.as_manager()

    message = models.ForeignKey(
        "SupportGroupMessage",
        on_delete=models.PROTECT,
        verbose_name="Message initial",
        related_name="comments",
    )

    class Meta:
        verbose_name = "comentario de mensaje de grupo"
        verbose_name_plural = "comentarios de mensajes de grupos"


class SupportGroupMessageRecipient(TimeStampedModel):
    recipient = models.ForeignKey(
        "people.Person",
        on_delete=models.CASCADE,
        verbose_name=_("Destinataire"),
        related_name="read_messages",
        null=False,
    )
    message = models.ForeignKey(
        "SupportGroupMessage",
        on_delete=models.CASCADE,
        verbose_name=_("Message"),
        related_name="readers",
        null=False,
    )

    def __str__(self):
        return f"{self.recipient} --> {self.message}"

    @property
    def unread_comments(self):
        if self.message.deleted:
            return self.message.comments.none()
        return self.message.comments.exclude(author_id=self.recipient.id).filter(
            created__gt=self.modified
        )

    class Meta:
        verbose_name = _("Message lu par l'utilisateur·ice")
        verbose_name_plural = _("Messages lus par les utilisateur·ices")
        constraints = [
            models.UniqueConstraint(
                fields=["recipient", "message"],
                name="unique_for_message_and_recipient",
            ),
        ]
