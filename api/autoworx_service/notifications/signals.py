from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import TaskReport, Task
from .models import Notification

# @receiver(post_save, sender=TaskReport)
# def send_task_completion_notification(sender, instance, **kwargs):
#     if instance.status == TaskReport.STATUS_COMPLETED:
#         task = instance.task
#         customer = task.service.car.customer
#         message = f"Task '{task.description}' for your car has been completed."
#         Notification.objects.create(customer=customer, message=message)
