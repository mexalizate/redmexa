from rest_framework import permissions
from rest_framework.generics import (
    ListAPIView,
)
from rest_framework.response import Response

from . import serializers, models


class SearchView(ListAPIView):
    permission_classes = (permissions.AllowAny,)
    search_term_param = "q"

    def list(self, request, *args, **kwargs):
        search_term = request.GET.get(self.search_term_param)
        queryset = self.queryset.search(search_term)[:20]

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class MexicanMunicipioSearchView(SearchView):
    serializer_class = serializers.MexicanMunicipioSerializer
    queryset = models.MexicanMunicipio.objects.select_related("state")


class USCountySearchView(SearchView):
    serializer_class = serializers.USCountySerializer
    queryset = models.USCounty.objects.select_related("state")
