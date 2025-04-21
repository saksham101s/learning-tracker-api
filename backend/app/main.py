from fastapi import FastAPI
from app.api.routes import router
from app.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Learning Tracker API")
app.include_router(router)

