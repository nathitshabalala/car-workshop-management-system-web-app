from rest_framework import serializers
from task.serializers import TaskSerializer
from core.models import Task, TaskReport
from rest_framework import serializers

# class TaskReportSerializer(serializers.ModelSerializer):
#     Images = serializers.ImageField(required=False, allow_null=True)
    
#     class Meta:
#         model = TaskReport
#         fields = ['id', 'task', 'Comments', 'Images', 'status']

#     def get_taskID(self, obj):
#         return obj.task.id if obj.task else None

#     def create(self, validated_data):
#         task = validated_data.pop('task')
#         task_report = TaskReport.objects.create(task=task, **validated_data)
#         return task_report

class TaskReportSerializer(serializers.ModelSerializer):
    Images = serializers.ImageField(required=False, allow_null=True)
    class Meta:
        model = TaskReport
        fields = ['id', 'task', 'Comments', 'Images', 'status', 'date_completed']

    def get_Images(self, obj):
        request = self.context.get('request')
        if obj.Images:
            return request.build_absolute_uri(obj.Images.url)
        return None

    def create(self, validated_data):
        task = validated_data.pop('task')
        task_report = TaskReport.objects.create(task=task, **validated_data)
        return task_report