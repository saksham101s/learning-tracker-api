from fastapi import FastAPI
from app.api.routes import router
from app.core.database import engine, Base
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Learning Tracker API")

# Define your frontend origin properly
origins = [
    "http://localhost:5173",
]

# Properly pass origins list here
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # <--- use the origins list
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)
