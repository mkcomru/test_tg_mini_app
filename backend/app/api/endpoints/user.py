from fastapi import APIRouter, Depends

from backend.app.models.user import User
from backend.app.schemas.user import UserResponse, UserBirthdayUpdate
from backend.app.utils.birthday import calculate_time_to_birthday
from backend.app.api.deps import get_current_user

router = APIRouter()

def create_user_response(user: User) -> UserResponse:
    response = UserResponse(
        telegram_id=user.telegram_id,
        first_name=user.first_name,
        last_name=user.last_name,
        username=user.username,
        birthday=user.birthday
    )
    
    if user.birthday:
        response.birthday_remaining = calculate_time_to_birthday(user.birthday)
    
    return response

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    user: User = Depends(get_current_user)
) -> UserResponse:
    return create_user_response(user)

@router.put("/me/birthday", response_model=UserResponse)
async def update_birthday(
    birthday_data: UserBirthdayUpdate,
    user: User = Depends(get_current_user)
) -> UserResponse:
    user.birthday = birthday_data.birthday
    await user.save()
    
    return create_user_response(user)