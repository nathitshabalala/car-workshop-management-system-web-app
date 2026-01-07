from rest_framework import viewsets
from rest_framework import generics
from core.models import Quote, Service
from .serializers import QuoteSerializer, UpdateQuoteStatusSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


@extend_schema(tags=['Quote']) 
class ListQuotesView(generics.ListAPIView):
    queryset = Quote.objects.all()
    serializer_class = QuoteSerializer

@extend_schema(tags=['Quote'])   
class UpdateQuoteStatus(generics.UpdateAPIView):
    queryset = Quote.objects.all()
    serializer_class = UpdateQuoteStatusSerializer
    lookup_field = 'pk'
    
    def update(self, request, *args, **kwargs):
        response = super().update(request, *args, **kwargs)
        quote = Quote.objects.get(pk=response.data['id'])
        service = quote.service
        
        if quote.status == 'Declined':
            Service.objects.filter(pk=service.pk).update(status='Canceled')

        return response
    
class ServiceQuotesView(APIView):
    def get(self, request, service_id):
        try:
            service = Service.objects.get(pk=service_id)
        except Service.DoesNotExist:
            return Response({"error": "Service not found"}, status=status.HTTP_404_NOT_FOUND)

        quotes = Quote.objects.filter(service=service)
        serializer = QuoteSerializer(quotes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    