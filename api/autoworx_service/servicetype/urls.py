from django.urls import path
from .views import ListServiceTypesView, CreateServiceTypeView, EditServiceTypeView

urlpatterns = [
    path('', ListServiceTypesView.as_view(), name='list_service_types'),
    path('add/', CreateServiceTypeView.as_view(), name='add_service_type'),
    path('edit/<int:pk>/', EditServiceTypeView.as_view(), name='edit_service_type'),
]
