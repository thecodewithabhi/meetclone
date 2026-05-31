from uuid import uuid4

from backend.app.schemas.auth import RegisterSchema
from backend.app.schemas.auth import LoginSchema

from backend.app.models.user import User

from backend.app.core.database import get_db

from backend.app.core.security import hash_password
from backend.app.core.security import verify_password
from backend.app.core.security import create_access_token
from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
router = APIRouter(
    prefix='/auth',
    tags=['Auth']
)


from fastapi import HTTPException


@router.post('/register')
async def register(
    payload: RegisterSchema,
    db: AsyncSession = Depends(get_db)
):
    # Check if email is already registered
    query = select(User).where(User.email == payload.email)
    result = await db.execute(query)
    existing_user = result.scalar_one_or_none()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        api_key=str(uuid4()),
        api_secret=str(uuid4())
    )

    db.add(user)

    await db.commit()

    return {
        'message': 'User registered'
    }


@router.post('/login')
async def login(
    payload: LoginSchema,
    db: AsyncSession = Depends(get_db)
):
    query = select(User).where(
        User.email == payload.email
    )

    result = await db.execute(query)

    user = result.scalar_one_or_none()

    if not user:
        return {'error': 'Invalid credentials'}

    if not verify_password(
        payload.password,
        user.password
    ):
        return {'error': 'Invalid credentials'}

    token = create_access_token({
        'user_id': user.id,
        'email': user.email
    })

    return {
        'access_token': token,
        'api_key': user.api_key,
        'api_secret': user.api_secret
    }