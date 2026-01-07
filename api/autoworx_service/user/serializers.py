from django.db import transaction
from drf_spectacular.utils import extend_schema_field, OpenApiTypes
from rest_framework import serializers
from core.models import User, Customer, Mechanic, Manager

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            'id', 'name', 'surname', 'phone', 'email', 'street_address', 
            'city', 'postal_code', 'role', 'is_active', 'created_at'
        ]
        read_only_fields = ['role', 'is_active', 'created_at']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        """Create and return a User with encrypted password"""
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            phone=validated_data['phone'],
            role=validated_data['role']
        )
        user.set_password(user.password)
        user.save()
        return user

    def update(self, instance, validated_data):
        """Update and return user."""
        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
    
        if password:
            user.set_password(password)

        user.save()
        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError("Must include 'email' and 'password'.")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        if not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")

        data['user'] = user
        return data

class CustomerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Customer
        fields = ['user', 'password']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', None)
        role = 'Customer'
        user_data['role'] = role
        user = User.objects.create_user(**user_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        customer = Customer.objects.create(user=user, **validated_data)
        return customer

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', None)
        
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        
        if password:
            instance.user.set_password(password)
        
        instance.user.save()
        
        instance.save()
        return instance

class MechanicSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Mechanic
        fields = ['user', 'password', 'is_available', 'current_workload']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', None)

        role = 'Mechanic'
        user_data['role'] = role
        user = User.objects.create_user(**user_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        mechanic = Mechanic.objects.create(user=user, **validated_data)
        return mechanic

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', None)
        is_available = validated_data.pop('is_available', None)
        current_workload = validated_data.pop('current_workload', None)
        
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        
        if password:
            instance.user.set_password(password)
        
        if is_available is not None:
            instance.is_available = is_available
            
        if current_workload is not None:
            instance.current_workload = current_workload
        
        instance.user.save()
        
        instance.save()
        return instance
    
class ManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    password = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = Manager
        fields = ['user', 'password']

    def create(self, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', None)
        role = 'Manager'
        user_data['role'] = role
        user = User.objects.create_user(**user_data)
        
        if password:
            user.set_password(password)
            user.save()
        
        manager = Manager.objects.create(user=user, **validated_data)
        return manager

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')
        password = validated_data.pop('password', None)
        
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        
        if password:
            instance.user.set_password(password)
        
        instance.user.save()
        
        instance.save()
        return instance
