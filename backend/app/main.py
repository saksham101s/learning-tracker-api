from fastapi import FastAPI
from app.api.routes import router
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Learning Tracker API")
origins = [
    "http://localhost:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # allow GET, POST, etc.
    allow_headers=["*"],      # allow Authorization header, JSON, etc.
)
app.include_router(router)

