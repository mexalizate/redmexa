from django.urls import path, include

urlpatterns = [
    path("", include("agir.front.urls")),
    path("", include("agir.people.urls")),
    path("", include("agir.groups.urls")),
    path("", include("agir.events.urls")),
    path("", include("agir.payments.urls")),
    path("", include("agir.donations.urls")),
    path("", include("agir.polls.urls")),
    path("", include("agir.authentication.urls")),
    path("", include("agir.loans.urls")),
    path("", include("agir.municipales.urls")),
    path("", include("agir.activity.urls")),
    path("", include("agir.msgs.urls")),
    path("", include("agir.notifications.urls")),
    path("", include("agir.presidentielle2022.urls")),
    path("", include("agir.voting_proxies.urls")),
    path("", include("agir.elections.urls")),
    path("", include("agir.event_requests.urls")),
    path("", include("agir.geodata.urls")),
    path("cagnottes/", include("agir.cagnottes.urls")),
    path("ilb/", include("agir.ilb.urls")),
    path("carte/", include("agir.carte.urls")),
    path("data-france/", include("data_france.urls")),
]
