from fastapi import FastAPI

from app.api.auth.signup import router as signup_router
from app.api.auth.login import router as login_router
from app.api.users.profile import router as profile_router
from app.api.users.resume import router as resume_router
app = FastAPI(
    title="Job Portal API"
)

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

@app.get("/")
def home():
    return {
        "message": "Job Portal API Running"
    }
