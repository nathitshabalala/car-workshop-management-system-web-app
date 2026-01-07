from django.db import transaction
from drf_spectacular.utils import extend_schema_field, OpenApiTypes
from rest_framework import serializers
from car.serializers import CarSerializer
from core.models import Car, CarHealth

class CarHealthSerializer(serializers.ModelSerializer):
    car = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.all(), write_only=True
    )
    
    class Meta:
        model = CarHealth
        fields = ['id', 'car', 'odometer', 'battery', 'tires', 'oilLevel', 'brakePads', 'airFilter', 'last_updated']
