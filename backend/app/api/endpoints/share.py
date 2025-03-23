from fastapi import APIRouter, Depends, HTTPException, status
from datetime import datetime, timedelta
import uuid

from backend.app.models.user import User
from backend.app.models.share import ShareLink
from backend.app.schemas.share import ShareLinkCreate, ShareLinkResponse, SharedUserResponse
from backend.app.schemas.user import UserResponse
from backend.app.utils.birthday import calculate_time_to_birthday
from backend.app.api.deps import get_current_user
from backend.app.config.config import settings

router = APIRouter()

@router.post("", response_model=ShareLinkResponse)
async def create_share_link(
    share_data: ShareLinkCreate,
    user: User = Depends(get_current_user)
) -> ShareLinkResponse:
    share_code = str(uuid.uuid4())[:8]
    
    expires_at = None
    if share_data.expires_in_hours:
        expires_at = datetime.now() + timedelta(hours=share_data.expires_in_hours)
    
    share_link = await ShareLink.create(
        share_code=share_code,
        user=user,
        expires_at=expires_at
    )
    
    share_url = f"{settings.WEBAPP_URL}?share={share_code}"
    
    return ShareLinkResponse(
        share_code=share_code,
        created_at=share_link.created_at,
        expires_at=share_link.expires_at,
        share_url=share_url
    )
