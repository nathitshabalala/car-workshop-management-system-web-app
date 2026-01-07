from django.urls import path
from .views import *

urlpatterns = [
    path('', ListServicesView.as_view(), name='list_services'),
    path('add/', CreateServiceView.as_view(), name='add_service'),
    path('edit/<int:pk>/', EditServiceView.as_view(), name='edit_service'),
    path('change_status/<int:pk>/', change_service_status, name='change_service_status'),
    path('user/<int:customer_id>/latest_service/', get_latest_services_for_customer, name='latest_service_for_customer'),
]

