from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date
from app.models.models import User, LearningLog, Goal
from app.schemas.schemas import UserCreate, LearningLogCreate, GoalCreate
from passlib.context import CryptContext
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_user_by_username(db: Session, username: str):
    return db.query(User).filter(User.username == username).first()

def create_user(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(username=user.username, email=user.email, password_hash=hashed_password)
    db.add(db_user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()  # VERY important: rollback failed transaction
        raise HTTPException(status_code=400, detail="Username already exists. Please choose a different one.")
    db.refresh(db_user)
    return db_user

def create_log(db: Session, user_id: int, log: LearningLogCreate):
    db_log = LearningLog(user_id=user_id, **log.dict())
    db.add(db_log)
    db.commit()
    db.refresh(db_log)
    return db_log

def get_logs_by_user(
    db: Session,
    user_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> list[LearningLog]:
    query = db.query(LearningLog).filter(LearningLog.user_id == user_id)
    if start_date:
        query = query.filter(LearningLog.date >= start_date)
    if end_date:
        query = query.filter(LearningLog.date <= end_date)
    return query.order_by(LearningLog.date.desc()).all()

# ---- Stats ----
def get_stats(
    db: Session,
    user_id: int,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None
) -> dict:
    query = db.query(
        func.coalesce(func.sum(LearningLog.time_spent), 0).label("total_time"),
        func.coalesce(func.sum(LearningLog.problems_solved), 0).label("total_problems")
    ).filter(LearningLog.user_id == user_id)
    if start_date:
        query = query.filter(LearningLog.date >= start_date)
    if end_date:
        query = query.filter(LearningLog.date <= end_date)
    result = query.one()
    return {"total_time": result.total_time, "total_problems": result.total_problems}

def create_goal(db: Session, user_id: int, goal: GoalCreate):
    db_goal = Goal(user_id=user_id, **goal.dict())
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def get_goals_by_user(db: Session, user_id: int) -> list[Goal]:
    return db.query(Goal).filter(Goal.user_id == user_id).order_by(Goal.deadline.asc()).all()
