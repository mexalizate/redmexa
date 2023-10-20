from rest_framework import serializers

from . import models


class MexicanMunicipioSerializer(serializers.ModelSerializer):
    state = serializers.SerializerMethodField()

    def get_state(self, obj):
        return obj.state.name

    class Meta:
        model = models.MexicanMunicipio
        fields = ["code", "name", "state"]


class USCountySerializer(serializers.ModelSerializer):
    state = serializers.SerializerMethodField()

    def get_state(self, obj):
        return obj.state.name

    class Meta:
        model = models.USCounty
        fields = ["code", "full_name", "state"]
