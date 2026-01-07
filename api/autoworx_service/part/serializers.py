from rest_framework import serializers
from core.models import PredefinedPart, Part, PredefinedCar

class PredefinedPartSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedPart
        fields = ['id', 'name', 'description']


class PartSerializer(serializers.ModelSerializer):
    predefined_car = serializers.PrimaryKeyRelatedField(
        queryset=PredefinedCar.objects.all(), 
        write_only=True
    )
    predefined_part_name = serializers.CharField(source='predefined_part.name', read_only=True)
    predefined_part_description = serializers.CharField(source='predefined_part.description', read_only=True)

    class Meta:
        model = Part
        fields = ['id', 'predefined_car', 'predefined_part', 'predefined_part_name', 'predefined_part_description', 'price']
    