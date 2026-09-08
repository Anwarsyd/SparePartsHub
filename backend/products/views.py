from rest_framework import generics
from .models import Product
from .serializers import ProductSerializer


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True)

        search = self.request.query_params.get("search")
        part_id = self.request.query_params.get("part")

        if search:
            queryset = queryset.filter(
                name__icontains=search
            )

        if part_id:
            queryset = queryset.filter(
                part_id=part_id
            )

        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    queryset = Product.objects.filter(is_active=True)
    serializer_class = ProductSerializer