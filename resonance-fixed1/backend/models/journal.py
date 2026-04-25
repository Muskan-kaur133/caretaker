from pydantic import BaseModel
from typing import Optional


class JournalEntry(BaseModel):
    content: str
    mood: Optional[int] = None
