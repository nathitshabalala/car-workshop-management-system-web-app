from django.core.management.base import BaseCommand
from django.contrib.auth.hashers import make_password
from core.models import (
    User, Customer, Mechanic, Manager, PredefinedCar, Car, CarHealth,
    ServiceType, Service, Task, Quote, QuotePart, Invoice, PartInvoice,
    Appointment, Part
)
from django.utils import timezone
from datetime import timedelta
import random
from decimal import Decimal
from django.utils import timezone

class Command(BaseCommand):
    help = 'Generate test data for the car service management system'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.first_names = [
            # Common English names
            "James", "John", "Robert", "Michael", "William", "David", "Richard", 
            "Joseph", "Charles", "Thomas", "Christopher", "Daniel", "Matthew", 
            "Anthony", "Mark", "Donald", "Steven", "Paul", "Andrew", "Joshua", 
            "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", 
            "Susan", "Jessica", "Sarah", "Karen", "Nancy", "Margaret", 
            "Lisa", "Betty", "Sandra", "Ashley", "Dorothy", "Kimberly",

            # South African names (various cultures)
            "Sibongile", "Lerato", "Thabo", "Ayanda", "Mandisa", "Sipho", 
            "Nandi", "Themba", "Nomsa", "Zanele", "Thuli", "Mandla", 
            "Karabo", "Bongani", "Nokuthula", "Sizwe", "Nkanyezi", "Thandeka", 
            "Kabelo", "Tebogo", "Mbali", "Lebogang", "Khanyi", "Andile", 
            "Nonhlanhla", "Tshepo", "Lindiwe", "Vusi", "Nosipho", "Jabulani", 
            "Xolani", "Busi", "Phumzile", "Katlego", "Ntombi", "Lunga", 
            "Naledi", "Reabetswe", "Simphiwe", "Tumelo", "Gugu", "Siyabonga", 
            "Mpho", "Mfundo", "Nomvula", "Kgothatso", "Rorisang", "Zola"
        ]

        self.last_names = [
            "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", 
            "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", 
            "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", 
            "Martin", "Lee", "Perez", "Thompson", "White", "Harris", "Sanchez", 
            "Clark", "Ramirez", "Lewis", "Robinson",
            # South African last names
            "Mthembu", "Nkosi", "Ngcobo", "Zulu", "Mkhize", "Khumalo", 
            "Dlamini", "Molefe", "Mokoena", "Mahlangu", "Ndlovu", "Tshabalala", 
            "Baloyi", "Van der Merwe", "De Klerk", "Pieterse", "Du Plessis", 
            "Naidoo", "Govender", "Pillay", "Nkuna", "Radebe", "Sithole", 
            "Modise", "Mabena", "Sibanda", "Mofokeng", "Motsepe", "Kekana"
        ]

        self.street_names = [
            "Voortrekker", "Rivonia", "Jan Smuts", "William Nicol", "Louis Botha", 
            "Nelson Mandela", "Pretorius", "Steve Biko", "Beyers Naude", "Oxford", 
            "Church", "Paul Kruger", "Madiba", "Commissioner", "Van der Walt", 
            "Sophie de Bruyn", "Kliptown", "Mopedi", "Heidelberg", "Chris Hani", 
            "Govan Mbeki", "Boshoff", "Tshepo", "De Villiers", "De Beer"
        ]
        self.street_types = ["St", "Ave", "Blvd", "Rd", "Ln", "Dr", "Way", "Pl", "Ct"]
        self.cities = [
            "Johannesburg", "Pretoria", "Soweto", "Benoni", "Vereeniging", 
            "Boksburg", "Tembisa", "Kempton Park", "Randburg", "Roodepoort", 
            "Krugersdorp", "Centurion", "Springs", "Midrand", "Carletonville", 
            "Alberton", "Germiston", "Bronkhorstspruit", "Edenvale", "Sandton", 
            "Heidelberg", "Lenasia", "Meyerton", "Nigel", "Cullinan"
        ]
        
        self.service_types_with_tasks = {
            "Maintenance Service": [
                "Check and top up all fluid levels",
                "Inspect belts and hoses",
                "Check tire pressure and condition",
                "Inspect brake system",
                "Test battery and charging system",
                "Check lights and wipers",
                "Inspect air filter",
                "Check and lubricate door hinges",
                "Inspect suspension components",
                "Perform visual safety inspection"
            ],
            "Oil Change": [
                "Drain old engine oil",
                "Replace oil filter",
                "Add new engine oil",
                "Check and top up other fluid levels",
                "Inspect for oil leaks",
                "Reset oil life monitor (if applicable)",
                "Dispose of old oil properly",
                "Apply oil change sticker"
            ],
            "Health Check": [
                "Perform diagnostic scan",
                "Check engine performance",
                "Inspect tire tread depth and pressure",
                "Test battery condition",
                "Check brakes and suspension",
                "Inspect belts and hoses",
                "Check all lights and wipers",
                "Assess fluid levels and condition",
                "Provide detailed report of findings"
            ],
            "Battery Replacement": [
                "Test old battery condition",
                "Remove old battery",
                "Clean battery tray and cables",
                "Install new battery",
                "Apply anti-corrosion treatment to terminals",
                "Test charging system",
                "Reset vehicle electronics (if necessary)",
                "Properly dispose of old battery"
            ],
            "Air Conditioning Service": [
                "Check refrigerant level and pressure",
                "Inspect AC compressor and belt",
                "Clean or replace cabin air filter",
                "Check for leaks in AC system",
                "Test cooling performance",
                "Clean condenser fins",
                "Check and clean evaporator drain",
                "Recharge AC system if needed"
            ],
            "Brake Service": [
                "Inspect brake pads and rotors",
                "Measure brake pad thickness",
                "Check brake fluid level and condition",
                "Inspect brake lines and hoses",
                "Test brake pedal feel",
                "Adjust parking brake (if necessary)",
                "Lubricate caliper slider pins",
                "Road test to check brake performance"
            ],
            "Wheel Service": [
                "Remove wheels",
                "Inspect wheel bearings",
                "Clean and re-grease wheel hubs",
                "Check for uneven tire wear",
                "Balance all wheels",
                "Inspect suspension components",
                "Torque wheel nuts to specification",
                "Perform wheel alignment check"
            ],
            "Tire Rotation": [
                "Remove all wheels",
                "Inspect tire tread depth and condition",
                "Rotate tires according to recommended pattern",
                "Check and adjust tire pressure",
                "Inspect brake system",
                "Torque wheel nuts to specification",
                "Reset tire pressure monitoring system (if applicable)",
                "Road test for any vibrations"
            ]
        }

    def handle(self, *args, **options):
        if Customer.objects.exists():
            self.stdout.write(self.style.SUCCESS('Data already imported. Skipping import.'))
            return
        self.stdout.write('Generating test data...')

        self.create_users()
        self.create_cars()
        self.create_services()

        self.stdout.write(self.style.SUCCESS('Test data generation completed successfully!'))

    def create_users(self):
        self.create_customers()
        self.create_mechanics()
        self.create_managers()

    def create_customers(self):
        for i in range(50):
            first_name = random.choice(self.first_names)
            last_name = random.choice(self.last_names)
            email = f"{first_name.lower()}.{last_name.lower()}@gmail.com"
            
            # Check if email exists, and if so, append a random number to make it unique
            while User.objects.filter(email=email).exists():
                email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 1000)}@gmail.com"
            
            user = User.objects.create(
                name=first_name,
                surname=last_name,
                phone=f"+27{random.randint(20000000, 99999999)}",
                email=email,
                password=make_password("password"),
                role='Customer',
                street_address=self.generate_street_address(),
                city=random.choice(self.cities),
                postal_code=f"{random.randint(1000, 9999)}",
                created_at= timezone.now() - timedelta(days=random.randint(1, 30))
            )
            Customer.objects.create(user=user)

    def create_mechanics(self):
        for i in range(10):
            first_name = random.choice(self.first_names)
            last_name = random.choice(self.last_names)
            email = f"{first_name.lower()}.{last_name.lower()}@autoworx.com"
            
            # Check if email exists, and if so, append a random number to make it unique
            while User.objects.filter(email=email).exists():
                email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 1000)}@autoworx.com"
            
            user = User.objects.create(
                name=first_name,
                surname=last_name,
                phone=f"+27{random.randint(20000000, 99999999)}",
                email=email,
                password=make_password("password"),
                role='Mechanic',
                street_address=self.generate_street_address(),
                city=random.choice(self.cities),
                postal_code=f"{random.randint(10000, 99999)}",
                created_at= timezone.now() - timedelta(days=random.randint(1, 30))
            )
            Mechanic.objects.create(user=user, current_workload=random.randint(10, 15))


    def create_managers(self):
        for i in range(2):
            first_name = random.choice(self.first_names)
            last_name = random.choice(self.last_names)
            email = f"{first_name.lower()}.{last_name.lower()}@autoworx.com"
            
            # Check if email exists, and if so, append a random number to make it unique
            while User.objects.filter(email=email).exists():
                email = f"{first_name.lower()}.{last_name.lower()}{random.randint(1, 1000)}@autoworx.com"
            
            user = User.objects.create(
                name=first_name,
                surname=last_name,
                phone=f"+27{random.randint(20000000, 99999999)}",
                email=email,
                password=make_password("password"),
                role='Manager',
                street_address=self.generate_street_address(),
                city=random.choice(self.cities),
                postal_code=f"{random.randint(10000, 99999)}",
                created_at= timezone.now() - timedelta(days=random.randint(1, 30))
            )
            Manager.objects.create(user=user)

    def generate_street_address(self):
        return f"{random.randint(1, 9999)} {random.choice(self.street_names)} {random.choice(self.street_types)}"

    def create_cars(self):
        customers = Customer.objects.all()
        predefined_cars = PredefinedCar.objects.all()

        for customer in customers:
            num_cars = random.randint(1, 3)
            for i in range(num_cars):
                predefined_car = random.choice(predefined_cars)
                car = Car.objects.create(
                    customer=customer,
                    predefined_car=predefined_car,
                    is_available=True,
                    reg_no=self.generate_registration_number(),
                    is_default=(i == 0)  # First car is default
                )
                self.create_car_health(car)

    def generate_registration_number(self):
        provinces = ['GP', 'WC', 'EC', 'NC', 'FS', 'KZN', 'NW', 'MP', 'L']
        letters = ''.join(random.choices('ABCDEFGHIJKLMNOPQRSTUVWXYZ', k=3))
        numbers = ''.join(random.choices('0123456789', k=3))
        return f"{letters} {numbers} {random.choice(provinces)}"

    def create_car_health(self, car):
        CarHealth.objects.create(
            car=car,
            odometer=random.randint(1000, 100000),
            battery=random.randint(50, 100),
            tires=random.randint(50, 100),
            oilLevel=random.randint(50, 100),
            brakePads=random.randint(50, 100),
            airFilter=random.randint(50, 100),
            last_updated=timezone.now() - timedelta(days=random.randint(1, 30))
        )

    def create_services(self):
        cars = Car.objects.all()
        service_types = ServiceType.objects.all()
        mechanics = Mechanic.objects.all()

        for car in cars:
            num_services = random.randint(2, 8)
            for _ in range(num_services):
                service_type = random.choice(service_types)
                status = random.choices(['Requested', 'In Progress', 'Completed', 'Cancelled'], 
                                        weights=[0.2, 0.3, 0.4, 0.1])[0]
                service = Service.objects.create(
                    car=car,
                    service_type=service_type,
                    status=status,
                    date=timezone.now().date() - timedelta(days=random.randint(0, 180))
                )
                self.create_tasks(service)
                self.create_quote(service)
                self.create_invoice(service)
                self.create_appointment(service)

    def create_tasks(self, service):
        mechanics = Mechanic.objects.all()
        tasks = self.service_types_with_tasks.get(service.service_type.name, [])
        
        # If the service type is not in our predefined list, create a generic task
        if not tasks:
            tasks = [f"Perform {service.service_type.name}"]

        for task_description in tasks:
            task_status = service.status if service.status in ['Completed', 'Cancelled'] else random.choice(['Pending', 'In Progress', 'Completed'])
            Task.objects.create(
                service=service,
                description=task_description,
                assigned_to=random.choice(mechanics),
                status=task_status,
                service_type=service.service_type,
                created_at=service.date
            )

    def create_quote(self, service):
        quote = Quote.objects.create(
            service=service,
            labor_fees=Decimal(str(round(random.uniform(500, 5000), 2))),
            tax=Decimal(str(round(random.uniform(100, 1000), 2))),
            status='Accepted' if service.status in ['In Progress', 'Completed'] else random.choice(['Pending', 'Accepted', 'Declined']),
            total_price=Decimal('0.00')  # Initialize with Decimal
        )
        self.create_quote_parts(quote)
        quote.total_price = quote.labor_fees + quote.tax + sum(Decimal(str(qp.price)) * qp.quantity for qp in quote.quotepart_set.all())
        quote.save()
    
    def create_quote_parts(self, quote):
        parts = list(Part.objects.filter(predefined_car=quote.service.car.predefined_car))
        num_parts = min(random.randint(1, 5), len(parts))
        selected_parts = random.sample(parts, num_parts)
        
        for part in selected_parts:
            QuotePart.objects.create(
                quote=quote,
                part=part,
                quantity=random.randint(1, 3),
                price=Decimal(str(round(random.uniform(100, 2000), 2)))
            )

    def create_invoice(self, service):
         if service.status == 'Completed':
            quote = service.quote
            invoice = Invoice.objects.create(
                service=service,
                labor_fees=quote.labor_fees,
                tax=quote.tax,
                total_amount=quote.total_price,
                discount=Decimal(random.uniform(0, 500)).quantize(Decimal('0.01')), 
                status=random.choice(['Sent', 'Paid']),
                date=service.date + timedelta(days=random.randint(1, 7))
            )
            self.create_part_invoices(invoice, quote)

    def create_part_invoices(self, invoice, quote):
        for quote_part in quote.quotepart_set.all():
            PartInvoice.objects.create(
                invoice=invoice,
                part=quote_part.part,
                quantity=quote_part.quantity,
                price=quote_part.price
            )

    def create_appointment(self, service):
        appointment_status = 'Completed' if service.status == 'Completed' else random.choice(['Scheduled', 'Completed', 'Canceled'])
        Appointment.objects.create(
            service=service,
            date=service.date,
            time=timezone.now().time().replace(hour=random.randint(8, 16), minute=random.choice([0, 30]), second=0, microsecond=0),
            status=appointment_status
        )