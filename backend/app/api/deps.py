from fastapi import HTTPException, status, Header

from backend.app.models.user import User

async def get_current_user(telegram_id: int = Header(...)) -> User:
    user = await User.filter(telegram_id=telegram_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Пользователь не найден"
        )
    return user