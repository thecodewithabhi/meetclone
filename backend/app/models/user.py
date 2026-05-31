from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from backend.app.core.database import Base


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)

    name = Column(String)
    email = Column(String, unique=True)
    password = Column(String)

    api_key = Column(String)
    api_secret = Column(String)