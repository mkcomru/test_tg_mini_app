from aiogram import Router, F
from aiogram.types import Message
from aiogram.filters import Command
from tortoise.exceptions import DoesNotExist

from backend.app.models.user import User
from backend.app.bot.keyboards import get_webapp_keyboard

router = Router()

@router.message(Command("start"))
async def cmd_start(message: Message):
    user_id = message.from_user.id
    
    user, created = await User.get_or_create(
        telegram_id=user_id,
        defaults={
            "first_name": message.from_user.first_name or "",
            "last_name": message.from_user.last_name or "",
            "username": message.from_user.username or "",
            "birthday": None
        }
    )
    
    welcome_text = (
        f"Привет, {message.from_user.first_name}! 👋\n\n"
        "С помощью этого бота ты можешь поделиться с друзьями своей датой рождения, чтобы они могли поздравить тебя\n\n"
        "Нажми на кнопку ниже, чтобы открыть приложение:"
    )
    
    await message.answer(
        welcome_text,
        reply_markup=get_webapp_keyboard()
    )

@router.message()
async def echo_handler(message: Message):
    await message.answer(
        "Чтобы начать, отправь /start",
        reply_markup=get_webapp_keyboard()
    )
