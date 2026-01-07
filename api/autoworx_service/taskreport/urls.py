from django.urls import path
from .views import TaskReportListView

urlpatterns = [
    path('task-reports/', TaskReportListView.as_view(), name='task-report-list'),
]
