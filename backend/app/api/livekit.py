from fastapi import APIRouter

from livekit import api

from backend.app.core.config import settings


router = APIRouter(
    prefix='/livekit',
    tags=['LiveKit']
)


@router.get('/token')
async def generate_token(
    room_name: str,
    user_name: str,
    can_publish: bool = True,
    can_subscribe: bool = True,
):
    """Generate a LiveKit access token with full media grants including screen share."""
    token = api.AccessToken(
        settings.LIVEKIT_API_KEY,
        settings.LIVEKIT_API_SECRET
    ) \
    .with_identity(user_name) \
    .with_name(user_name) \
    .with_grants(
        api.VideoGrants(
            room_join=True,
            room=room_name,
            can_publish=can_publish,
            can_subscribe=can_subscribe,
            can_publish_data=True,
            can_publish_sources=[
                'camera',
                'microphone',
                'screen_share',
                'screen_share_audio',
            ],
        )
    )

    return {
        'token': token.to_jwt(),
        'url': settings.LIVEKIT_URL,
        'room_name': room_name,
        'user_name': user_name,
    }