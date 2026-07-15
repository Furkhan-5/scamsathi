import os

def transcribe_audio_file(file_content: bytes, filename: str) -> dict:
    """
    Transcribes uploaded voice messages or audio clips.
    Simulates speech-to-text pipelines (e.g. OpenAI Whisper or Indic speech recognition models),
    returning detected text transcripts, source language, and speaker confidence levels.
    """
    filename_lower = filename.lower()
    
    if "bank" in filename_lower or "otp" in filename_lower:
        return {
            "transcript": (
                "Namaste, main ICICI Bank head office se baat kar raha hoon. "
                "Aapke credit card par ek international transaction detect hua hai. "
                "Isko cancel karne ke liye aapke number par ek OTP bheja hai. "
                "Kripya woh OTP mujhe jaldi bataiye taaki transaction cancel kiya ja sake."
            ),
            "language": "hi", # Hindi
            "detected_language": "Hindi (Indian)",
            "confidence": 94
        }
    elif "police" in filename_lower or "customs" in filename_lower:
        return {
            "transcript": (
                "Hello, this is Cyber Cell Delhi police headquarters. "
                "Your Aadhaar number has been linked to a money laundering case. "
                "We are placing you under digital arrest. Do not disconnect this call "
                "and do not inform anyone. Open Skype immediately."
            ),
            "language": "en",
            "detected_language": "English (Indian Accent)",
            "confidence": 98
        }
    elif "invest" in filename_lower or "crypto" in filename_lower:
        return {
            "transcript": (
                "Suno yaar, ek kamaal ka investment scheme mila hai. "
                "Direct IPO allotment hai, double return milega sirf do din mein. "
                "Pehle sirf paanch hazar rupaye transfer karo is UPI id par, "
                "aur sham tak profit account mein."
            ),
            "language": "hi",
            "detected_language": "Hindi (Colloquial)",
            "confidence": 91
        }
    else:
        # Default voice scam fallback
        return {
            "transcript": (
                "Hello beta, main tumhare papa ka dost bol raha hoon. "
                "Unhone mujhe paise transfer karne ke liye bola tha par mera UPI block hai. "
                "Main tumhare number par Rs 10,000 ka screenshot bhej raha hoon, "
                "kripya check karo aur mujhe Rs 5,000 wapas Paytm kar do."
            ),
            "language": "hi",
            "detected_language": "Hindi (Indian)",
            "confidence": 89
        }
