from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics, status
from rest_framework.test import APIRequestFactory
from core.models import Appointment, Service
from service.views import change_service_status
from service.serializers import ServiceSerializer
from django.urls import reverse
from .serializers import (
    AppointmentSerializer,
    CreateAppointmentSerializer
)
from drf_spectacular.utils import extend_schema
from .utils import get_available_slots
from datetime import datetime

@extend_schema(tags=['Appointment']) 
class CreateAppointmentView(generics.CreateAPIView):
    serializer_class = CreateAppointmentSerializer
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        appointment = Appointment.objects.get(pk=response.data['id'])
        service = appointment.service

        # Change service status to 'In Progress'
        factory = APIRequestFactory()
        request_data = {'status': 'In Progress'}
        request_instance = factory.patch(reverse('change_service_status', kwargs={'pk': service.pk}), data=request_data)
        change_service_status(request_instance, service.pk)

        return Response({
            'appointment': AppointmentSerializer(appointment).data,
            'service': ServiceSerializer(service).data
        }, status=status.HTTP_201_CREATED)

@extend_schema(tags=['Appointment']) 
class AppointmentListView(generics.ListAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

@extend_schema(tags=['Appointment']) 
class AppointmentUpdateView(generics.UpdateAPIView):
    queryset = Appointment.objects.all()
    serializer_class = AppointmentSerializer

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        # Check if the appointment is canceled
        if instance.status == 'Cancelled':
            service = instance.service
            service.status = Service.STATUS_CANCELED
            service.save()

        return Response(serializer.data)
    
@extend_schema(tags=['Appointment']) 
class UserAppointmentListView(generics.ListAPIView):
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        return Appointment.objects.filter(service__car__customer__user__id=user_id).order_by('date')

@extend_schema(tags=['Appointment'])     
class AvailableSlotsView(APIView):
    def get(self, request, date_str):
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return Response({'error': 'Invalid date format. Use YYYY-MM-DD.'}, status=status.HTTP_400_BAD_REQUEST)
        
        appointments = Appointment.objects.filter(date=date)
        available_slots = get_available_slots(date, appointments)
        
        return Response({'available_slots': available_slots}, status=status.HTTP_200_OK)