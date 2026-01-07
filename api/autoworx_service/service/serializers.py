from rest_framework import serializers
from core.models import Service, ServiceType, Car
from task.serializers import TaskSerializer
from servicetype.serializers import ServiceTypeSerializer
from car.serializers import CarSerializer


class ServiceSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    service = serializers.PrimaryKeyRelatedField(
        queryset=ServiceType.objects.all(), write_only=True)
    service_type = ServiceTypeSerializer(read_only=True, required=False)
    car = CarSerializer(read_only=True)  
    car_id = serializers.PrimaryKeyRelatedField(  
        queryset=Car.objects.all(), source='car', write_only=True
    )

    class Meta:
        model = Service
        fields = ['id', 'car', 'car_id', 'service', 'service_type', 'status', 'date', 'tasks']

class CreateServiceSerializer(serializers.ModelSerializer):
    service_type = serializers.PrimaryKeyRelatedField(queryset = ServiceType.objects.all(), write_only=True)
    date = serializers.DateField()
    class Meta:
        model = Service
        fields = ['id', 'car', 'service_type','date']