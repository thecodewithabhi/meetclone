from uuid import uuid4

from fastapi import APIRouter

router = APIRouter(
    prefix='/rooms',
    tags=['Rooms']
)


@router.post('/create')
async def create_room():
    room_id = str(uuid4())

    return {
        'room_id': room_id
    }