from rest_framework.reverse import reverse
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from core.models import Task, Mechanic
from .serializers import *
from django.urls import reverse
from rest_framework.test import APIRequestFactory
from django.utils.module_loading import import_string
from drf_spectacular.utils import extend_schema, extend_schema_view

@extend_schema(tags=['Task']) 
class ListTasksView(generics.ListAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

@extend_schema(tags=['Task']) 
class ListPendingTasksView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(status=Task.STATUS_PENDING)

@extend_schema(tags=['Task']) 
class ListOutstandingTasksForServiceView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        service_id = self.kwargs['service_id']
        return Task.objects.filter(service_id=service_id, status=Task.STATUS_PENDING)
    
@extend_schema(tags=['Task']) 
class ListTasksForServiceView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        service_id = self.kwargs['service_id']
        return Task.objects.filter(service_id=service_id)

@extend_schema(tags=['Task']) 
class ListTasksForMechanicView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        mechanic_id = self.kwargs['mechanic_id']
        return Task.objects.filter(assigned_to_id=mechanic_id)

@extend_schema(tags=['Task']) 
class ListOutstandingTasksForServiceView(generics.ListAPIView):
    serializer_class = TaskSerializer

    def get_queryset(self):
        service_id = self.kwargs['service_id']
        return Task.objects.filter(service_id=service_id, status=Task.STATUS_PENDING)

@extend_schema(tags=['Task']) 
class EditTaskView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    lookup_field = 'pk'

@extend_schema(tags=['Task'])
@api_view(['PATCH'])
def update_task_status(request, pk):
    try:
        task = Task.objects.get(pk=pk)
    except Task.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    serializer = TaskSerializer(task, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        mechanic = Mechanic.objects.get(user_id=task.assigned_to_id)  # Assuming task.assigned_to_id is the correct field
        mechanic.current_workload -= 1
        mechanic.save()
        
        # Check if all tasks for the service are completed
        service = task.service
        all_tasks_completed = all(t.status == Task.STATUS_COMPLETED for t in service.task_set.all())
        
        if all_tasks_completed:
            # Update the service status to 'Completed' via the change_service_status view
            change_service_status_view = import_string('service.views.change_service_status')
            factory = APIRequestFactory()
            patch_request = factory.patch(reverse('change_service_status', kwargs={'pk': service.pk}), {'status': Service.STATUS_COMPLETED}, format='json')

            # Ensure the request is authenticated if necessary
            patch_request.user = request.user

            response = change_service_status_view(patch_request, service.pk)

            if response.status_code != status.HTTP_200_OK:
                return Response({'error': 'Failed to update service status', 'response': response.data}, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
