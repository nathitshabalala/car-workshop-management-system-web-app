from django.urls import path
from .views import CreateFeedbackView, ListFeedbackView, ServiceFeedbackView, UpdateFeedbackView, DeleteFeedbackView

urlpatterns = [
    path('', ListFeedbackView.as_view(), name='list_feedback'),
    path('create/', CreateFeedbackView.as_view(), name='create_feedback'),
    path('service/<int:service_id>/', ServiceFeedbackView.as_view(), name='service_feedback'),
    path('update/<int:pk>/', UpdateFeedbackView.as_view(), name='update_feedback'),
    path('delete/<int:pk>/', DeleteFeedbackView.as_view(), name='delete_feedback'),
]