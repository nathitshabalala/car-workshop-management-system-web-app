from rest_framework import serializers
from core.models import ServiceType, PredefinedTask, Service, Task, Mechanic, Car
from user.serializers import MechanicSerializer
from car.serializers  import CarSerializer

class PredefinedTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedTask
        fields = ['id', 'description']

class ServiceTypeSerializer(serializers.ModelSerializer):
    predefined_tasks_id = serializers.PrimaryKeyRelatedField(
        queryset=PredefinedTask.objects.all(), many=True, source='predefined_tasks', write_only=True
    )
    predefined_tasks = PredefinedTaskSerializer(many=True, read_only=True,  required=False)
    
    class Meta:
        model = ServiceType
        fields = ['id', 'name', 'description', 'predefined_tasks', 'predefined_tasks_id']

class ServiceSerializers(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(), write_only=True)
    service_type = ServiceTypeSerializer(read_only=True, required=False)
    car = CarSerializer(read_only=True)  
    car_id = serializers.PrimaryKeyRelatedField(  
        queryset=Car.objects.all(), source='car', write_only=True
    )

    class Meta:
        model = Service
        fields = ['id', 'car', 'car_id', 'service', 'service_type', 'status', 'date']


class TaskSerializer(serializers.ModelSerializer):
    assigned_to = MechanicSerializer(read_only=True)
    assigned_to_id = serializers.PrimaryKeyRelatedField(
        queryset=Mechanic.objects.all(), source='assigned_to', write_only=True
    )
    service = ServiceSerializers(read_only=True)
    
    class Meta:
        model = Task
        fields = ['id', 'service', 'description', 'assigned_to', 'assigned_to_id' , 'status', 'service_type', 'created_at']

