from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user, require_admin
from app.models.job import Job
from app.models.user import User
from app.schemas.job_schema import (
    JobCreate,
    JobUpdate,
    JobResponse,
)


router = APIRouter()


@router.get(
    "/",
    response_model=list[JobResponse]
)
def list_jobs(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return db.query(Job).order_by(
        Job.created_at.desc()
    ).all()


@router.get(
    "/{job_id}",
    response_model=JobResponse
)
def get_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(Job).filter(
        Job.id == job_id
    ).first()

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job


@router.post(
    "/",
    response_model=JobResponse
)
def create_job(
    job_data: JobCreate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_admin),
):
    job = Job(
        **job_data.model_dump(),
        created_by=admin.id
    )

    db.add(job)
    db.commit()
    db.refresh(job)

    return job


@router.put(
    "/{job_id}",
    response_model=JobResponse
)
def update_job(
    job_id: int,
    job_data: JobUpdate,
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

    for key, value in job_data.model_dump().items():
        setattr(job, key, value)

    db.commit()
    db.refresh(job)

    return job


@router.delete("/{job_id}")
def delete_job(
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

    db.delete(job)
    db.commit()

    return {
        "message": "Job deleted successfully"
    }