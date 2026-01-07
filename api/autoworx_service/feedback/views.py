from django.shortcuts import render
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from core.models import Feedback
from .serializers import FeedbackSerializer, CreateFeedbackSerializer
from drf_spectacular.utils import extend_schema

@extend_schema(tags=['Feedback'])
class CreateFeedbackView(generics.CreateAPIView):
    serializer_class = CreateFeedbackSerializer

    def perform_create(self, serializer):
        serializer.save() 

@extend_schema(tags=['Feedback'])
class ListFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        return Feedback.objects.all() 

@extend_schema(tags=['Feedback'])
class ServiceFeedbackView(generics.ListAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        service_id = self.kwargs['service_id']
        return Feedback.objects.filter(service_id=service_id)

@extend_schema(tags=['Feedback'])
class UpdateFeedbackView(generics.UpdateAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)  

@extend_schema(tags=['Feedback'])
class DeleteFeedbackView(generics.DestroyAPIView):
    serializer_class = FeedbackSerializer
    queryset = Feedback.objects.all()

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)  
