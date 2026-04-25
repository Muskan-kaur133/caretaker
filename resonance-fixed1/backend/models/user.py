from pydantic import BaseModel
from typing import Optional


class UserProfile(BaseModel):
    name: str
    email: str
    role: Optional[str] = None
