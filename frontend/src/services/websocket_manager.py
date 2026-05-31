from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.rooms = {}

    async def connect(
        self,
        room_id: str,
        websocket: WebSocket
    ):
        await websocket.accept()

        if room_id not in self.rooms:
            self.rooms[room_id] = []

        self.rooms[room_id].append(websocket)

        await self.broadcast(
            room_id,
            {
                "type": "user_joined",
                "count": len(self.rooms[room_id])
            }
        )

    def disconnect(
        self,
        room_id: str,
        websocket: WebSocket
    ):
        if room_id in self.rooms:
            self.rooms[room_id].remove(websocket)

    async def broadcast(
        self,
        room_id: str,
        message: dict
    ):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                await connection.send_json(message)


manager = ConnectionManager()