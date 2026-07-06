from datetime import datetime

from pydantic import BaseModel, ConfigDict


class JobCreate(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: str
    employment_type: str


class JobUpdate(BaseModel):
    title: str
    company: str
    location: str
    description: str
    requirements: str
    employment_type: str


class JobResponse(BaseModel):
    id: int
    title: str
    company: str
    location: str
    description: str
    requirements: str
    employment_type: str
    created_by: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)