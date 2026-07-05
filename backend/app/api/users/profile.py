from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.schemas.user_schema import (
    UserProfileUpdate,
    UserProfileResponse,
)

router = APIRouter()


@router.get(
    "/me",
    response_model=UserProfileResponse
)
def get_current_user_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.get(
    "/profile",
    response_model=UserProfileResponse
)
def get_profile(
    current_user: User = Depends(get_current_user)
):
    return current_user


@router.put(
    "/profile",
    response_model=UserProfileResponse
)
def update_profile(
    profile: UserProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    update_data = profile.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.commit()
    db.refresh(current_user)

    return current_user