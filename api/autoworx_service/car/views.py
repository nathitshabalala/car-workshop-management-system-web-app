from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from core.models import PredefinedCar, Car, Customer
from .serializers import PredefinedCarSerializer, CarSerializer
from rest_framework.exceptions import NotFound
from drf_spectacular.utils import extend_schema, extend_schema_view
from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.views.decorators.http import require_POST
from django.contrib import messages


@extend_schema(tags=['Car']) 
class GetUserCarsView(generics.ListAPIView):
    serializer_class = CarSerializer
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        try:
            # Retrieve the Customer associated with the User ID
            customer = Customer.objects.get(user_id=user_id)
        except Customer.DoesNotExist:
            raise NotFound(f'Customer with user ID {user_id} not found.')
        # Return all cars associated with this customer
        return Car.objects.filter(customer=customer)

@extend_schema(tags=['Car']) 
class GetUserDefaultCarView(generics.RetrieveAPIView):
    serializer_class = CarSerializer

    def get_object(self):
        user_id = self.kwargs['user_id']
        try:
            # Retrieve the Customer associated with the User ID
            customer = Customer.objects.get(user_id=user_id)
        except Customer.DoesNotExist:
            raise NotFound(f'Customer with user ID {user_id} not found.')
        # Fetch the customer's default car
        car = Car.objects.filter(customer=customer, is_default=True).first()
        if not car:
            raise NotFound('Default car not found.')
        return car


@extend_schema(tags=['Car']) 
class GetAllMakesView(generics.ListAPIView):
    queryset = PredefinedCar.objects.values('make').distinct()
    serializer_class = PredefinedCarSerializer

    def get(self, request, *args, **kwargs):
        makes = PredefinedCar.objects.values_list('make', flat=True).distinct()
        return Response(makes)

@extend_schema(tags=['Car']) 
@api_view(['GET'])
def get_models_by_make(request, make):
    models = PredefinedCar.objects.filter(make=make).values_list('model', flat=True).distinct()
    return Response(models)

@extend_schema(tags=['Car']) 
@api_view(['GET'])
def get_years_by_model_and_make(request, make, model):
    years = PredefinedCar.objects.filter(make=make, model=model).values('id', 'year').distinct()
    return Response(years)

@extend_schema(tags=['Car']) 
class ChangeDefaultCarView(APIView):
    def patch(self, request, customer_id, car_id):
        try:
            # Get the customer
            customer = Customer.objects.get(pk=customer_id)

            # Ensure the car belongs to the customer
            car_to_set_default = Car.objects.get(pk=car_id, customer=customer)

            # Set all cars for this customer to not be default
            Car.objects.filter(customer=customer).update(is_default=False)

            # Set the selected car as the default
            car_to_set_default.is_default = True
            car_to_set_default.save()

            return Response({"message": "Default car updated successfully."}, status=status.HTTP_200_OK)

        except Customer.DoesNotExist:
            return Response({"error": "Customer not found."}, status=status.HTTP_404_NOT_FOUND)

        except Car.DoesNotExist:
            return Response({"error": "Car not found or does not belong to the customer."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, car_id):
        # This method is just to show the form in the browsable API
        return Response({"message": "Use POST to change the default car."})
    
@extend_schema(tags=['Car']) 
class RegisterCarView(generics.CreateAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
@extend_schema(tags=['Car']) 
@api_view(['GET'])
def get_cars_by_user(request, user_id):
    cars = Car.objects.filter(customer_id=user_id)
    serializer = CarSerializer(cars, many=True)
    return Response(serializer.data)

@extend_schema(tags=['Car']) 
class AddPredefinedCarView(generics.CreateAPIView):
    queryset = PredefinedCar.objects.all()
    serializer_class = PredefinedCarSerializer

@extend_schema(tags=['Car']) 
class EditPredefinedCarView(generics.UpdateAPIView):
    queryset = PredefinedCar.objects.all()
    serializer_class = PredefinedCarSerializer
    lookup_field = 'pk'
    
@extend_schema(tags=['Car']) 
class ListPredefinedCarsView(generics.ListAPIView):
    queryset = PredefinedCar.objects.all()
    serializer_class = PredefinedCarSerializer

@extend_schema(tags=['Car']) 
class ListCarsView(generics.ListAPIView):
    queryset = Car.objects.all()
    serializer_class = CarSerializer

