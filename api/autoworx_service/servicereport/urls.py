from django.urls import path
from .views import ServiceReportByServiceView, ServiceReportListCreateView, ServiceReportUpdateView

urlpatterns = [
    path('service-reports/', ServiceReportListCreateView.as_view(), name='service-report-list-create'),
    path('service-reports/<int:pk>/', ServiceReportUpdateView.as_view(), name='service-report-update'),
    path('service-reports/by-service/<int:service_id>/', ServiceReportByServiceView.as_view(), name='service-report-by-service'),
]
