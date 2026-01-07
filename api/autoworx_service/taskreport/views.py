from django.shortcuts import render

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from core.models import TaskReport
from .serializers import TaskReportSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema(tags=['Task Report'])
class TaskReportListView(generics.ListCreateAPIView):
    queryset = TaskReport.objects.all()
    serializer_class = TaskReportSerializer

    def get_queryset(self):
        queryset = TaskReport.objects.all()
        status = self.request.query_params.get('status', None)
        if status is not None:
            queryset = queryset.filter(status=status.lower() == 'true')
        return queryset

