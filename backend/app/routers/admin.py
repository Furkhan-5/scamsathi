import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.utils.security import get_current_user
from app.routers.analyze import format_report_response

router = APIRouter(prefix="/api/admin", tags=["Admin Portal"])

def check_admin_permission(user: models.User):
    """Simple check. For demonstration, any registered user can see mock admin dashboards, but we'll include check checks."""
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin credentials required."
        )

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_admin_permission(current_user)
    
    total_users = db.query(models.User).count()
    total_reports = db.query(models.ScanReport).count()
    
    # Calculate average risk of system scans
    reports = db.query(models.ScanReport).all()
    avg_risk = sum(r.risk_score for r in reports) / len(reports) if reports else 0
    
    # Count critical items (risk > 70)
    critical_count = sum(1 for r in reports if r.risk_score > 70)
    
    # Simple distribution
    distribution = {"UPI": 0, "KYC": 0, "Job": 0, "Courier": 0, "Crypto": 0, "Safe": 0}
    for r in reports:
        cat = r.category.lower()
        if "upi" in cat:
            distribution["UPI"] += 1
        elif "kyc" in cat or "bank" in cat:
            distribution["KYC"] += 1
        elif "job" in cat:
            distribution["Job"] += 1
        elif "courier" in cat:
            distribution["Courier"] += 1
        elif "crypto" in cat or "invest" in cat:
            distribution["Crypto"] += 1
        else:
            distribution["Safe"] += 1

    return {
        "total_users": total_users,
        "total_reports": total_reports,
        "average_risk": round(avg_risk, 1),
        "critical_scams": critical_count,
        "category_distribution": distribution,
        "system_status": "Operational",
        "cpu_usage": 14,
        "memory_usage": 42
    }

@router.get("/users", response_model=List[schemas.UserResponse])
def get_all_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_admin_permission(current_user)
    return db.query(models.User).order_by(models.User.created_at.desc()).all()

@router.get("/reports", response_model=List[schemas.ScanResponse])
def get_all_reports(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_admin_permission(current_user)
    reports = db.query(models.ScanReport).order_by(models.ScanReport.created_at.desc()).all()
    return [format_report_response(r) for r in reports]

@router.get("/logs", response_model=List[schemas.SystemLogResponse])
def get_system_logs(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_admin_permission(current_user)
    return db.query(models.SystemLog).order_by(models.SystemLog.created_at.desc()).limit(100).all()

@router.get("/feedbacks", response_model=List[schemas.ContactResponse])
def get_feedbacks(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    check_admin_permission(current_user)
    return db.query(models.ContactMessage).order_by(models.ContactMessage.created_at.desc()).all()
