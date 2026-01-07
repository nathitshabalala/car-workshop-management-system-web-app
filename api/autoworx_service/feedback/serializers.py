from rest_framework import serializers
from core.models import Feedback, Service, Customer

class FeedbackSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())
    service = serializers.PrimaryKeyRelatedField(queryset=Service.objects.all())

    class Meta:
        model = Feedback
        fields = ['id', 'service', 'customer', 'rating', 'comment', 'created_at']
        read_only_fields = ['created_at']

class CreateFeedbackSerializer(serializers.ModelSerializer):
    customer = serializers.PrimaryKeyRelatedField(queryset=Customer.objects.all())  # Add customer field

    class Meta:
        model = Feedback
        fields = ['service', 'customer', 'rating', 'comment']  # Include customer

    def create(self, validated_data):
        return Feedback.objects.create(**validated_data)  # No user context, customer comes from request data
