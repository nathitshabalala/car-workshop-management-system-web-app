from rest_framework import serializers
from core.models import PredefinedCar, Skill

class PredefinedCarSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredefinedCar
        fields = ['id', 'make', 'model', 'year', 'image']

class SkillSerializer(serializers.ModelSerializer):
    vehicle = PredefinedCarSerializer(read_only=True)
    vehicle_id = serializers.PrimaryKeyRelatedField(
        queryset=PredefinedCar.objects.all(),
        source='vehicle',
        write_only=True,
        required=False
    )

    class Meta:
        model = Skill
        fields = ['id', 'vehicle', 'vehicle_id', 'vehicle_part', 'steps']

    def create(self, validated_data):
        vehicle = validated_data.pop('vehicle', None)
        skill = Skill.objects.create(vehicle=vehicle, **validated_data)
        return skill
