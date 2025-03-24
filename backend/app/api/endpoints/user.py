import logging
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Request
from backend.app.api import deps
from backend.app.models.user import User
from backend.app.schemas.user import UserResponse, UserBirthdayUpdate, BirthdayRemaining
from backend.app.utils.birthday import calculate_time_to_birthday

router = APIRouter()
logger = logging.getLogger(__name__)

def create_user_response(user: User) -> UserResponse:
    birthday_remaining = None
    if user.birthday:
        birthday_remaining = calculate_time_to_birthday(user.birthday)
    
    return UserResponse(
        telegram_id=user.telegram_id,
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        birthday=user.birthday.strftime("%Y-%m-%d") if user.birthday else None,
        birthday_remaining=birthday_remaining
    )

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: User = Depends(deps.get_current_user)
):
    return create_user_response(current_user)

@router.put("/me/birthday", response_model=UserResponse)
async def update_birthday(
    request: Request,
    birthday_data: UserBirthdayUpdate,
    current_user: User = Depends(deps.get_current_user)
):
    try:
        # Логируем тело запроса
        body = await request.body()
        logger.info(f"Raw request body: {body}")
        logger.info(f"Parsed birthday data: {birthday_data}")
        logger.info(f"Birthday string: {birthday_data.birthday}")
        logger.info(f"Current user: {current_user.telegram_id}")
        
        # Преобразуем строку в объект date
        birthday_date = datetime.strptime(birthday_data.birthday, "%Y-%m-%d").date()
        logger.info(f"Parsed birthday date: {birthday_date}")
        
        current_user.birthday = birthday_date
        await current_user.save()
        
        return create_user_response(current_user)
    except ValueError as e:
        logger.error(f"Invalid date format: {str(e)}")
        raise HTTPException(status_code=400, detail="Неверный формат даты. Используйте формат YYYY-MM-DD")
    except Exception as e:
        logger.error(f"Error updating birthday: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))