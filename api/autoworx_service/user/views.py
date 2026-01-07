"""
Views for the user API.
"""

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, extend_schema_view
from core.models import Customer, Manager, Mechanic, User
from .serializers import UserSerializer, CustomerSerializer, ManagerSerializer, MechanicSerializer, LoginSerializer

@extend_schema(tags=['User']) 
class LoginView(APIView):
    serializer_class = LoginSerializer

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            return Response({'user_id': user.id, "role": user.role}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_401_UNAUTHORIZED)

@extend_schema(tags=['User']) 
class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self):
        """Return only active users."""
        return self.queryset.filter(is_active=True)

@extend_schema(tags=['Customer']) 
class CustomerCreateView(generics.CreateAPIView):
    serializer_class = CustomerSerializer    

@extend_schema(tags=['Customer']) 
class CustomerListView(generics.ListAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer

    def get_queryset(self):
        """Return only active customers."""
        return self.queryset.filter(user__is_active=True)

@extend_schema(tags=['Customer']) 
class CustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
    def destroy(self, request, *args, **kwargs):
        customer = self.get_object()
        user = customer.user
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=['Mechanic'])     
class MechanicCreateView(generics.CreateAPIView):
    serializer_class = MechanicSerializer

@extend_schema(tags=['Mechanic'])  
class MechanicListView(generics.ListAPIView):
    queryset = Mechanic.objects.all()
    serializer_class = MechanicSerializer

    def get_queryset(self):
        """Return only active mechanics."""
        return self.queryset.filter(user__is_active=True)

@extend_schema(tags=['Mechanic'])  
class MechanicDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Mechanic.objects.all()
    serializer_class = MechanicSerializer

    def destroy(self, request, *args, **kwargs):
        mechanic = self.get_object()
        user = mechanic.user
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

@extend_schema(tags=['Manager'])  
class ManagerCreateView(generics.CreateAPIView):
    serializer_class = ManagerSerializer

@extend_schema(tags=['Manager'])  
class ManagerListView(generics.ListAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer
    
    def get_queryset(self):
        """Return only active users."""
        return Manager.objects.filter(user__is_active=True)

@extend_schema(tags=['Manager'])  
class ManagerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Manager.objects.all()
    serializer_class = ManagerSerializer

    def destroy(self, request, *args, **kwargs):
        manager = self.get_object()
        user = manager.user
        user.is_active = False
        user.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
    