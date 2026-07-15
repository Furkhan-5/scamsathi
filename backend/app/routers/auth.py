import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    get_current_user
)
from app.utils.email import send_welcome_email, send_otp_email, send_password_reset_email

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(models.User).filter(models.User.email == user_in.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Generate verification OTP
    otp = f"{random.randint(100000, 999999)}"
    
    new_user = models.User(
        email=user_in.email,
        hashed_password=get_password_hash(user_in.password),
        full_name=user_in.full_name,
        otp_code=otp,
        is_verified=False
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create system log
    log = models.SystemLog(
        level="INFO",
        message=f"User registration created: {new_user.email}",
        details=f"User ID: {new_user.id}"
    )
    db.add(log)
    db.commit()
    
    # Send simulation emails
    send_welcome_email(new_user.email, new_user.full_name)
    send_otp_email(new_user.email, otp)
    
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    if not user or not verify_password(credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    access_token = create_access_token(data={"sub": user.email, "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/verify-otp")
def verify_otp(payload: schemas.VerifyOTP, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user.otp_code == payload.otp_code:
        user.is_verified = True
        user.otp_code = None
        db.commit()
        return {"status": "success", "message": "Email verified successfully"}
    else:
        raise HTTPException(status_code=400, detail="Invalid OTP code")

@router.post("/forgot-password")
def forgot_password(payload: schemas.ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == payload.email).first()
    if not user:
        # Prevent user enumeration but return success
        return {"status": "success", "message": "Password reset instructions sent if email exists."}
    
    reset_token = f"reset-{random.randint(100000, 999999)}"
    user.reset_token = reset_token
    db.commit()
    
    send_password_reset_email(user.email, reset_token)
    return {"status": "success", "message": "Password reset instructions sent."}

@router.post("/reset-password")
def reset_password(payload: schemas.ResetPasswordConfirm, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.reset_token == payload.token).first()
    if not user:
        raise HTTPException(status_code=400, detail="Invalid reset token")
        
    user.hashed_password = get_password_hash(payload.new_password)
    user.reset_token = None
    db.commit()
    return {"status": "success", "message": "Password reset completed successfully"}

@router.get("/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return current_user
