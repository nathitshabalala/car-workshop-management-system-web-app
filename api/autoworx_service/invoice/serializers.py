from rest_framework import serializers
from part.serializers import PartSerializer
from core.models import Invoice, PartInvoice
from service.serializers import ServiceSerializer
from part.serializers import PartSerializer

class PartInvoiceSerializer(serializers.ModelSerializer):
    part = PartSerializer(many=False, read_only=True)
    #part = PartSerializer(read_only=True)
    class Meta:
        model = PartInvoice
        
        fields = ['id', 'part', 'quantity', 'price']

class InvoiceSerializer(serializers.ModelSerializer):
    part_invoices = PartInvoiceSerializer(many=True, read_only=True)
    service = ServiceSerializer(read_only=True)

    class Meta:
        model = Invoice
        fields = ['id', 'service', 'labor_fees', 'tax', 'discount', 'total_amount', 'status', 'part_invoices', 'date']