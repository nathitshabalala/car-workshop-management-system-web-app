from rest_framework import generics
from core.models import ServiceType
from .serializers import ServiceTypeSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema(tags=['Service Type']) 
class ListServiceTypesView(generics.ListAPIView):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer

@extend_schema(tags=['Service Type']) 
class CreateServiceTypeView(generics.CreateAPIView):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer

@extend_schema(tags=['Service Type']) 
class EditServiceTypeView(generics.UpdateAPIView):
    queryset = ServiceType.objects.all()
    serializer_class = ServiceTypeSerializer
    lookup_field = 'pk'
