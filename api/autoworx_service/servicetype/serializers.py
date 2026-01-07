from rest_framework import serializers
from core.models import ServiceType, PredefinedTask, Part, PredefinedPart
from task.serializers import PredefinedTaskSerializer
from part.serializers import PredefinedPartSerializer

class ServiceTypeSerializer(serializers.ModelSerializer):
    predefined_tasks = PredefinedTaskSerializer(many=True)
    # tasks
    predefined_parts = PredefinedPartSerializer(many=True)
    # parts
        
    class Meta:
        model = ServiceType
        fields = ['id', 'name', 'description', 'predefined_tasks', 'predefined_parts', 'labour_cost']
        
    def create(self, validated_data):
        predefined_tasks_data = validated_data.pop('predefined_tasks')
        predefined_parts_data = validated_data.pop('predefined_parts')
        service_type = ServiceType.objects.create(**validated_data)
        for task_data in predefined_tasks_data:
            PredefinedTask.objects.create(service_type=service_type, **task_data)
        for part_data in predefined_parts_data:
            PredefinedPart.objects.create(service_type=service_type, **part_data)
        return service_type

    def update(self, instance, validated_data):
        predefined_tasks_data = validated_data.pop('predefined_tasks')
        predefined_parts_data = validated_data.pop('predefined_parts')
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.labour_cost = validated_data.get('labour_cost', instance.labour_cost)
        instance.save()

        instance.predefined_tasks.all().delete()
        for task_data in predefined_tasks_data:
            PredefinedTask.objects.create(service_type=instance, **task_data)
        
        for part_data in predefined_parts_data:
            PredefinedPart.objects.create(service_type=instance, **part_data)

        return instance