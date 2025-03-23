from datetime import datetime, date
from backend.app.schemas.user import BirthdayRemaining

def calculate_time_to_birthday(birthday: date) -> BirthdayRemaining:
    now = datetime.now()
    today = date(now.year, now.month, now.day)
    
    next_birthday = date(today.year, birthday.month, birthday.day)
    if next_birthday < today:
        next_birthday = date(today.year + 1, birthday.month, birthday.day)
    
    delta = datetime.combine(next_birthday, datetime.min.time()) - now
    
    return BirthdayRemaining(
        days=delta.days,
        hours=delta.seconds // 3600,
        minutes=(delta.seconds % 3600) // 60
    )