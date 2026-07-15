import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    full_name = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    otp_code = Column(String, nullable=True)
    reset_token = Column(String, nullable=True)
    preferred_language = Column(String, default="en")
    preferred_theme = Column(String, default="dark")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    reports = relationship("ScanReport", back_populates="user")

class ScanReport(Base):
    __tablename__ = "scan_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    scan_type = Column(String, nullable=False)  # "text", "screenshot", "audio", "url"
    input_data = Column(Text, nullable=False)    # Raw text, URL, file reference, etc.
    language = Column(String, default="en")
    risk_score = Column(Integer, default=0)       # 0 - 100
    confidence_score = Column(Integer, default=0) # 0 - 100
    category = Column(String, default="Safe")     # e.g., "Phishing", "UPI Fraud", "Safe"
    detected_phrases = Column(Text, nullable=True) # JSON array of phrases/coordinates
    psychological_triggers = Column(Text, nullable=True) # JSON array of traits (urgency, etc.)
    explanation = Column(Text, nullable=True)     # Detailed Markdown markdown explaining the scam
    recommended_actions = Column(Text, nullable=True) # JSON array of steps to take
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="reports")

class ContactMessage(Base):
    __tablename__ = "contact_messages"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class SystemLog(Base):
    __tablename__ = "system_logs"

    id = Column(Integer, primary_key=True, index=True)
    level = Column(String, default="INFO")  # "INFO", "WARNING", "ERROR"
    message = Column(String, nullable=False)
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
