from pydantic import BaseModel
from typing import Optional


class BurnoutScore(BaseModel):
    score: float
    zone: str
    narrative: Optional[str] = ""
