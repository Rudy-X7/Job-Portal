from fastapi import FastAPI

from app.api.auth.signup import router as signup_router

app = FastAPI()

app.include_router(
    signup_router,
    prefix="/auth",
    tags=["Authentication"]
)


@app.get("/")
def home():
    return {
        "message": "Job Portal API Running"
    }