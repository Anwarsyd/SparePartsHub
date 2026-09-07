from django.urls import path
from .views import (
    BikeBrandListView,
    BikeModelListView,
    CompatiblePartListView,
)

urlpatterns = [
    path("brands/", BikeBrandListView.as_view(), name="bike-brands"),
    path("models/", BikeModelListView.as_view(), name="bike-models"),
    path("parts/", CompatiblePartListView.as_view(), name="compatible-parts"),
]