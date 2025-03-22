from datetime import date, datetime
from pydantic import BaseModel, Field
from typing import Optional


class UserBase(BaseModel):
    telegram_id: int
    first_name: str
    last_name: str
    username: str


class UserBirthdayUpdate(BaseModel):
    birthday: date = Field(..., description="Дата рождения пользователя")


class BirthdayRemaining(BaseModel):
    days: int = Field(..., description="Количество дней до дня рождения")
    hours: int = Field(..., description="Количество часов до дня рождения")
    minutes: int = Field(..., description="Количество минут до дня рождения")


class UserResponse(UserBase):
    birthday: Optional[date] = Field(None, description="Дата рождения пользователя")
    birthday_remaining: Optional[BirthdayRemaining] = Field(
        None, 
        description="Информация о том, сколько осталось до дня рождения"
    )

    class Config:
        from_attributes = True