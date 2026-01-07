from rest_framework import serializers
from core.models import Quote, QuotePart, Part, Service, Car
from part.serializers import PredefinedPartSerializer
from service.serializers import ServiceSerializer
from car.serializers import CarSerializer

class PartSerializer(serializers.ModelSerializer):
    predefined_part = PredefinedPartSerializer()
    class Meta:
        model = Part
        fields = ['id', 'predefined_part', 'predefined_car', 'price']

class QuotePartSerializer(serializers.ModelSerializer):
    part = serializers.PrimaryKeyRelatedField(queryset = Part.objects.all(), write_only=True)
    
    class Meta:
        model = QuotePart
        fields = ['id', 'part', 'quantity', 'price']

class QuoteSerializer(serializers.ModelSerializer):
    service_id = serializers.PrimaryKeyRelatedField(
        queryset=Service.objects.all(), source='service', write_only=True
    )
    service = ServiceSerializer(read_only=True)
    
    part_ids = serializers.PrimaryKeyRelatedField(
        many=True, queryset=QuotePart.objects.all(), source='parts', write_only=True
    )
    #parts = QuotePartSerializer(many=True, read_only=True)
    parts = PartSerializer(many=True, read_only=True) #changed from QuotePartSerializer to this 
    
    car_id = serializers.PrimaryKeyRelatedField(
        queryset=Car.objects.all(), source='car', write_only=True
    )
    car = CarSerializer(read_only=True)

    class Meta:
        model = Quote
        fields = ['id', 'service', 'car_id', 'car', 'service_id', 'parts', 'part_ids', 'labor_fees', 'tax', 'status', 'total_price']
        
class UpdateQuoteStatusSerializer(serializers.ModelSerializer):
    service = serializers.PrimaryKeyRelatedField(read_only=True)
    
    class Meta:
        model = Quote
        fields = ['id', 'status' ,'service']
        extra_kwargs = {'id': {'read_only': True}}