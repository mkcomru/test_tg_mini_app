from tortoise import Tortoise
from backend.app.config.config import settings


async def init_db():
    await Tortoise.init(
        db_url=settings.BIRTHDAY_DB_URL,
        modules={"models": ["backend.app.models"]}
    )
    await Tortoise.generate_schemas()

async def close_db():
    await Tortoise.close_connections()


