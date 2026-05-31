from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from backend.app.core.database import Base


class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(Integer, primary_key=True)
    room_id = Column(String, unique=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    is_active = Column(Boolean, default=True)