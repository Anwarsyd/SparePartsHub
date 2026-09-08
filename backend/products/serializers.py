from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    part_name = serializers.CharField(
        source="part.name",
        read_only=True
    )
    part_number = serializers.CharField(
        source="part.part_number",
        read_only=True
    )

    class Meta:
        model = Product
        fields = [
            "id",
            "part",
            "part_name",
            "part_number",
            "name",
            "price",
            "stock",
            "image",
            "is_active",
            "created_at",
            "updated_at",
        ]
        read_only_fields = [
            "created_at",
            "updated_at",
        ]