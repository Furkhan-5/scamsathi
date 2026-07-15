import json
from app.utils.ai import analyze_text_scam, analyze_url_threat

def test_kyc_scam():
    text = "ALERT!SBI net banking block today. Update PAN immediately http://sbi-pan-update.com/login"
    result = analyze_text_scam(text)
    print("Testing KYC scam detection...")
    print(f"Risk Score: {result['risk_score']}%")
    print(f"Detected Category: {result['category']}")
    print(f"Psychological triggers: {result['psychological_triggers']}")
    assert result["risk_score"] > 80
    assert "KYC" in result["category"] or "Bank" in result["category"]
    print("OK - KYC scam check passed.\n")

def test_lottery_scam():
    text = "Congrats! You won Rs 50,000 lottery cash prize from KBC. Pay Rs 2,500 processing fee to claim."
    result = analyze_text_scam(text)
    print("Testing Lottery scam detection...")
    print(f"Risk Score: {result['risk_score']}%")
    print(f"Detected Category: {result['category']}")
    assert result["risk_score"] > 80
    assert "Lottery" in result["category"]
    print("OK - Lottery scam check passed.\n")

def test_url_impersonation():
    url = "http://sbi-pan-update.com/login"
    result = analyze_url_threat(url)
    print("Testing URL typosquatting check...")
    print(f"Risk Score: {result['risk_score']}%")
    print(f"Verdict Category: {result['category']}")
    assert result["risk_score"] > 70
    assert "Phishing" in result["category"]
    print("OK - URL impersonation check passed.\n")

if __name__ == "__main__":
    try:
        test_kyc_scam()
        test_lottery_scam()
        test_url_impersonation()
        print("=== ALL THREAT ENGINE VALIDATION TESTS PASSED ===")
    except AssertionError as e:
        print("Assertion Failed during threat validation tests.")
