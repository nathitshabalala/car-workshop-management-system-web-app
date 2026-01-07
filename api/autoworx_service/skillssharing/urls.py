from django.urls import path
from .views import (
    AddSkillView,
    ListSkillsView,
    RetrieveSkillView,
    EditSkillView,
    DeleteSkillView,
    GetSkillsByVehicleView,
)

urlpatterns = [
    path('add/', AddSkillView.as_view(), name='add_skill'),
    path('list/', ListSkillsView.as_view(), name='list_skills'),
    path('skill/<int:pk>/', RetrieveSkillView.as_view(), name='retrieve_skill'),
    path('skill/<int:pk>/edit/', EditSkillView.as_view(), name='edit_skill'),
    path('skill/<int:pk>/delete/', DeleteSkillView.as_view(), name='delete_skill'),
    path('vehicle/<int:vehicle_id>/skills/', GetSkillsByVehicleView.as_view(), name='get_skills_by_vehicle'),
]
