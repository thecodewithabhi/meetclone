from fastapi import APIRouter
from fastapi import WebSocket
from backend.app.services.websocket_manager import manager

router = APIRouter()


@router.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(room_id, websocket)

    try:
        while True:
            data = await websocket.receive_json()

            await manager.broadcast(room_id, data)

    except Exception:
        manager.disconnect(room_id, websocket)