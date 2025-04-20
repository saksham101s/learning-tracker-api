from pydantic import BaseModel
from typing import Optional,List
from datetime import date

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: str

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None


class UserLogin(BaseModel):
    username: str
    password: str

class LearningLogCreate(BaseModel):
    date: date
    platform: str
    topics: str
    time_spent: float
    problem_solved: int

class LearningLogOut(BaseModel):
    id: int
    user_id: int
    date: date
    platform: str
    topics: str
    time_spent: float
    problems_solved: int

    class Config:
        from_attributes = True

class GoalCreate(BaseModel):
    description: str
    target_problems: int
    deadline: date

class GoalOut(BaseModel):
    id: int
    user_id: int
    description: str
    target_problems: int
    deadline: date

    class Config:
        from_attributes = True

# ---- Stats ----
class Stats(BaseModel):
    total_time: float
    total_problems: int
    