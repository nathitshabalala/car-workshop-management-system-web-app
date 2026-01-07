from django.urls import path
from .views import InvoiceListView, InvoiceDetailView, UserInvoiceListView, ServiceInvoiceDetailView, ListPendingInvoicesView

urlpatterns = [
    path('', InvoiceListView.as_view(), name='invoice-list'),
    path('<int:pk>/', InvoiceDetailView.as_view(), name='invoice-detail'),
    path('<int:user_id>/invoices/', UserInvoiceListView.as_view(), name='user-invoice-list'),
    path('service/<int:service_id>/invoice/', ServiceInvoiceDetailView.as_view(), name='service-invoice-detail'),
    path('pending/', ListPendingInvoicesView.as_view(), name='list-pending-invoices'),
]
