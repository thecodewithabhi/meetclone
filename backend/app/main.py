from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.app.api.auth import router as auth_router
from backend.app.api.rooms import router as room_router
from backend.app.api.livekit import router as livekit_router
from backend.app.api.meetings import router as meetings_router
from backend.app.api.users import router as users_router
from backend.app.websocket.signaling import router as signaling_router

from backend.app.core.database import Base, engine
from backend.app.models.user import User
from backend.app.models.meeting import Meeting
from backend.app.models.room import Room
from backend.app.models.message import Message


app = FastAPI(
    title='MeetClone API',
    version='2.0.0',
    description='Google Meet Clone — Real-time Video Conferencing Platform'
)


@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get('/')
async def home():
    return {
        'message': 'MeetClone API Running',
        'version': '2.0.0',
        'docs': '/docs'
    }


app.include_router(auth_router)
app.include_router(room_router)
app.include_router(livekit_router)
app.include_router(meetings_router)
app.include_router(users_router)
app.include_router(signaling_router)