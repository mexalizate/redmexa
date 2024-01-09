from datetime import timedelta

from django.contrib.gis.db.models import MultiPolygonField
from django.db import models
from django.db.models import Q
from django.utils.timezone import now
from django.utils.translation import gettext_lazy as _
from django_countries.fields import CountryField
from nuntius.models import BaseSegment, CampaignSentStatusType

from agir.events.models import RSVP
from agir.groups.models import Membership, SupportGroup
from agir.lib.model_fields import ChoiceArrayField
from agir.payments.models import Subscription, Payment
from agir.people.models import (
    Person,
    PersonQualification,
)

__all__ = ["Segment"]


DATE_HELP_TEXT = _(
    "Écrivez en toute lettre JJ/MM/AAAA plutôt qu'avec le widget, ça ira plus vite."
)

DONATION_FILTER = {
    "payments__type__startswith": "don",
    "payments__status": Payment.STATUS_COMPLETED,
}


def default_newsletters():
    return Person.MAIN_NEWSLETTER_CHOICES


class Segment(BaseSegment, models.Model):
    GA_STATUS_NOT_MEMBER = "N"
    GA_STATUS_MEMBER = "m"
    GA_STATUS_MANAGER = "M"
    GA_STATUS_REFERENT = "R"
    GA_STATUS_CHOICES = (
        (GA_STATUS_NOT_MEMBER, _("Non membres de GA")),
        (GA_STATUS_MEMBER, _("Membres de GA")),
        (GA_STATUS_MANAGER, _("Animateur·ices et gestionnaires de GA")),
        (GA_STATUS_REFERENT, _("Animateur·ices de GA")),
    )

    name = models.CharField(_("Nom"), max_length=255)

    tags = models.ManyToManyField(
        "people.PersonTag",
        help_text=_("Limiter le segment aux personnes ayant les tags sélectionnés"),
        blank=True,
    )
    excluded_tags = models.ManyToManyField(
        "people.PersonTag",
        verbose_name=_("Tags à exclure"),
        help_text=_(
            "Limite le segment aux personnes n'ayant pas les tags sélectionnés "
            "(l'exclusion d'un tag aura la précédence sur son inclusion)"
        ),
        related_name="+",
        blank=True,
    )

    qualifications = models.ManyToManyField(
        "people.Qualification",
        verbose_name=_("Type de statut"),
        blank=True,
    )
    person_qualification_status = ChoiceArrayField(
        models.CharField(choices=PersonQualification.Status.choices, max_length=1),
        verbose_name=_("État du statut"),
        help_text=_(
            "Si un type de statut est indiqué, limiter aux personnes dont les statuts de ce type sont dans l'un des états choisis"
        ),
        default=list,
        blank=True,
        null=False,
    )

    is_political_support = models.BooleanField(
        _("Soutiens politiques"), null=True, blank=True, default=None
    )

    newsletters = ChoiceArrayField(
        models.CharField(choices=Person.Newsletter.choices, max_length=255),
        default=default_newsletters,
        help_text=_("Inclure les personnes abonnées aux newsletters suivantes."),
        blank=True,
    )
    supportgroup_status = models.CharField(
        _("Limiter aux membres de groupes ayant ce statut"),
        max_length=1,
        choices=GA_STATUS_CHOICES,
        blank=True,
    )
    supportgroup_is_certified = models.BooleanField(
        verbose_name="Limiter aux membres de groupes certifiés",
        default=False,
    )
    supportgroups = models.ManyToManyField(
        "groups.SupportGroup",
        verbose_name=_("Limiter aux membres d'un de ces groupes"),
        blank=True,
    )
    supportgroup_types = ChoiceArrayField(
        models.CharField(
            choices=SupportGroup.TYPE_CHOICES, max_length=len(SupportGroup.TYPE_CHOICES)
        ),
        verbose_name=_("Limiter aux membres des groupes d'un ces types"),
        default=list,
        blank=True,
    )
    supportgroup_subtypes = models.ManyToManyField(
        "groups.SupportGroupSubtype",
        verbose_name=_("Limiter aux membres des groupes d'un de ces sous-types"),
        blank=True,
        help_text=_(
            "Ce filtre ne sera pas appliqué lorsque le filtre "
            "'Limiter aux membres d'un de ces groupes' est actif"
        ),
    )
    events = models.ManyToManyField(
        "events.Event",
        verbose_name=_("Limiter aux participant⋅e⋅s à un des événements"),
        blank=True,
    )
    excluded_events = models.ManyToManyField(
        "events.Event",
        verbose_name=_("Exclure les participant⋅e⋅s à un des événements"),
        related_name="+",
        related_query_name="+",
        blank=True,
    )
    events_subtypes = models.ManyToManyField(
        "events.EventSubtype",
        verbose_name=_("Limiter aux participant⋅e⋅s à un événements de ce type"),
        blank=True,
    )
    events_start_date = models.DateTimeField(
        _("Limiter aux participant⋅e⋅s à des événements commençant après cette date"),
        blank=True,
        null=True,
    )
    events_end_date = models.DateTimeField(
        _("Limiter aux participant⋅e⋅s à des événements terminant avant cette date"),
        blank=True,
        null=True,
    )
    events_organizer = models.BooleanField(
        _(
            "Limiter aux organisateurices (sans effet si pas d'autres filtres événements)"
        ),
        blank=True,
        default=False,
    )

    draw_status = models.BooleanField(
        _("Limiter aux gens dont l'inscription au tirage au sort est"),
        null=True,
        blank=True,
        default=None,
    )

    forms = models.ManyToManyField(
        "people.PersonForm",
        verbose_name=_("A répondu à au moins un de ces formulaires"),
        blank=True,
        related_name="+",
    )

    polls = models.ManyToManyField(
        "polls.Poll",
        verbose_name=_("A participé à au moins une de ces consultations"),
        blank=True,
        related_name="+",
    )

    countries = CountryField(_("Limiter aux pays"), multiple=True, blank=True)

    area = MultiPolygonField(
        _("Limiter à un territoire définit manuellement"), blank=True, null=True
    )

    campaigns = models.ManyToManyField(
        "nuntius.Campaign",
        related_name="+",
        verbose_name=_("Limiter aux personnes ayant reçu une des campagnes"),
        blank=True,
    )

    last_open = models.IntegerField(
        _(
            "Limiter aux personnes ayant ouvert un email envoyé au court de derniers jours"
        ),
        help_text=_("Indiquer le nombre de jours"),
        blank=True,
        null=True,
    )

    last_click = models.IntegerField(
        _(
            "Limiter aux personnes ayant cliqué dans un email envoyé au court des derniers jours"
        ),
        help_text=_("Indiquer le nombre de jours"),
        blank=True,
        null=True,
    )

    FEEDBACK_OPEN = 1
    FEEDBACK_CLICKED = 2
    FEEDBACK_NOT_OPEN = 3
    FEEDBACK_NOT_CLICKED = 4
    FEEDBACK_OPEN_NOT_CLICKED = 5
    FEEDBACK_CHOICES = (
        (FEEDBACK_OPEN, _("Personnes ayant ouvert")),
        (FEEDBACK_CLICKED, _("Personnes ayant cliqué")),
        (FEEDBACK_NOT_OPEN, _("Personnes n'ayant pas ouvert")),
        (FEEDBACK_NOT_CLICKED, _("Personnes n'ayant pas cliqué")),
        (FEEDBACK_OPEN_NOT_CLICKED, _("Personnes ayant ouvert mais pas cliqué")),
    )

    campaigns_feedback = models.PositiveSmallIntegerField(
        _("Limiter en fonction de la réaction à ces campagnes"),
        blank=True,
        null=True,
        choices=FEEDBACK_CHOICES,
        help_text=_(
            "Aucun effet si aucune campagne n'est sélectionnée dans le champ précédent"
        ),
    )

    registration_date = models.DateTimeField(
        _("Limiter aux membres inscrit⋅e⋅s après cette date"), blank=True, null=True
    )

    registration_date_before = models.DateTimeField(
        _("Limiter aux membres inscrit⋅e⋅s avant cette date"), blank=True, null=True
    )

    registration_duration = models.IntegerField(
        _("Limiter aux membres inscrit⋅e⋅s depuis au moins un certain nombre d'heures"),
        help_text=_("Indiquer le nombre d'heures"),
        blank=True,
        null=True,
    )

    last_login = models.DateTimeField(
        _(
            "Limiter aux membres s'étant connecté⋅e pour la dernière fois après cette date"
        ),
        blank=True,
        null=True,
    )

    gender = models.CharField(
        _("Genre"), max_length=1, blank=True, choices=Person.GENDER_CHOICES
    )

    born_after = models.DateField(
        _("Personnes nées après le"), blank=True, null=True, help_text=DATE_HELP_TEXT
    )
    born_before = models.DateField(
        _("Personnes nées avant le"), blank=True, null=True, help_text=DATE_HELP_TEXT
    )

    state_of_origin = models.ManyToManyField(
        to="geodata.MexicanState",
        verbose_name=_("État mexicain d'origine"),
        related_name="+",
        blank=True,
    )

    municipio_of_origin = models.ManyToManyField(
        to="geodata.MexicanMunicipio",
        verbose_name=_("Municipio mexican d'origine"),
        related_name="+",
        blank=True,
    )

    exclude_segments = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="+",
        verbose_name="Exclure les personnes membres des segments suivants",
        blank=True,
    )

    add_segments = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="+",
        verbose_name="Ajouter les personnes membres des segments suivants",
        blank=True,
    )

    def apply_event_filters(self, query):
        filters = {}
        excludes = {}

        excluded_event_ids = list(self.excluded_events.values_list("id", flat=True))
        event_ids = list(self.events.values_list("id", flat=True))
        subtype_ids = list(self.events_subtypes.values_list("id", flat=True))

        if self.events_organizer:
            prefix = "organizer_configs__event"
        else:
            prefix = "rsvps__event"

        if len(excluded_event_ids) > 0:
            excludes[f"{prefix}_id__in"] = excluded_event_ids

        if len(event_ids) > 0:
            filters[f"{prefix}_id__in"] = event_ids

        if len(subtype_ids) > 0:
            filters[f"{prefix}__subtype_id__in"] = subtype_ids

        if self.events_start_date is not None:
            filters[f"{prefix}__start_time__gt"] = self.events_start_date

        if self.events_end_date is not None:
            filters[f"{prefix}__end_time__lt"] = self.events_end_date

        if not filters and not excludes:
            return query

        if not self.events_organizer:
            attendee_statuses = (
                RSVP.STATUS_CONFIRMED,
                RSVP.STATUS_AWAITING_PAYMENT,
            )
            if filters:
                filters["rsvps__status__in"] = attendee_statuses

            if excludes:
                excludes["rsvps__status__in"] = attendee_statuses

        if filters:
            query = query & Q(**filters)

        if excludes:
            query = query & ~Q(**excludes)

        return query

    def apply_supportgroup_filters(self, query):
        supportgroup_ids = self.supportgroups.values_list("id", flat=True)
        subtype_ids = self.supportgroup_subtypes.values_list("id", flat=True)

        if (
            not self.supportgroup_status
            and not self.supportgroup_is_certified
            and not self.supportgroup_types
            and len(subtype_ids) == 0
            and len(supportgroup_ids) == 0
        ):
            return query

        # Simplify queries for supportgroup_status only filtering
        if len(subtype_ids) == 0 and len(supportgroup_ids) == 0:
            filter_kwargs = {"memberships__supportgroup__published": True}
            if self.supportgroup_is_certified:
                filter_kwargs[
                    "memberships__supportgroup__certification_date__isnull"
                ] = False
            if self.supportgroup_types:
                filter_kwargs[
                    "memberships__supportgroup__type__in"
                ] = self.supportgroup_types
            if self.supportgroup_status == self.GA_STATUS_REFERENT:
                filter_kwargs[
                    "memberships__membership_type__gte"
                ] = Membership.MEMBERSHIP_TYPE_REFERENT
            if self.supportgroup_status == self.GA_STATUS_MANAGER:
                filter_kwargs[
                    "memberships__membership_type__gte"
                ] = Membership.MEMBERSHIP_TYPE_MANAGER

            if self.supportgroup_status == self.GA_STATUS_NOT_MEMBER:
                return query & ~Q(**filter_kwargs)

            return query & Q(**filter_kwargs)

        # Use membership subquery for multi-field supportgroup filtering
        memberships = Membership.objects.filter(supportgroup__published=True)

        if self.supportgroup_is_certified:
            memberships = memberships.filter(
                supportgroup__certification_date__isnull=False
            )

        if self.supportgroup_types:
            memberships = memberships.filter(
                supportgroup__type__in=self.supportgroup_types
            )

        if len(supportgroup_ids) > 0:
            memberships = memberships.filter(supportgroup_id__in=supportgroup_ids)
        elif len(subtype_ids) > 0:
            memberships = memberships.filter(supportgroup__subtypes__id__in=subtype_ids)

        if self.supportgroup_status == self.GA_STATUS_REFERENT:
            memberships = memberships.filter(
                membership_type__gte=Membership.MEMBERSHIP_TYPE_REFERENT,
            )
        if self.supportgroup_status == self.GA_STATUS_MANAGER:
            memberships = memberships.filter(
                membership_type__gte=Membership.MEMBERSHIP_TYPE_MANAGER,
            )

        member_ids = (
            memberships.distinct("person_id")
            .order_by("person_id")
            .values_list("person_id", flat=True)
        )

        if self.supportgroup_status == self.GA_STATUS_NOT_MEMBER:
            return query & ~Q(id__in=member_ids)

        return query & Q(id__in=member_ids)

    def apply_qualification_filters(self, query):
        qualification_ids = list(self.qualifications.values_list("pk", flat=True))

        if not qualification_ids:
            return query

        person_qualifications = PersonQualification.objects.filter(
            qualification_id__in=qualification_ids
        )

        if self.person_qualification_status:
            person_qualifications = person_qualifications.only_statuses(
                statuses=self.person_qualification_status
            )

        return query & Q(
            id__in=person_qualifications.values_list("person_id", flat=True)
        )

    def apply_tag_filters(self, query):
        excluded_tags = list(self.excluded_tags.values_list("pk", flat=True))
        if len(excluded_tags) > 0:
            query &= ~Q(tags__pk__in=excluded_tags)

        tags = list(self.tags.values_list("pk", flat=True))
        if len(tags) > 0:
            query &= Q(tags__pk__in=tags)

        return query

    def apply_mexican_origin_filter(self, q):
        state_ids = self.state_of_origin.values_list("id", flat=True)
        municipio_ids = self.municipio_of_origin.values_list("id", flat=True)

        if state_ids:
            q = q & Q(municipio__state_id__in=state_ids)

        if municipio_ids:
            q = q & Q(municipio_id__in=municipio_ids)

        return q

    def get_subscribers_q(self):
        # ne pas inclure les rôles inactifs dans les envois de mail
        q = ~Q(role__is_active=False)

        # permettre de créer des segments capables d'inclure des personnes inscrites à aucune des newsletters
        if self.newsletters:
            q &= Q(newsletters__overlap=self.newsletters)

        if self.is_political_support is not None:
            q = q & Q(is_political_support=self.is_political_support)

        q = self.apply_tag_filters(q)

        q = self.apply_qualification_filters(q)

        q = self.apply_supportgroup_filters(q)

        q = self.apply_event_filters(q)

        q = self.apply_mexican_origin_filter(q)

        if self.draw_status is not None:
            q = q & Q(draw_participation=self.draw_status)

        if self.forms.all().count() > 0:
            q = q & Q(form_submissions__form__in=self.forms.all())

        if self.polls.all().count() > 0:
            q = q & Q(poll_choices__poll__in=self.polls.all())

        if self.campaigns.all().count() > 0:
            if self.campaigns_feedback == self.FEEDBACK_OPEN:
                campaign__kwargs = {"campaignsentevent__open_count__gt": 0}
            elif self.campaigns_feedback == self.FEEDBACK_CLICKED:
                campaign__kwargs = {"campaignsentevent__click_count__gt": 0}
            elif self.campaigns_feedback == self.FEEDBACK_NOT_OPEN:
                campaign__kwargs = {"campaignsentevent__open_count": 0}
            elif self.campaigns_feedback == self.FEEDBACK_NOT_CLICKED:
                campaign__kwargs = {"campaignsentevent__click_count": 0}
            elif self.campaigns_feedback == self.FEEDBACK_OPEN_NOT_CLICKED:
                campaign__kwargs = {
                    "campaignsentevent__open_count__gt": 1,
                    "campaignsentevent__click_count": 0,
                }
            else:
                campaign__kwargs = {}

            q = q & Q(
                campaignsentevent__result__in=[
                    CampaignSentStatusType.UNKNOWN,
                    CampaignSentStatusType.OK,
                ],
                campaignsentevent__campaign__in=self.campaigns.all(),
                **campaign__kwargs,
            )

        if self.last_open is not None:
            q = q & Q(
                campaignsentevent__open_count__gt=0,
                campaignsentevent__datetime__gt=now() - timedelta(days=self.last_open),
            )

        if self.last_click is not None:
            q = q & Q(
                campaignsentevent__click_count__gt=0,
                campaignsentevent__datetime__gt=now() - timedelta(days=self.last_click),
            )

        if len(self.countries) > 0:
            q = q & Q(location_country__in=self.countries)

        if self.area is not None:
            q = q & Q(coordinates__intersects=self.area)

        if self.registration_date is not None:
            q = q & Q(created__gt=self.registration_date)

        if self.registration_date_before is not None:
            q = q & Q(created__lt=self.registration_date_before)

        if self.registration_duration:
            q = q & Q(created__lt=now() - timedelta(hours=self.registration_duration))

        if self.last_login is not None:
            q = q & Q(role__last_login__gt=self.last_login)

        if self.gender:
            q = q & Q(gender=self.gender)

        if self.born_after is not None:
            q = q & Q(date_of_birth__gt=self.born_after)

        if self.born_before is not None:
            q = q & Q(date_of_birth__lt=self.born_before)

        return q

    def _get_own_filters_queryset(self):
        qs = Person.objects.all()

        return qs.filter(self.get_subscribers_q()).filter(emails___bounced=False)

    def get_subscribers_queryset(self):
        qs = self._get_own_filters_queryset()

        for s in self.add_segments.all():
            qs = Person.objects.filter(
                Q(pk__in=qs) | Q(pk__in=s.get_subscribers_queryset())
            )

        for s in self.exclude_segments.all():
            qs = qs.exclude(pk__in=s.get_subscribers_queryset())

        return qs.order_by("id", "emails___order").distinct("id")

    def get_subscribers_count(self):
        return (
            self._get_own_filters_queryset().order_by("id").distinct("id").count()
            + sum(s.get_subscribers_count() for s in self.add_segments.all())
            - sum(s.get_subscribers_count() for s in self.exclude_segments.all())
        )

    def is_subscriber(self, person):
        qs = Person.objects.filter(pk=person.pk)
        qs = qs.filter(self.get_subscribers_q())
        is_subscriber = qs.exists()

        if not is_subscriber:
            for segment in self.add_segments.all():
                if segment.is_subscriber(person):
                    is_subscriber = True
                    break

        if is_subscriber:
            for segment in self.exclude_segments.all():
                if segment.is_subscriber(person):
                    is_subscriber = False
                    break

        return is_subscriber

    get_subscribers_count.short_description = "Personnes"
    get_subscribers_count.help_text = "Estimation du nombre d'inscrits"

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = "segmento"
        verbose_name_plural = "segmentos"
