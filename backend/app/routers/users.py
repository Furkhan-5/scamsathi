from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.utils.security import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

@router.put("/profile", response_model=schemas.UserResponse)
def update_profile(
    payload: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user:
        raise HTTPException(status_code=401, detail="Unauthorized")
        
    if payload.full_name is not None:
        current_user.full_name = payload.full_name
    if payload.preferred_language is not None:
        current_user.preferred_language = payload.preferred_language
    if payload.preferred_theme is not None:
        current_user.preferred_theme = payload.preferred_theme
        
    db.commit()
    db.refresh(current_user)
    
    # Log update
    log = models.SystemLog(
        level="INFO",
        message=f"User updated profile details: {current_user.email}"
    )
    db.add(log)
    db.commit()
    
    return current_user

@router.post("/contact", response_model=schemas.ContactResponse)
def submit_contact_form(payload: schemas.ContactCreate, db: Session = Depends(get_db)):
    msg = models.ContactMessage(
        name=payload.name,
        email=payload.email,
        subject=payload.subject,
        message=payload.message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    
    # Log contact submission
    log = models.SystemLog(
        level="INFO",
        message=f"Contact message submitted by: {payload.email}",
        details=f"Subject: {payload.subject}"
    )
    db.add(log)
    db.commit()
    
    # Trigger auto-responder print to logs
    print(f"\n[EMAIL SYSTEM] Dispatching auto-response to feedback sender: {payload.email}")
    print(f"Subject: Re: {payload.subject}")
    print(f"Message: Thank you for contacting ScamSathi! We received your ticket: '{payload.subject}'. Our threat intelligence agents will review this promptly.\n")
    
    return msg
