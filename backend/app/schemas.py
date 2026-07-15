from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# Auth Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    preferred_language: Optional[str] = None
    preferred_theme: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: Optional[str] = None
    is_active: bool
    is_verified: bool
    preferred_language: str
    preferred_theme: str
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

class VerifyOTP(BaseModel):
    email: EmailStr
    otp_code: str

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordConfirm(BaseModel):
    token: str
    new_password: str = Field(..., min_length=6)

# Scan Schemas
class ScanRequest(BaseModel):
    scan_type: str  # "text" or "url"
    content: str    # Raw text or URL link
    language: Optional[str] = "en"

class ScanResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    scan_type: str
    input_data: str
    language: str
    risk_score: int
    confidence_score: int
    category: str
    detected_phrases: Optional[List[str]] = []
    psychological_triggers: Optional[List[str]] = []
    explanation: str
    recommended_actions: Optional[List[str]] = []
    created_at: datetime

    class Config:
        from_attributes = True

# Contact Schemas
class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str

class ContactResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    subject: str
    message: str
    created_at: datetime

    class Config:
        from_attributes = True

# Admin Log Schema
class SystemLogResponse(BaseModel):
    id: int
    level: str
    message: str
    details: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
