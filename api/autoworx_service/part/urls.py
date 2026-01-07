from django.urls import path
from .views import *

urlpatterns = [
    # path('', ListServicesView.as_view(), name='list_services'),
    path('add/', PartCreateView.as_view(), name='add_part'),
    path('list/', PartListView.as_view(), name='list_parts'),
    # path('edit/<int:pk>/', EditServiceView.as_view(), name='edit_service'),
    # path('change_status/<int:pk>/', change_service_status, name='change_service_status'),
]