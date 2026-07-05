from typing import Optional

from pydantic import BaseModel, EmailStr


class UserSignup(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserProfileUpdate(BaseModel):
    phone: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[int] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None


class UserProfileResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str

    phone: Optional[str] = None
    headline: Optional[str] = None
    bio: Optional[str] = None
    experience: Optional[int] = None
    location: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    profile_image: Optional[str] = None

    class Config:
        from_attributes = True