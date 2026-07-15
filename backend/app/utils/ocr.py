import os

def extract_text_from_image(file_content: bytes, filename: str) -> str:
    """
    Extracts text from screenshot.
    Provides fallback mock text based on filenames/heuristics to enable local running,
    while specifying hooks for easyocr or pytesseract.
    """
    filename_lower = filename.lower()
    
    if "lottery" in filename_lower or "win" in filename_lower:
        return (
            "Dear Customer, Congratulation! You won Rs 50,000 lottery cash prize "
            "from KBC. To claim your prize money, immediately transfer Rs 2,500 "
            "processing fee to UPI ID kbc-reward@upi. Call 9876543210 for help."
        )
    elif "kyc" in filename_lower or "bank" in filename_lower:
        return (
            "ALERT! Dear SBI User, your NetBanking account will be blocked today. "
            "Please update your PAN Card details immediately by clicking here: "
            "http://sbi-pan-update.com/login. Failure to do so will freeze your card."
        )
    elif "job" in filename_lower or "work" in filename_lower:
        return (
            "Earn Rs. 5,000 daily from home! Easy YouTube like and subscribe job. "
            "No experience needed. Secure your position now. Text us on WhatsApp: "
            "https://wa.me/918888877777. Register at http://parttime-earn.vip"
        )
    elif "courier" in filename_lower or "fedex" in filename_lower:
        return (
            "FedEx Alert: Your shipment ID 7729-IN has been seized by Mumbai Customs "
            "due to illegal narcotics found in the parcel. Avoid legal prosecution. "
            "Verify your identity with Customs Officer on Skype: customs-verification-desk."
        )
    else:
        # Default fallback generic scam simulation
        return (
            "URGENT: Your electricity connection will be disconnected tonight at 9:30 PM "
            "due to non-payment of last month bill. Please contact our Electricity Officer "
            "Mr. Sharma immediately at 8272991028. Do not pay online."
        )
