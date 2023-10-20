from django.urls import path

from . import views

app_name = "geodata"

urlpatterns = [
    path(
        "search/mexican_municipio/",
        views.MexicanMunicipioSearchView.as_view(),
        name="search_mexican_municipio",
    ),
    path(
        "search/us_county/",
        views.USCountySearchView.as_view(),
        name="search_us_county",
    ),
]
