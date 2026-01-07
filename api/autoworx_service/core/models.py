from datetime import datetime
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.hashers import make_password, check_password
from django.urls import reverse
from django.utils.module_loading import import_string
from django.urls import reverse
from django.http import HttpRequest
from django.test import RequestFactory

class UserManager(models.Manager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def normalize_email(self, email):
        email = email.strip().lower()
        return email

class User(models.Model):
    ROLE_CHOICES = [
        ('Customer', 'Customer'),
        ('Mechanic', 'Mechanic'),
        ('Manager', 'Manager'),
    ]
    
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    phone = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    role = models.CharField(max_length=50, choices=ROLE_CHOICES)
    created_at = models.DateTimeField(default=datetime.now)
    is_active = models.BooleanField(default=True)
    
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
    
    objects = UserManager()
    
    def __str__(self):
        return self.email

    class Meta:
        db_table = 'User'
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
        ]

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    
    objects = UserManager()
    
    def __str__(self):
        return self.user.name

    class Meta:
        db_table = 'Customer'
        indexes = [
            models.Index(fields=['user']),
        ]

class Mechanic(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    current_workload = models.IntegerField(default=0)
    is_available = models.BooleanField(default=True)
    
    objects = UserManager()

    def __str__(self):
        return self.user.name

    class Meta:
        db_table = 'Mechanic'
        indexes = [
            models.Index(fields=['user']),
        ]

class Manager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)

    def __str__(self):
        return self.user.name

    class Meta:
        db_table = 'Manager'
        indexes = [
            models.Index(fields=['user']),
        ]

class PredefinedCar(models.Model):
    make = models.CharField(max_length=50)
    model = models.CharField(max_length=50)
    year = models.IntegerField() 
    image = models.ImageField(upload_to='car_images/', null=True, blank=True)  # Add this line


    def __str__(self):
        return f"{self.make} {self.model} ({self.year})"

    class Meta:
        db_table = 'PredefinedCar'
        unique_together = ('make', 'model', 'year')
        indexes = [
            models.Index(fields=['make', 'model', 'year']),
        ]

class Car(models.Model):
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    predefined_car = models.ForeignKey(PredefinedCar, on_delete=models.CASCADE)
    is_available = models.BooleanField(default=True)
    reg_no = models.CharField(max_length=15, unique=True)
    is_default = models.BooleanField(default=False)

    def __str__(self):
        return str(self.predefined_car)

    class Meta:
        db_table = 'Car'
        indexes = [
            models.Index(fields=['customer']),
            models.Index(fields=['predefined_car']),
        ]


class CarHealth(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    odometer = models.IntegerField() 
    battery = models.IntegerField() 
    tires = models.IntegerField() 
    oilLevel = models.IntegerField() 
    brakePads = models.IntegerField() 
    airFilter = models.IntegerField()
    last_updated = models.DateTimeField(default=datetime.now) 

    def __str__(self):
        return str(self.car)

    class Meta:
        db_table = 'CarHealth'
        indexes = [
            models.Index(fields=['car']),
        ]


class ServiceType(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField()
    labour_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)

    def __str__(self):
        return self.name
    
    class Meta:
        db_table = 'ServiceType'
        indexes = [
            models.Index(fields=['name']),
        ]

class PredefinedTask(models.Model):
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE, related_name='predefined_tasks')
    description = models.TextField()

    def __str__(self):
        return f"Predefined Task for {self.service_type.name}"
    
    class Meta:
        db_table = 'PredefinedTask'
        indexes = [
            models.Index(fields=['service_type']),
        ]

class Service(models.Model):
    STATUS_REQUESTED = 'Requested'
    STATUS_IN_PROGRESS = 'In Progress'
    STATUS_COMPLETED = 'Completed'
    STATUS_CANCELED = 'Canceled'
    
    STATUS_CHOICES = [
        (STATUS_REQUESTED, 'Requested'),
        (STATUS_IN_PROGRESS, 'In Progress'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_CANCELED, 'Canceled')
    ]

    car = models.ForeignKey(Car, on_delete=models.CASCADE)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_REQUESTED)
    date = models.DateField()

    def __str__(self):
        return f"Service for {self.car} - {self.service_type}"
    
    class Meta:
        db_table = 'Service'
        indexes = [
            models.Index(fields=['car']),
            models.Index(fields=['service_type']),
            models.Index(fields=['status']),
        ]
    

class Task(models.Model):
    STATUS_PENDING = 'Pending'
    STATUS_COMPLETED = 'Completed'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_COMPLETED, 'Completed')
    ]

    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    description = models.TextField()
    assigned_to = models.ForeignKey(Mechanic, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"Task for {self.service} - {self.assigned_to}"
    
    class Meta:
        db_table = 'Task'
        indexes = [
            models.Index(fields=['service']),
            models.Index(fields=['assigned_to']),
            models.Index(fields=['status']),
        ]

#-----Updates------
class TaskReport(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name='task_reports')
    Comments = models.TextField()
    Images = models.ImageField(upload_to='report_images/', null=True, blank=True)
    status = models.BooleanField(default=False)
    date_completed = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"Task Report for {self.task.name} - Status: {'Completed' if self.status else 'Pending'}"

#-----Updates------
class ServiceReport(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='service_reports')
    task_reports = models.ManyToManyField(TaskReport, related_name='service_reports')
    last_updated = models.DateTimeField(default=datetime.now)

    def __str__(self):
        return f"Service Report for {self.service}"
    
    class Meta:
        db_table = 'service_report'
        indexes = [
            models.Index(fields=['service']),
        ]


class PredefinedPart(models.Model):
    name = models.CharField(max_length=100)
    description = models.CharField(max_length=300)
    service_type = models.ForeignKey(ServiceType, on_delete=models.CASCADE, related_name='predefined_parts')
    
    class Meta:
        db_table = 'PredefinedPart'
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return f"{self.name} for {self.service_type.name}"

class Part(models.Model):
    predefined_car = models.ForeignKey(PredefinedCar, on_delete=models.CASCADE)
    predefined_part = models.ForeignKey(PredefinedPart, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.predefined_part} for {self.predefined_car}"
    
    class Meta:
        unique_together = ('predefined_car', 'predefined_part')
        db_table = 'Part'
        indexes = [
            models.Index(fields=['predefined_car']),
            models.Index(fields=['predefined_part']),
        ]

class Quote(models.Model):
    QUOTE_CHOICES = [
        ('Pending', 'Pending'),
        ('Accepted', 'Accepted'),
        ('Declined', 'Declined'),
    ]
    
    service = models.OneToOneField(Service, on_delete=models.CASCADE)
    parts = models.ManyToManyField(Part, through='QuotePart', related_name='quotes')
    labor_fees = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50, choices=QUOTE_CHOICES, default='Pending')
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"Quote for {self.service}"
    
    class Meta:
        db_table = 'Quote'
        indexes = [
            models.Index(fields=['service']),
        ]

class QuotePart(models.Model):
    quote = models.ForeignKey(Quote, on_delete=models.CASCADE)
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        unique_together = ('quote', 'part')
        db_table = 'QuotePart'
        indexes = [
            models.Index(fields=['quote']),
            models.Index(fields=['part']),
        ]

    def __str__(self):
        return f"{self.part.predefined_part} in {self.quote}"

from django.db import models

class Invoice(models.Model):
    QUOTE_CHOICES = [
        ('Pending', 'Pending'),
        ('Sent', 'Sent')
    ]
    
    service = models.OneToOneField(Service, on_delete=models.CASCADE, related_name='invoice')
    labor_fees = models.DecimalField(max_digits=10, decimal_places=2)
    tax = models.DecimalField(max_digits=10, decimal_places=2)
    discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=QUOTE_CHOICES, default='Pending')
    date = models.DateTimeField(default=datetime.now)
    
    def __str__(self):
        return f"Invoice for {self.service}"

    def save(self, *args, **kwargs):
        self.total_amount = self.labor_fees + self.tax - self.discount
        super().save(*args, **kwargs)


class PartInvoice(models.Model):
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='part_invoices')
    part = models.ForeignKey(Part, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    
    def __str__(self):
        return f"{self.part.predefined_part} in {self.invoice}"


    def __str__(self):
        return f"{self.part.predefined_part} in {self.invoice}"
    
class Appointment(models.Model):
    STATUS_CHOICES = [
        ('Scheduled', 'Scheduled'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
    ]
    
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='appointments')
    date = models.DateField()
    time = models.TimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Scheduled')
    
    def __str__(self):
        return f"Appointment for {self.service} on {self.date} at {self.time}"

    class Meta:
        db_table = 'Appointment'
        indexes = [
            models.Index(fields=['service']),
            models.Index(fields=['date']),
            models.Index(fields=['time']),
        ]

class Skill(models.Model):
    vehicle = models.ForeignKey(PredefinedCar, on_delete=models.CASCADE, related_name='skills')
    vehicle_part = models.CharField(max_length=100)
    steps = models.JSONField()  

    def __str__(self):
        return f"Skill for {self.vehicle} - {self.vehicle_part}"

    class Meta:
        db_table = 'skill'
        indexes = [
            models.Index(fields=['vehicle']),
        ]

class Feedback(models.Model):
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='feedbacks')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='feedbacks')
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    comment = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Feedback for {self.service} by {self.customer}"

    class Meta:
        db_table = 'Feedback'
        indexes = [
            models.Index(fields=['service']),
            models.Index(fields=['customer']),
        ]