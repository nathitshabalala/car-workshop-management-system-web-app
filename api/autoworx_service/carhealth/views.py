"""
Views for the user API.
"""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from core.models import CarHealth
from .serializers import CarHealthSerializer
from rest_framework.decorators import api_view


@extend_schema(tags=['CarHealth'])
class CarHealthCreateView(generics.CreateAPIView):
    queryset = CarHealth.objects.all()
    serializer_class = CarHealthSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

@extend_schema(tags=['CarHealth']) 
@api_view(['GET'])
def get_carhealth_by_car_id(request, car_id):
    cars = CarHealth.objects.filter(car=car_id)
    serializer = CarHealthSerializer(cars, many=True)
    return Response(serializer.data)

@extend_schema(tags=['CarHealth']) 
class CarHealthListView(generics.ListAPIView):
    queryset = CarHealth.objects.all()
    serializer_class = CarHealthSerializer

@extend_schema(tags=['CarHealth']) 
class EditCarHealthView(generics.UpdateAPIView):
    queryset = CarHealth.objects.all()
    serializer_class = CarHealthSerializer
    lookup_field = 'pk'


@extend_schema(tags=['CarHealth']) 
class UpdatedCarHealthView(APIView):
    def patch(self, request, carHealth_id, car_id):
        try:
            # Get the CarHealth
            carHealth = CarHealth.objects.get(pk=car_id)
            
            return Response({"message": "Car Health updated successfully."}, status=status.HTTP_200_OK)

        except CarHealth.DoesNotExist:
            return Response({"error": "Car not found."}, status=status.HTTP_404_NOT_FOUND)

        except CarHealth.DoesNotExist:
            return Response({"error": "Car not found or does not belong to the Car Health."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
