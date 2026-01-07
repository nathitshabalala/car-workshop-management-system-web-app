from rest_framework import serializers
from core.models import Appointment, Service
from service.serializers import ServiceSerializer

class AppointmentSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), write_only=True
    )
    service_details = ServiceSerializer(read_only=True, source='service')
    
    class Meta:
        model = Appointment
        fields = ['id', 'service', 'date', 'time', 'status', 'service_details']

class CreateAppointmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['id', 'service', 'date', 'time']

class UpdateAppointmentDateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['date']
        
class UpdateAppointmentTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['time']

class UpdateAppointmentStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status']
