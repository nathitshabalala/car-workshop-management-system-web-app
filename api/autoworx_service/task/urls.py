from django.urls import path
from .views import *

urlpatterns = [
    path('', ListTasksView.as_view(), name='list_tasks'),
    path('outstanding/<int:service_id>/', ListOutstandingTasksForServiceView.as_view(), name='list_outstanding_tasks_for_service'),
    path('pending/', ListPendingTasksView.as_view(), name='list_pending_tasks'),
    path('mechanic/<int:mechanic_id>/', ListTasksForMechanicView.as_view(), name='list_tasks_for_mechanic'),
    path('edit/<int:pk>/', EditTaskView.as_view(), name='edit_task'),
    path('<int:pk>/status/', update_task_status, name='update-task-status'),
    path('service/<int:service_id>/', ListTasksForServiceView.as_view(), name='list_tasks_for_service'),
]
