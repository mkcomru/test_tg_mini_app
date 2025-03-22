from aiogram.types import InlineKeyboardMarkup, WebAppInfo
from aiogram.utils.keyboard import InlineKeyboardBuilder
from backend.app.config.config import settings

def get_webapp_keyboard() -> InlineKeyboardMarkup:
    builder = InlineKeyboardBuilder()
    builder.button(
        text="Открыть WebApp",
        web_app=WebAppInfo(url=f"https://google.com")
    )
    return builder.as_markup()