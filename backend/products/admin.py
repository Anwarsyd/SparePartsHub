from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "part",
        "price",
        "stock",
        "is_active",
    ]

    list_filter = [
        "is_active",
    ]

    search_fields = [
        "name",
        "part__name",
        "part__part_number",
    ]