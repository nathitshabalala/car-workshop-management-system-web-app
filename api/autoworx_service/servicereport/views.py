from django.shortcuts import render
from rest_framework import generics
from core.models import ServiceReport
from drf_spectacular.utils import extend_schema, extend_schema_view

from rest_framework import generics
from core.models import ServiceReport
from .serializers import ServiceReportReadSerializer, ServiceReportUpdateSerializer, ServiceReportWriteSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Service Report'])
class ServiceReportListCreateView(generics.ListCreateAPIView):
    queryset = ServiceReport.objects.all()

    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ServiceReportReadSerializer
        return ServiceReportWriteSerializer

    def perform_create(self, serializer):
        serializer.save()

@extend_schema(tags=['Service Report'])
class ServiceReportUpdateView(generics.UpdateAPIView):
    queryset = ServiceReport.objects.all()
    serializer_class = ServiceReportUpdateSerializer

@extend_schema(tags=['Service Report'])
class ServiceReportByServiceView(generics.ListAPIView):
    serializer_class = ServiceReportReadSerializer

    def get_queryset(self):
        service_id = self.kwargs.get('service_id')
        return ServiceReport.objects.filter(service_id=service_id)