from django.urls import path

from .views import (
    CreateOrderView,
    OrderListView,
    OrderDetailView,
    MockPaymentView
)

urlpatterns = [
    path("", CreateOrderView.as_view(), name="order-create"),
    path("my-orders/", OrderListView.as_view(), name="order-list"),
    path("<int:pk>/", OrderDetailView.as_view(), name="order-detail"),
    path("<int:pk>/pay/", MockPaymentView.as_view(), name="mock-payment"),
]