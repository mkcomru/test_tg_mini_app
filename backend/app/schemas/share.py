from datetime import datetime
from pydantic import BaseModel, Field
from typing import Optional
from backend.app.schemas.user import UserResponse


class ShareLinkCreate(BaseModel):
    expires_in_hours: Optional[int] = Field(24, description="Срок действия ссылки в часах")


class ShareLinkResponse(BaseModel):
    share_code: str = Field(..., description="Уникальный код ссылки")
    created_at: datetime = Field(..., description="Дата и время создания ссылки")
    expires_at: Optional[datetime] = Field(None, description="Дата и время истечения срока действия")
    share_url: str = Field(..., description="Полный URL для шеринга")

    class Config:
        from_attributes = True


class SharedUserResponse(BaseModel):
    user: UserResponse = Field(..., description="Данные пользователя")
    is_expired: bool = Field(False, description="Истек ли срок действия ссылки")
    
    class Config:
        from_attributes = True