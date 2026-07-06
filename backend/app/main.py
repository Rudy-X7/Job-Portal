from fastapi import FastAPI

from app.api.auth.signup import router as signup_router
from app.api.auth.login import router as login_router
from app.api.users.profile import router as profile_router
from app.api.users.resume import router as resume_router
from app.api.skills import router as skills_router
from app.api.jobs import router as jobs_router


# Create FastAPI application FIRST
app = FastAPI(
    title="Job Portal API"
)


# Register routers AFTER app is created

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

app.include_router(
    skills_router,
    prefix="/skills",
    tags=["Skills"]
)
app.include_router(
    jobs_router,
    prefix="/jobs",
    tags=["Jobs"]
)

@app.get("/")
def home():
    return {
        "message": "Job Portal API Running"
    }