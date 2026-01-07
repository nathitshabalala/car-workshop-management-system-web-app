from django.urls import path
from .views import *

urlpatterns = [
    path('makes/', GetAllMakesView.as_view(), name='get_all_makes'),
    path('makes/<str:make>/models/', get_models_by_make, name='get_models_by_make'),
    path('makes/<str:make>/models/<str:model>/years/', get_years_by_model_and_make, name='get_years_by_model_and_make'),
    path('register/', RegisterCarView.as_view(), name='register_car'),
    path('predefined_cars/', ListPredefinedCarsView.as_view(), name='list_predefined_cars'),
    path('all_cars/', ListCarsView.as_view(), name='list_all_cars'),
    path('users/<int:user_id>/cars/', get_cars_by_user, name='get_cars_by_user'),
    path('predefined_cars/add/', AddPredefinedCarView.as_view(), name='add_predefined_car'),
    path('predefined_cars/edit/<int:pk>/', EditPredefinedCarView.as_view(), name='edit_predefined_car'),
    path('user/<int:user_id>/default_car/', GetUserDefaultCarView.as_view(), name='user_default_car'),
    path('user/<int:customer_id>/cars/<int:car_id>/set-default/', ChangeDefaultCarView.as_view(), name='change_default_car'),
]
