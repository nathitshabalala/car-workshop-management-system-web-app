from rest_framework.reverse import reverse
from rest_framework.test import APIClient
from django.shortcuts import render
from django.db.models import Max
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from core.models import QuotePart, PredefinedTask, Service, Task, Part, Quote, Mechanic, Invoice, PartInvoice, Customer
from .serializers import *
from django.db.models import F
from quote.serializers import QuoteSerializer
from decimal import Decimal
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema(tags=['Service']) 
def generate_quote(service):
    predefined_car = service.car.predefined_car
    service_type = service.service_type

    # Get parts needed for the service type and car
    parts = Part.objects.filter(predefined_part__service_type=service_type,
                                predefined_car=predefined_car)
    if not parts.exists():
        # Expand search to parts for the same make and model if not enough data
        parts = Part.objects.filter(predefined_part__service_type=service_type, 
                                    predefined_car__make=predefined_car.make, 
                                    predefined_car__model=predefined_car.model)
    
    parts_data = []
    total_parts_price = Decimal('0')
    for part in parts:
        part_price = part.price
        parts_data.append({
            'part': part,
            'price': part_price,
            'quantity': 1
        })
        total_parts_price += Decimal(part_price)
    
    labor_fees = Decimal(service_type.labour_cost)
    tax_rate = Decimal('0.15')
    tax = (total_parts_price + labor_fees) * tax_rate
    
    quote = Quote.objects.create(
        service=service,
        labor_fees=labor_fees,
        tax=tax,
        status='Pending',  
        total_price = total_parts_price + tax + labor_fees  
    )
    
    for part_data in parts_data:
        part = part_data['part']  
        QuotePart.objects.create(
            quote=quote,
            part=part, 
            quantity=part_data['quantity'],
            price=part_data['price']
        )
    
    return quote

@extend_schema(tags=['Service']) 
class CreateServiceView(generics.CreateAPIView):
    queryset = Service.objects.all()
    serializer_class = CreateServiceSerializer
    
    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        service = Service.objects.get(pk=response.data['id'])
        
        # Generate quote for the new service
        quote = generate_quote(service)
        
        return Response({
            'service': ServiceSerializer(service).data,
            'quote': QuoteSerializer(quote).data
        }, status=status.HTTP_201_CREATED)

@extend_schema(tags=['Service']) 
class ListServicesView(generics.ListAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

@extend_schema(tags=['Service']) 
class EditServiceView(generics.UpdateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    lookup_field = 'pk'

@extend_schema(tags=['Service']) 
@api_view(['PATCH'])
def change_service_status(request, pk):
    try:
        service = Service.objects.get(pk=pk)
    except Service.DoesNotExist:
        return Response({'error': 'Service not found'}, status=status.HTTP_404_NOT_FOUND)

    new_status = request.data.get('status')
    if new_status not in dict(Service.STATUS_CHOICES):
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)

    service.status = new_status
    service.save()

    if new_status == Service.STATUS_IN_PROGRESS:
        delegate_task(service)
    elif new_status == Service.STATUS_COMPLETED:
        generate_invoice(service)

    return Response(ServiceSerializer(service).data, status=status.HTTP_200_OK)

@extend_schema(tags=['Service']) 
@api_view(['GET'])
def get_latest_services_for_customer(request, customer_id):
    # Get the customer object
    customer = get_object_or_404(Customer, user_id=customer_id)
    
    # Get the date of the latest service(s)
    latest_date = Service.objects.filter(car__customer=customer).aggregate(Max('date'))['date__max']
    
    if latest_date:
        # Get all services on the latest date
        latest_services = Service.objects.filter(car__customer=customer, date=latest_date).order_by('-id')
        
        services_data = []
        for service in latest_services:
            service_data = {
                'id': service.id,
                'car': service.car.id,
                'service_type': service.service_type.name,
                'status': service.status,
                'date': service.date
            }
            services_data.append(service_data)
        
        return JsonResponse({'latest_services': services_data})
    else:
        return JsonResponse({'error': 'No services found for this customer'}, status=404)

def generate_invoice(service):
    labor_fees = Decimal(service.service_type.labour_cost)
    parts = Part.objects.filter(predefined_part__service_type=service.service_type,
                                predefined_car=service.car.predefined_car)
    total_parts_price = sum(part.price for part in parts)
    tax_rate = Decimal('0.15')
    subtotal = labor_fees + total_parts_price
    tax = subtotal * tax_rate
    total_amount = subtotal + tax
    
    invoice = Invoice.objects.create(
        service=service,
        labor_fees=labor_fees,
        tax=tax,
        total_amount=total_amount,
    )
    
    for part in parts:
        PartInvoice.objects.create(
            invoice=invoice,
            part=part,
            quantity=1,  
            price=part.price
        )
    
    return invoice
 
def delegate_task(service):
    predefined_tasks = PredefinedTask.objects.filter(service_type=service.service_type)
    # Find an available mechanic with the lowest workload
    available_mechanic = Mechanic.objects.filter(is_available=True).order_by('current_workload').first()
    for predefined_task in predefined_tasks:
        if available_mechanic:
            Task.objects.create(
                service=service,
                description=predefined_task.description,
                assigned_to=available_mechanic,
                status=Task.STATUS_PENDING,
                service_type=service.service_type
            )
            # Increment the mechanic's current workload
            available_mechanic.current_workload = F('current_workload') + 1
            available_mechanic.save()
        else:
            Task.objects.create(
                service=service,
                description=predefined_task.description,
                assigned_to=None,
                status=Task.STATUS_PENDING,
                service_type=service.service_type
            )