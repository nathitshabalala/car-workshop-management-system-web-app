"""
URL mappings for the user API.
"""
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import *
from . import views  

urlpatterns = [
    path('create/', views.CarHealthCreateView.as_view(), name='create'),  
    path('', views.CarHealthListView.as_view(), name='list'),    
    path('<int:car_id>/carhealth/', get_carhealth_by_car_id, name='get_carhealth_by_car_id'),
    path('edit/<int:pk>/', views.EditCarHealthView.as_view(), name='edit'),
]