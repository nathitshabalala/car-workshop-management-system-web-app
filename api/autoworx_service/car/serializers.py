from rest_framework import serializers
from core.models import PredefinedCar, Car, Customer
from user.serializers import CustomerSerializer

class PredefinedCarSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedCar
        fields = ['id','make', 'model', 'year', 'image']

class CarSerializer(serializers.ModelSerializer):
    predefined_car_id = serializers.PrimaryKeyRelatedField(
        queryset=PredefinedCar.objects.all(), source='predefined_car', write_only=True
    )
    predefined_car = PredefinedCarSerializer(read_only=True)
    customer_details = serializers.SerializerMethodField()
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True
    )
    
    class Meta:
        model = Car
        fields = ['id', 'customer_id', 'customer_details', 'predefined_car', 'predefined_car_id', 'reg_no', 'is_default', 'is_available']

    def get_customer_details(self, obj):
        return CustomerSerializer(obj.customer).data if obj.customer else None
    
    class Meta:
        model = Car
        fields = ['id','customer_id', 'customer_details', 'predefined_car', 'predefined_car_id', 'reg_no', 'is_default', 'is_available']
