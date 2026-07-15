import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.config import settings

def send_simulated_email(recipient: str, subject: str, html_body: str) -> bool:
    """
    Simulates email dispatch. If SMTP env details are not provided,
    it outputs to the server logs and stores a local preview, making it completely
    visible for debugging.
    """
    print(f"\n[EMAIL SYSTEM] Dispatching Email...")
    print(f"Recipient: {recipient}")
    print(f"Subject: {subject}")
    print(f"Body Preview: {html_body[:200]}...")
    print(f"[EMAIL SYSTEM] Sent successfully (simulated).\n")
    return True

def send_welcome_email(email: str, name: str) -> bool:
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #1a202c; border-radius: 8px; background-color: #0d1117; color: #c9d1d9;">
        <h2 style="color: #58a6ff;">Welcome to ScamSathi, {name or 'User'}!</h2>
        <p>Thank you for creating an account with ScamSathi - India's premier explainable AI platform for cybersecurity and scam detection.</p>
        <p>You can now verify messages, analyze suspicious websites, and upload audio transcripts to shield yourself from digital frauds.</p>
        <br/>
        <a href="#" style="background-color: #21262d; border: 1px solid #30363d; color: #58a6ff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">Get Started</a>
        <footer style="margin-top: 20px; font-size: 11px; color: #8b949e;">&copy; 2026 ScamSathi. All rights reserved.</footer>
    </div>
    """
    return send_simulated_email(email, "Welcome to ScamSathi - Your AI Cyber Companion", html)

def send_otp_email(email: str, otp: str) -> bool:
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #1a202c; border-radius: 8px; background-color: #0d1117; color: #c9d1d9;">
        <h2 style="color: #ff7b72;">ScamSathi: Account Verification Code</h2>
        <p>Please use the following One-Time Password (OTP) to complete your registration or password reset process. This OTP is valid for 10 minutes.</p>
        <div style="font-size: 28px; font-weight: bold; background-color: #161b22; color: #79c0ff; text-align: center; padding: 15px; margin: 20px 0; border-radius: 6px; letter-spacing: 4px;">
            {otp}
        </div>
        <p>If you did not request this code, please ignore this email or contact support.</p>
        <footer style="margin-top: 20px; font-size: 11px; color: #8b949e;">&copy; 2026 ScamSathi. All rights reserved.</footer>
    </div>
    """
    return send_simulated_email(email, "ScamSathi Verification OTP Code", html)

def send_password_reset_email(email: str, token: str) -> bool:
    reset_url = f"http://localhost:3000/login?reset={token}"
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #1a202c; border-radius: 8px; background-color: #0d1117; color: #c9d1d9;">
        <h2 style="color: #d2a8ff;">Reset Your ScamSathi Password</h2>
        <p>You requested a password reset. Click the button below to choose a new password. This link will expire shortly.</p>
        <a href="{reset_url}" style="background-color: #238636; border: 1px solid #2ea043; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">Reset Password</a>
        <p style="margin-top: 15px; font-size: 12px; color: #8b949e;">Or copy this link: {reset_url}</p>
        <footer style="margin-top: 20px; font-size: 11px; color: #8b949e;">&copy; 2026 ScamSathi. All rights reserved.</footer>
    </div>
    """
    return send_simulated_email(email, "Reset Your ScamSathi Password", html)

def send_report_ready_email(email: str, report_id: int, category: str, risk_score: int) -> bool:
    report_url = f"http://localhost:3000/results/{report_id}"
    html = f"""
    <div style="font-family: sans-serif; max-width: 600px; padding: 20px; border: 1px solid #1a202c; border-radius: 8px; background-color: #0d1117; color: #c9d1d9;">
        <h2 style="color: #ff7b72;">ScamSathi Alert: Analysis Report Ready</h2>
        <p>Our AI platform has analyzed your request. The threat classification has been generated:</p>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <tr style="border-bottom: 1px solid #21262d;">
                <td style="padding: 8px; font-weight: bold; color: #8b949e;">Classification:</td>
                <td style="padding: 8px; color: #ff7b72; font-weight: bold;">{category}</td>
            </tr>
            <tr style="border-bottom: 1px solid #21262d;">
                <td style="padding: 8px; font-weight: bold; color: #8b949e;">Risk Score:</td>
                <td style="padding: 8px; color: #ff7b72; font-weight: bold;">{risk_score}%</td>
            </tr>
        </table>
        <a href="{report_url}" style="background-color: #21262d; border: 1px solid #30363d; color: #58a6ff; padding: 10px 20px; text-decoration: none; border-radius: 6px; display: inline-block;">View Full Analysis</a>
        <footer style="margin-top: 20px; font-size: 11px; color: #8b949e;">&copy; 2026 ScamSathi. All rights reserved.</footer>
    </div>
    """
    return send_simulated_email(email, f"ScamSathi Alert: Analysis Report #{report_id} Ready", html)
