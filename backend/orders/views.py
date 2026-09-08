from decimal import Decimal

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

        payment_method = request.data.get("payment_method")

        if payment_method not in [
            Order.PaymentMethod.COD,
            Order.PaymentMethod.MOCK,
        ]:
            return Response(
                {
                    "error": "Invalid payment method"
                },
                status=status.HTTP_400_BAD_REQUEST
            )

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

        # Check products and stock before creating order
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
            user=request.user,
            payment_method=payment_method
        )

        total = Decimal("0")

        # Create order items and reduce stock
        for item in cart_items:

            product = item.product

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=item.quantity,
                price=product.price
            )

            total += product.price * item.quantity

            product.stock -= item.quantity

            product.save(
                update_fields=["stock"]
            )

        # Save total
        order.total_amount = total

        # COD orders are confirmed immediately
        if payment_method == Order.PaymentMethod.COD:
            order.status = Order.Status.CONFIRMED

        order.save(
            update_fields=[
                "total_amount",
                "status",
                "updated_at"
            ]
        )

        # Clear cart
        cart.items.all().delete()

        return Response(
            OrderSerializer(order).data,
            status=status.HTTP_201_CREATED
        )


class MockPaymentView(generics.GenericAPIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, pk):

        try:
            order = Order.objects.get(
                id=pk,
                user=request.user
            )
        except Order.DoesNotExist:
            return Response(
                {
                    "error": "Order not found"
                },
                status=status.HTTP_404_NOT_FOUND
            )

        if order.payment_method != Order.PaymentMethod.MOCK:
            return Response(
                {
                    "error": (
                        "Mock payment is not enabled "
                        "for this order"
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if order.payment_status == Order.PaymentStatus.PAID:
            return Response(
                {
                    "message": "Order is already paid"
                }
            )

        # Simulate successful payment
        order.payment_status = Order.PaymentStatus.PAID
        order.status = Order.Status.CONFIRMED

        order.save(
            update_fields=[
                "payment_status",
                "status",
                "updated_at"
            ]
        )

        return Response(
            {
                "message": "Mock payment successful",
                "payment_status": order.payment_status,
                "order_status": order.status
            }
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