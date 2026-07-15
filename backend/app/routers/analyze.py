import json
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form, status
from sqlalchemy.orm import Session
from app.database import get_db
from app import models, schemas
from app.utils.security import get_current_user
from app.utils.ocr import extract_text_from_image
from app.utils.audio import transcribe_audio_file
from app.utils.ai import analyze_text_scam, analyze_url_threat
from app.utils.email import send_report_ready_email

router = APIRouter(prefix="/api/analyze", tags=["Scam Analysis"])

def format_report_response(report: models.ScanReport) -> dict:
    """Helper to convert stored database scan report strings into lists for response schemas."""
    return {
        "id": report.id,
        "user_id": report.user_id,
        "scan_type": report.scan_type,
        "input_data": report.input_data,
        "language": report.language,
        "risk_score": report.risk_score,
        "confidence_score": report.confidence_score,
        "category": report.category,
        "detected_phrases": json.loads(report.detected_phrases) if report.detected_phrases else [],
        "psychological_triggers": json.loads(report.psychological_triggers) if report.psychological_triggers else [],
        "explanation": report.explanation,
        "recommended_actions": json.loads(report.recommended_actions) if report.recommended_actions else [],
        "created_at": report.created_at
    }

@router.post("/scan", response_model=schemas.ScanResponse)
def scan_text_or_url(
    payload: schemas.ScanRequest,
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    
    if payload.scan_type == "url":
        analysis = analyze_url_threat(payload.content)
    else:
        analysis = analyze_text_scam(payload.content)

    new_report = models.ScanReport(
        user_id=user_id,
        scan_type=payload.scan_type,
        input_data=payload.content,
        language=analysis.get("language", "English"),
        risk_score=analysis.get("risk_score", 0),
        confidence_score=analysis.get("confidence_score", 0),
        category=analysis.get("category", "Safe"),
        detected_phrases=json.dumps(analysis.get("detected_phrases", [])),
        psychological_triggers=json.dumps(analysis.get("psychological_triggers", [])),
        explanation=analysis.get("explanation", ""),
        recommended_actions=json.dumps(analysis.get("recommended_actions", []))
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Log action
    log = models.SystemLog(
        level="WARNING" if new_report.risk_score > 40 else "INFO",
        message=f"Threat scan performed. Type: {payload.scan_type}. Threat Class: {new_report.category}",
        details=f"Scan ID: {new_report.id}. Risk: {new_report.risk_score}%"
    )
    db.add(log)
    db.commit()

    # If registered user, send simulation email notification for critical risks
    if current_user and new_report.risk_score > 50:
        send_report_ready_email(current_user.email, new_report.id, new_report.category, new_report.risk_score)

    return format_report_response(new_report)

@router.post("/screenshot", response_model=schemas.ScanResponse)
def scan_screenshot(
    file: UploadFile = File(...),
    language: str = Form("en"),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    
    try:
        content = file.file.read()
        extracted_text = extract_text_from_image(content, file.filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not parse uploaded image: {str(e)}"
        )
        
    analysis = analyze_text_scam(extracted_text)
    
    new_report = models.ScanReport(
        user_id=user_id,
        scan_type="screenshot",
        input_data=f"[Screenshot: {file.filename}] Text Extracted: {extracted_text}",
        language=analysis.get("language", "English"),
        risk_score=analysis.get("risk_score", 0),
        confidence_score=analysis.get("confidence_score", 0),
        category=analysis.get("category", "Safe"),
        detected_phrases=json.dumps(analysis.get("detected_phrases", [])),
        psychological_triggers=json.dumps(analysis.get("psychological_triggers", [])),
        explanation=analysis.get("explanation", ""),
        recommended_actions=json.dumps(analysis.get("recommended_actions", []))
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Log action
    log = models.SystemLog(
        level="WARNING" if new_report.risk_score > 40 else "INFO",
        message=f"Screenshot OCR scan performed. File: {file.filename}",
        details=f"Scan ID: {new_report.id}. Risk: {new_report.risk_score}%"
    )
    db.add(log)
    db.commit()

    if current_user and new_report.risk_score > 50:
        send_report_ready_email(current_user.email, new_report.id, new_report.category, new_report.risk_score)

    return format_report_response(new_report)

@router.post("/audio", response_model=schemas.ScanResponse)
def scan_audio(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    
    try:
        content = file.file.read()
        transcription_result = transcribe_audio_file(content, file.filename)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Could not process audio: {str(e)}"
        )
        
    transcript = transcription_result["transcript"]
    analysis = analyze_text_scam(transcript)
    
    # Overwrite language metadata with transcribed voice metrics
    analysis_lang = transcription_result["detected_language"]
    
    new_report = models.ScanReport(
        user_id=user_id,
        scan_type="audio",
        input_data=f"[Audio Upload: {file.filename}] Transcribed: {transcript}",
        language=analysis_lang,
        risk_score=analysis.get("risk_score", 0),
        confidence_score=transcription_result.get("confidence", 90),
        category=analysis.get("category", "Safe"),
        detected_phrases=json.dumps(analysis.get("detected_phrases", [])),
        psychological_triggers=json.dumps(analysis.get("psychological_triggers", [])),
        explanation=analysis.get("explanation", ""),
        recommended_actions=json.dumps(analysis.get("recommended_actions", []))
    )
    
    db.add(new_report)
    db.commit()
    db.refresh(new_report)

    # Log action
    log = models.SystemLog(
        level="WARNING" if new_report.risk_score > 40 else "INFO",
        message=f"Audio Speech-to-Text scan performed. File: {file.filename}",
        details=f"Scan ID: {new_report.id}. Risk: {new_report.risk_score}%"
    )
    db.add(log)
    db.commit()

    if current_user and new_report.risk_score > 50:
        send_report_ready_email(current_user.email, new_report.id, new_report.category, new_report.risk_score)

    return format_report_response(new_report)

@router.get("/history", response_model=List[schemas.ScanResponse])
def get_scan_history(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    if not current_user:
        # Return empty list or fallback to empty for anonymous users
        return []
    
    reports = db.query(models.ScanReport).filter(models.ScanReport.user_id == current_user.id).order_by(models.ScanReport.created_at.desc()).all()
    return [format_report_response(r) for r in reports]

@router.get("/report/{report_id}", response_model=schemas.ScanResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(models.ScanReport).filter(models.ScanReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Scam analysis report not found")
    return format_report_response(report)
