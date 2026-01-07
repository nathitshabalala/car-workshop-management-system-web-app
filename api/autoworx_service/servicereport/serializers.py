from django.db import transaction
from drf_spectacular.utils import extend_schema_field, OpenApiTypes
from rest_framework import serializers
from service.serializers import ServiceSerializer
from taskreport.serializers import TaskReportSerializer
from core.models import Service, ServiceReport, TaskReport


class ServiceReportWriteSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())
    task_reports = serializers.PrimaryKeyRelatedField(queryset=TaskReport.objects.all(), many=True)

    class Meta:
        model = ServiceReport
        fields = ['id', 'service', 'task_reports', 'last_updated']

class ServiceReportReadSerializer(serializers.ModelSerializer):
    service = ServiceSerializer()
    task_reports = TaskReportSerializer(many=True)

    class Meta:
        model = ServiceReport
        fields = ['id', 'service', 'task_reports', 'last_updated']


class ServiceReportUpdateSerializer(serializers.ModelSerializer):
    task_reports = serializers.PrimaryKeyRelatedField(
        queryset=TaskReport.objects.all(),
        many=True,
        required=False
    )

    class Meta:
        model = ServiceReport
        fields = ['task_reports', 'last_updated']

    def update(self, instance, validated_data):
        # Get the list of task reports from validated_data
        new_task_reports = validated_data.pop('task_reports', [])

        # Add new task reports to the existing ones without removing previous ones
        if new_task_reports:
            instance.task_reports.add(*new_task_reports)  # Add new task reports

        # Update last_updated field
        instance.last_updated = validated_data.get('last_updated', instance.last_updated)
        instance.save()
        
        return instance