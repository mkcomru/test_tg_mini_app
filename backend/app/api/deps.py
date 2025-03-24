import logging
from fastapi import HTTPException, status, Header

from backend.app.models.user import User

logger = logging.getLogger(__name__)

async def get_current_user(telegram_id: int = Header(...)) -> User:
    logger.info(f"Received telegram_id from header: {telegram_id}")
    user = await User.filter(telegram_id=telegram_id).first()
    if not user:
        logger.error(f"User not found for telegram_id: {telegram_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    logger.info(f"Found user: {user.telegram_id}")
    return user