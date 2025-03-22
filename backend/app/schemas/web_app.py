from pydantic import BaseModel
from typing import Optional


class WebAppUser(BaseModel):
    id: int
    first_name: str
    last_name: Optional[str] = None
    username: Optional[str] = None
    language_code: Optional[str] = None
    is_premium: Optional[bool] = None


class WebAppInitData(BaseModel):
    query_id: Optional[str] = None
    user: WebAppUser
    auth_date: int
    hash: str