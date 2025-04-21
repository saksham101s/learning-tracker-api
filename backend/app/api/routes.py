from fastapi import APIRouter, Depends, HTTPException, Query, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date

from app.core.database import SessionLocal
from app.schemas import schemas
from app.crud import crud
from app.auth.auth import create_access_token, get_current_user

router = APIRouter()

def get_db():
    db= SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ---- Auth ----
@router.post("/token", response_model=schemas.Token)
def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_username(db, form_data.username)
    if not user or not crud.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(
        data={"sub": user.username}
    )
    return {"access_token": access_token, "token_type": "bearer"}

# ---- User ----
@router.post("/register", response_model=schemas.UserCreate)
def register_user(
    user: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    return crud.create_user(db=db, user=user)

# ---- Logs ----
@router.post("/log", response_model=schemas.LearningLogOut)
def log_learning(
    user_id: int = Query(..., description="ID of the user"),
    log: schemas.LearningLogCreate = Depends(),
    db: Session = Depends(get_db)
):
    return crud.create_log(db=db, user_id=user_id, log=log)

@router.get("/logs", response_model=List[schemas.LearningLogOut])
def read_logs(
    user_id: int = Query(..., description="ID of the user"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    return crud.get_logs_by_user(db=db, user_id=user_id, start_date=start_date, end_date=end_date)

# ---- Stats ----
@router.get("/stats", response_model=schemas.Stats)
def read_stats(
    user_id: int = Query(..., description="ID of the user"),
    start_date: Optional[date] = Query(None),
    end_date: Optional[date] = Query(None),
    db: Session = Depends(get_db)
):
    return crud.get_stats(db=db, user_id=user_id, start_date=start_date, end_date=end_date)

# ---- Goals ----
@router.post("/goal", response_model=schemas.GoalOut)
def set_goal(
    goal: schemas.GoalCreate,
    user_id: int = Query(..., description="ID of the user"),
    db: Session = Depends(get_db)
):
    return crud.create_goal(db=db, user_id=user_id, goal=goal)

@router.get("/goals", response_model=List[schemas.GoalOut])
def read_goals(
    user_id: int = Query(..., description="ID of the user"),
    db: Session = Depends(get_db)
):
    return crud.get_goals_by_user(db=db, user_id=user_id)