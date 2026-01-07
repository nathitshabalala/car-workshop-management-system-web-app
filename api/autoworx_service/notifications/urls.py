from django.urls import path
from .views import CustomerNotificationsView, MarkNotificationReadView

urlpatterns = [
    path('notifications/', CustomerNotificationsView.as_view(), name='customer-notifications'),
    path('notifications/<int:pk>/read/', MarkNotificationReadView.as_view(), name='mark-notification-read'),
]
