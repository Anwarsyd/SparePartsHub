from django.db import transaction

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer


class CreateOrderView(generics.CreateAPIView):

    permission_classes = [IsAuthenticated]
    serializer_class = OrderSerializer

    @transaction.atomic
    def create(self, request, *args, **kwargs):

        cart, _ = Cart.objects.get_or_create(
            user=request.user
        )

        cart_items = cart.items.select_related(
            "product"
        )

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        order = Order.objects.create(
            user=request.user
        )

        total = 0

        for item in cart_items:

            if not item.product.is_active:
                return Response(
                    {
                        "error": (
                            f"{item.product.name} "
                            "is no longer available"
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            if item.quantity > item.product.stock:
                return Response(
                    {
                        "error": (
                            f"Not enough stock for "
                            f"{item.product.name}"
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )

            total += item.product.price * item.quantity

        order.total_amount = total
        order.save()

        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(generics.ListAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related("items__product")


class OrderDetailView(generics.RetrieveAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(
            user=self.request.user
        ).prefetch_related("items__product")