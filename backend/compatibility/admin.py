from django.contrib import admin
from .models import BikeBrand, BikeModel, Part


@admin.register(BikeBrand)
class BikeBrandAdmin(admin.ModelAdmin):
    list_display = ["id", "name"]


@admin.register(BikeModel)
class BikeModelAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "brand",
        "name",
        "year_from",
        "year_to",
    ]
    list_filter = ["brand"]


@admin.register(Part)
class PartAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "part_number",
    ]
    search_fields = [
        "name",
        "part_number",
    ]