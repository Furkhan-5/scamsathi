from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.routers import auth, analyze, admin, users
from app import models
from app.utils.security import get_password_hash

# Initialize Database tables
Base.metadata.create_all(bind=engine)

# Seed developer user
db = SessionLocal()
try:
    dev_user = db.query(models.User).filter(models.User.email == "developer@scamsathi.in").first()
    if not dev_user:
        hashed_pw = get_password_hash("developer123")
        new_dev = models.User(
            email="developer@scamsathi.in",
            hashed_password=hashed_pw,
            full_name="Developer Admin",
            is_verified=True,
            is_active=True
        )
        db.add(new_dev)
        db.commit()
        print("[DATABASE] Developer Admin account seeded successfully.")
finally:
    db.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Explainable AI Multimodal platform for Digital Scam Detection",
    version="1.0.0"
)

# CORS Policy configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register endpoints
app.include_router(auth.router)
app.include_router(analyze.router)
app.include_router(admin.router)
app.include_router(users.router)

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "ScamSathi Threat Engine Core API",
        "version": "1.0.0",
        "engine": "IndicBERT + Heuristics Model V2"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
