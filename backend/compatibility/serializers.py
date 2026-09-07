from rest_framework import serializers
from .models import BikeBrand, BikeModel, Part


class BikeBrandSerializer(serializers.ModelSerializer):

    class Meta:
        model = BikeBrand
        fields = ["id", "name"]


class BikeModelSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(
        source="brand.name",
        read_only=True
    )

    class Meta:
        model = BikeModel
        fields = [
            "id",
            "brand",
            "brand_name",
            "name",
            "year_from",
            "year_to",
        ]


class PartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Part
        fields = [
            "id",
            "name",
            "part_number",
            "description",
        ]