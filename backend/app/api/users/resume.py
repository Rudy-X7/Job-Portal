import os
import shutil
import uuid

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.resume import Resume
from app.models.user import User


router = APIRouter()

UPLOAD_DIR = "uploads/resumes"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/resumes/upload")
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are allowed"
        )

    unique_filename = f"{uuid.uuid4()}.pdf"

    file_path = os.path.join(
        UPLOAD_DIR,
        unique_filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    db.query(Resume).filter(
        Resume.user_id == current_user.id,
        Resume.is_default == True
    ).update(
        {"is_default": False},
        synchronize_session=False
    )

    resume = Resume(
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=unique_filename,
        file_path=file_path,
        is_default=True
    )

    db.add(resume)
    db.commit()
    db.refresh(resume)

    return {
        "message": "Resume uploaded successfully",
        "resume": {
            "id": resume.id,
            "original_filename": resume.original_filename,
            "is_default": resume.is_default,
            "uploaded_at": resume.uploaded_at
        }
    }


@router.get("/resumes")
def list_resumes(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resumes = db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).order_by(
        Resume.uploaded_at.desc()
    ).all()

    return {
        "resumes": [
            {
                "id": resume.id,
                "original_filename": resume.original_filename,
                "is_default": resume.is_default,
                "uploaded_at": resume.uploaded_at,
            }
            for resume in resumes
        ]
    }


@router.put("/resumes/{resume_id}/default")
def set_default_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    db.query(Resume).filter(
        Resume.user_id == current_user.id
    ).update(
        {"is_default": False},
        synchronize_session=False
    )

    resume.is_default = True

    db.commit()
    db.refresh(resume)

    return {
        "message": "Default resume updated successfully",
        "resume_id": resume.id
    }


@router.delete("/resumes/{resume_id}")
def delete_resume(
    resume_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    resume = db.query(Resume).filter(
        Resume.id == resume_id,
        Resume.user_id == current_user.id
    ).first()

    if not resume:
        raise HTTPException(
            status_code=404,
            detail="Resume not found"
        )

    was_default = resume.is_default
    file_path = resume.file_path

    db.delete(resume)
    db.commit()

    if os.path.exists(file_path):
        os.remove(file_path)

    if was_default:
        latest_resume = db.query(Resume).filter(
            Resume.user_id == current_user.id
        ).order_by(
            Resume.uploaded_at.desc()
        ).first()

        if latest_resume:
            latest_resume.is_default = True
            db.commit()

    return {
        "message": "Resume deleted successfully"
    }