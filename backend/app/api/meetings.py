from uuid import uuid4
from datetime import datetime

from fastapi import APIRouter

from backend.app.schemas.meeting import MeetingCreate, MeetingResponse

router = APIRouter(
    prefix='/meetings',
    tags=['Meetings']
)

# In-memory store for simplicity (replace with DB in production)
meetings_store: dict = {}


@router.post('/create', response_model=MeetingResponse)
async def create_meeting(payload: MeetingCreate):
    room_id = str(uuid4())[:8].upper()
    meeting = {
        'room_id': room_id,
        'title': payload.title or f"{payload.host_name}'s Meeting",
        'host_name': payload.host_name,
        'created_at': datetime.utcnow().isoformat(),
    }
    meetings_store[room_id] = meeting
    return meeting


@router.get('/{room_id}', response_model=MeetingResponse)
async def get_meeting(room_id: str):
    meeting = meetings_store.get(room_id.upper())
    if not meeting:
        # Return a generic meeting info if not found (allow any room)
        return {
            'room_id': room_id,
            'title': 'Meeting Room',
            'host_name': 'Host',
            'created_at': datetime.utcnow().isoformat(),
        }
    return meeting