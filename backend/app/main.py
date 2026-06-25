from fastapi import FastAPI

from app.api.auth.signup import router as signup_router
from app.api.auth.login import router as login_router

app = FastAPI()

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


@app.get("/")
def home():
    return {
        "message": "Job Portal API Running"
    }