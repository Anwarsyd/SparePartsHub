from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import BikeBrand, BikeModel, Part
from .serializers import (
    BikeBrandSerializer,
    BikeModelSerializer,
    PartSerializer,
)


class BikeBrandListView(generics.ListAPIView):
    queryset = BikeBrand.objects.all()
    serializer_class = BikeBrandSerializer


class BikeModelListView(generics.ListAPIView):
    serializer_class = BikeModelSerializer

    def get_queryset(self):
        brand_id = self.request.query_params.get("brand")

        queryset = BikeModel.objects.all()

        if brand_id:
            queryset = queryset.filter(brand_id=brand_id)

        return queryset


class CompatiblePartListView(generics.ListAPIView):
    serializer_class = PartSerializer

    def get_queryset(self):
        bike_model_id = self.request.query_params.get("bike_model")

        queryset = Part.objects.all()

        if bike_model_id:
            queryset = queryset.filter(
                compatible_bikes__id=bike_model_id
            )

        return queryset