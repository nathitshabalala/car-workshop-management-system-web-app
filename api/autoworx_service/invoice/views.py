from rest_framework import generics
from core.models import Invoice, User, Customer
from .serializers import InvoiceSerializer
from drf_spectacular.utils import extend_schema, extend_schema_view
from rest_framework.exceptions import NotFound

from rest_framework.exceptions import NotFound

@extend_schema(tags=['Invoice']) 
class InvoiceListView(generics.ListAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
   
@extend_schema(tags=['Invoice'])     
class InvoiceDetailView(generics.RetrieveUpdateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

@extend_schema(tags=['Invoice']) 
class UserInvoiceListView(generics.ListAPIView):
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        user_id = self.kwargs.get('user_id')
        try:
            # Ensure the user exists
            User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise NotFound('User not found')
        
        # Filter invoices by traversing the relationships
        return Invoice.objects.filter(service__car__customer__user_id=user_id)

@extend_schema(tags=['Invoice']) 
class ServiceInvoiceDetailView(generics.RetrieveAPIView):
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        service_id = self.kwargs['service_id']
        return Invoice.objects.filter(service__id=service_id)
    
class ListPendingInvoicesView(generics.ListAPIView):
    serializer_class = InvoiceSerializer

    def get_queryset(self):
        return Invoice.objects.filter(status="Pending")


