from django.urls import path
from .views import (
    CreateAppointmentView,
    AppointmentListView,
    AppointmentUpdateView,
    UserAppointmentListView,
    AvailableSlotsView
)

urlpatterns = [
    path('', AppointmentListView.as_view(), name='appointment-list'),
    path('create/', CreateAppointmentView.as_view(), name='appointment-create'),
    path('appointments/update/<int:pk>/', AppointmentUpdateView.as_view(), name='appointment-update'),
    path('user/<int:user_id>/', UserAppointmentListView.as_view(), name='user-appointments'),
    path('available-slots/<str:date_str>/', AvailableSlotsView.as_view(), name='available-slots'),

]
