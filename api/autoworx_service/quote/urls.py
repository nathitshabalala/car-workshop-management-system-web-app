from django.urls import path
from .views import ListQuotesView, UpdateQuoteStatus, ServiceQuotesView

urlpatterns = [
    path('', ListQuotesView.as_view(), name='list_quotes'),
    path('change_status/<int:pk>/', UpdateQuoteStatus.as_view(), name='change_quote_status'),
    path('service/<int:service_id>/', ServiceQuotesView.as_view(), name='service-quotes'),
]
