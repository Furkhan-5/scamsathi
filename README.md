# ScamSathi

An Explainable Multimodal AI Platform for Detecting Digital Scams in Indian Languages.

## Overview

ScamSathi helps regional language users identify digital frauds (phishing attempts, UPI refund scams, KYC warnings, WhatsApp job bait, courier seizures) by highlighting danger cues and explaining **why** a message or domain constitutes a threat.

## Architecture & Stack

- **Frontend**: Next.js 15, React 19, TypeScript, TailwindCSS, Framer Motion transitions, and Recharts index history. Includes a dynamic local theme engine.
- **Backend**: FastAPI (Python), SQLAlchemy database models.
- **Database**: SQLite (default out-of-the-box configuration) with instant SQL schema creation. Supports direct scale updates to PostgreSQL.

---

## Getting Started

### Method 1: Local Deployment (Quick Start)

#### 1. Backend Server Setup
Navigate to the `backend/` directory:
```bash
cd backend
python -m venv venv
# On Windows
.\venv\Scripts\activate
# Install requirements
pip install -r requirements.txt
# Run the FastAPI server
python main.py
```
*The server automatically boots SQLite and mounts database schemas. Exposes documentation at `http://127.0.0.1:8000/docs`.*

#### 2. Frontend client Setup
Navigate to the `frontend/` directory:
```bash
cd ../frontend
npm install
npm run dev
```
*Launches Next.js developer hot reload server at `http://localhost:3000`.*

---

### Method 2: Docker Containers Deployment

To run both services coordinate inside isolated containers, execute from root:
```bash
docker-compose up --build
```
- Frontend portal will load at: `http://localhost:3000`
- API documentation will load at: `http://localhost:8000/docs`

---

## Threat Classification Presets & Heuristic testing

To test the multimodal AI explanation routing, execute the following parameters:

1. **Text Scan Lures**:
   - *SBI KYC Threat*: Input `"SBI Alert: Your netbanking will block. Update PAN at http://sbi-pan-update.com/login."`
   - *Advance Lottery*: Input `"KBC Lucky Draw: Congratulations! You won Rs 50,000 lottery. Send Rs 2500 fee to UPI ID kbc@upi."`

2. **Screenshot / Audio File Mockings**:
   - To trigger simulated OCR or voice transcribe, upload any media asset and include keyword markers in the filename:
     - OCR Win Match: name screenshot file `lottery_screenshot.png`.
     - Speech-to-text OTP Match: name audio file `bank_otp_voice.mp3`.

---

## Admin Controls
Log in with credential `developer@scamsathi.in` (simulate Google Auth button login on sign-in screen) to load system action log feeds and submitted feedback tickets.
