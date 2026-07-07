from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ApplicationCreate(BaseModel):
    job_id: int
    resume_id: int


class ApplicationStatusUpdate(BaseModel):
    status: str


class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    job_id: int
    resume_id: int
    status: str
    applied_at: datetime

    model_config = ConfigDict(from_attributes=True)