import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.auth.signup import router as signup_router
from app.api.auth.login import router as login_router
from app.api.users.profile import router as profile_router
from app.api.users.resume import router as resume_router
from app.api.skills import router as skills_router
from app.api.jobs import router as jobs_router
from app.api.applications import router as applications_router


app = FastAPI(
    title="Job Portal API"
)


# Frontend URL
# Local value comes from backend/.env during development.
# Production value will be set on the hosting platform.
frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)


origins = [
    frontend_url,
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Authentication routes

app.include_router(
    signup_router,
    prefix="/auth",
    tags=["Authentication"]
)

app.include_router(
    login_router,
    prefix="/auth",
    tags=["Authentication"]
)


# User routes

app.include_router(
    profile_router,
    prefix="/users",
    tags=["Users"]
)

app.include_router(
    resume_router,
    prefix="/users",
    tags=["Resumes"]
)


# Skills routes

app.include_router(
    skills_router,
    prefix="/skills",
    tags=["Skills"]
)


# Jobs routes

app.include_router(
    jobs_router,
    prefix="/jobs",
    tags=["Jobs"]
)


# Application routes

app.include_router(
    applications_router,
    prefix="/applications",
    tags=["Applications"]
)


@app.get("/")
def home():
    return {
        "message": "Job Portal API Running"
    }