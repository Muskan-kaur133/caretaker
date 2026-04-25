from pydantic import BaseModel
from typing import Optional


class DailyCheckIn(BaseModel):
    stress_level: Optional[int] = 5    # 1-10
    sleep_hours: Optional[float] = 6
    exhaustion: Optional[int] = 5      # 1-10
    had_break: Optional[bool] = False
    notes: Optional[str] = ""
