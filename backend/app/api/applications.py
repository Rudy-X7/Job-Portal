from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user, require_admin

from app.models.application import Application
from app.models.job import Job
from app.models.resume import Resume
from app.models.user import User

from app.schemas.application_schema import (
    ApplicationCreate,
    ApplicationResponse,
    ApplicationStatusUpdate,
)


router = APIRouter()


@router.post(
    "/",
    response_model=ApplicationResponse
)
def apply_for_job(
    application_data: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.role != "candidate":
        raise HTTPException(
            status_code=403,
            detail="Only candidates can apply for jobs"
        )

    job = db.query(Job).filter(
        Job.id == application_data.job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    resume = db.query(Resume).filter(
        Resume.id == application_data.resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    existing_application = db.query(Application).filter(
        Application.user_id == current_user.id,
        Application.job_id == application_data.job_id
    ).first()

    if existing_application:
        raise HTTPException(
            status_code=400,
            detail="You have already applied for this job"
        )

    application = Application(
        user_id=current_user.id,
        job_id=application_data.job_id,
        resume_id=application_data.resume_id,
        status="pending"
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application


@router.get(
    "/my",
    response_model=list[ApplicationResponse]
)
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Application).filter(
        Application.user_id == current_user.id
    ).order_by(
        Application.applied_at.desc()
    ).all()


@router.get(
    "/job/{job_id}",
    response_model=list[ApplicationResponse]
)
def get_job_applications(
    job_id: int,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return db.query(Application).filter(
        Application.job_id == job_id
    ).order_by(
        Application.applied_at.desc()
    ).all()


@router.put(
    "/{application_id}/status",
    response_model=ApplicationResponse
)
def update_application_status(
    application_id: int,
    status_data: ApplicationStatusUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    allowed_statuses = [
        "pending",
        "shortlisted",
        "rejected"
    ]

    if status_data.status not in allowed_statuses:
        raise HTTPException(
            status_code=400,
            detail="Status must be pending, shortlisted, or rejected"
        )

    application = db.query(Application).filter(
        Application.id == application_id
    ).first()

    if not application:
        raise HTTPException(
            status_code=404,
            detail="Application not found"
        )

    application.status = status_data.status

    db.commit()
    db.refresh(application)

    return application