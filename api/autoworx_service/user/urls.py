"""
URL mappings for the user API.
"""
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static

from . import views  

urlpatterns = [
    path('customer/create/', views.CustomerCreateView.as_view(), name='create'),  
    path('customers', views.CustomerListView.as_view(), name='list'),    
    path('customer/<int:pk>/', views.CustomerDetailView.as_view(), name='me'),  
    path('manager/create/', views.ManagerCreateView.as_view(), name='create'),  
    path('managers', views.ManagerListView.as_view(), name='list'),    
    path('manager/<int:pk>/', views.ManagerDetailView.as_view(), name='me'), 
    path('mechanic/create/', views.MechanicCreateView.as_view(), name='create'),  
    path('mechanics', views.MechanicListView.as_view(), name='list'),    
    path('mechanic/<int:pk>/', views.MechanicDetailView.as_view(), name='me'), 
    path('', views.UserListView.as_view(), name='list'),
    path('login/', views.LoginView.as_view(), name='login')
] 
