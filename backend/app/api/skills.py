from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.skill import Skill
from app.models.user import User
from app.schemas.skill_schema import (
    SkillCreate,
    SkillUpdate,
    SkillResponse,
)


router = APIRouter()


@router.get(
    "/",
    response_model=list[SkillResponse]
)
def list_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Skill).order_by(Skill.name).all()


@router.post(
    "/",
    response_model=SkillResponse
)
def create_skill(
    skill_data: SkillCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    existing_skill = db.query(Skill).filter(
        Skill.name == skill_data.name
    ).first()

    if existing_skill:
        raise HTTPException(
            status_code=400,
            detail="Skill already exists"
        )

    skill = Skill(name=skill_data.name)

    db.add(skill)
    db.commit()
    db.refresh(skill)

    return skill


@router.put(
    "/{skill_id}",
    response_model=SkillResponse
)
def update_skill(
    skill_id: int,
    skill_data: SkillUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    duplicate = db.query(Skill).filter(
        Skill.name == skill_data.name,
        Skill.id != skill_id
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=400,
            detail="Skill already exists"
        )

    skill.name = skill_data.name

    db.commit()
    db.refresh(skill)

    return skill


@router.delete("/{skill_id}")
def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    skill = db.query(Skill).filter(
        Skill.id == skill_id
    ).first()

    if not skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    db.delete(skill)
    db.commit()

    return {
        "message": "Skill deleted successfully"
    }