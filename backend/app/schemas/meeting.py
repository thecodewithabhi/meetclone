from pydantic import BaseModel
from typing import Optional


class MeetingCreate(BaseModel):
    title: Optional[str] = None
    host_name: str


class MeetingJoin(BaseModel):
    display_name: str


class MeetingResponse(BaseModel):
    room_id: str
    title: Optional[str]
    host_name: str
    created_at: Optional[str] = None
