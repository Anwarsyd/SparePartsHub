from django.db import transaction

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cart.models import Cart

from .models import Order, OrderItem
from .serializers import OrderSerializer
from decimal import Decimal


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
                {
                    "error": "Cart is empty"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check stock before creating the order
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

        # Create order
        order = Order.objects.create(
            user=request.user
        )

        total = Decimal("0")

        # Create order items
        for item in cart_items:

            product = item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price
            )

            total += product.price * item.quantity

            # Reduce stock
            product.stock -= item.quantity
            product.save(
                update_fields=["stock"]
            )

        # Save total
        order.total_amount = total
        order.save(
            update_fields=["total_amount", "updated_at"]
        )

        # Clear cart
        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class OrderListView(generics.ListAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
            .order_by("-created_at")
        )


class OrderDetailView(generics.RetrieveAPIView):

    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return (
            Order.objects
            .filter(user=self.request.user)
            .prefetch_related("items__product")
        )