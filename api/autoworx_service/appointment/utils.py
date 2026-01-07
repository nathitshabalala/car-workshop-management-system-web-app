from datetime import datetime, time, date

# Define available slots for each day
AVAILABLE_SLOTS = {
    'Sunday': [time(hour=10, minute=0), time(hour=10, minute=30), time(hour=11, minute=0), time(hour=11, minute=30)],
    'Monday': [time(hour=10 + i, minute=0) for i in range(7)] + [time(hour=10 + i, minute=30) for i in range(7)],
    'Tuesday': [time(hour=10 + i, minute=0) for i in range(7)] + [time(hour=10 + i, minute=30) for i in range(7)],
    'Wednesday': [time(hour=10 + i, minute=0) for i in range(7)] + [time(hour=10 + i, minute=30) for i in range(7)],
    'Thursday': [time(hour=10 + i, minute=0) for i in range(7)] + [time(hour=10 + i, minute=30) for i in range(7)],
    'Friday': [time(hour=10 + i, minute=0) for i in range(7)] + [time(hour=10 + i, minute=30) for i in range(7)],
    'Saturday': [time(hour=10 + i, minute=0) for i in range(5)] + [time(hour=10 + i, minute=30) for i in range(5)],
}

# Function to get available slots for a given date
def get_available_slots(date, appointments):
    now = datetime.now().time()
    today = date.today()
    
    # Filter available slots based on the date
    if date == today:
        all_slots = [slot for slot in AVAILABLE_SLOTS[date.strftime('%A')] if slot >= now]
    else:
        all_slots = AVAILABLE_SLOTS[date.strftime('%A')]
    
    # Get taken slots
    taken_slots = [appointment.time for appointment in appointments]
    
    # Filter available slots
    available_slots = [slot for slot in all_slots if slot not in taken_slots]
    
    return available_slots