from sqlalchemy import Column, Integer, String, Float, Date, ForeignKey
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id=Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

class LearningLog(Base):
    __tablename__ = "learning_logs"

    id=Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    Date = Column(Date)
    platform = Column(String)
    topics = Column(String)
    time_spent = Column(Float)
    problems_solved = Column(Integer)

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    description = Column(String)
    target_problems = Column(Integer)
    deadline = Column(Date)