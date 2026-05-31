from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from backend.app.core.database import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserResponse

router = APIRouter(
    prefix='/users',
    tags=['Users']
)


@router.get('/me')
async def get_me():
    return {'message': 'Guest user'}
