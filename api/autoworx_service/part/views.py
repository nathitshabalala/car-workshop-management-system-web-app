from rest_framework import generics
from core.models import Part
from .serializers import PartSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema(tags=['Part']) 
class PartCreateView(generics.CreateAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    
class PartListView(generics.ListAPIView):
    queryset = Part.objects.all()
    serializer_class = PartSerializer
    