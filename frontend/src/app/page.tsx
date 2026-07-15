"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldAlert, 
  MessageSquareWarning, 
  Smartphone, 
  Volume2, 
  Globe, 
  ArrowRight, 
  Sparkles, 
  Search, 
  HelpCircle,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  HelpCircle as QuestionIcon
} from "lucide-react";

export default function LandingPage() {
  const [user, setUser] = useState<{name: string, email: string} | null>(null);
  const [typedText, setTypedText] = useState("");
  const [scamIndex, setScamIndex] = useState(0);
  const scamScenarios = [
    "SBI Alert: Update PAN card to prevent deactivation...",
    "KBC: Congratulations! You won Rs 50,000 cash reward...",
    "FedEx Seizure: Narcotics found in your package. Connect to Skype...",
    "Work from home: Earn Rs. 5,000 daily. Open WhatsApp..."
  ];

  useEffect(() => {
    const token = localStorage.getItem("scamsathi-token");
    const name = localStorage.getItem("scamsathi-user-name");
    const email = localStorage.getItem("scamsathi-user-email");
    if (token) {
      setUser({ name: name || "User", email: email || "" });
    }
  }, []);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const activeText = scamScenarios[scamIndex];
    let currentChar = 0;
    
    const type = () => {
      if (currentChar <= activeText.length) {
        setTypedText(activeText.slice(0, currentChar));
        currentChar++;
        timer = setTimeout(type, 80);
      } else {
        // Wait, then cycle to next scenario
        timer = setTimeout(() => {
          setScamIndex((prev) => (prev + 1) % scamScenarios.length);
        }, 2000);
      }
    };
    
    type();
    return () => clearTimeout(timer);
  }, [scamIndex]);

  const stats = [
    { label: "Scams Reported Daily in India", value: "85,000+" },
    { label: "ScamSathi Detection Accuracy", value: "98.4%" },
    { label: "Vernacular Languages Covered", value: "11+" },
    { label: "Total Threat Patterns Logged", value: "240k+" }
  ];

  const features = [
    {
      icon: <MessageSquareWarning className="h-6 w-6 text-primary" />,
      title: "Explainable Scam Triggers",
      desc: "We don't just tag threats. We explain what words, links, and tone cues are being utilized to manipulate you."
    },
    {
      icon: <Smartphone className="h-6 w-6 text-accent" />,
      title: "Multimodal Inputs",
      desc: "Paste suspicious texts, submit screenshots of chats, or upload audio/voice clips directly."
    },
    {
      icon: <Globe className="h-6 w-6 text-primary" />,
      title: "Vernacular & Hinglish Analysis",
      desc: "Tailored to Indian digital ecosystems, analyzing Devanagari Hindi, Hinglish, Tamil, Telugu, Marathi, and more."
    },
    {
      icon: <Sparkles className="h-6 w-6 text-accent" />,
      title: "Psychological Mapping",
      desc: "Detects emotional triggers used by scammers, such as urgency, authority threat, greed, and panic."
    }
  ];

  const languages = [
    { name: "Hindi (हिंदी)", type: "Native & Hinglish Script" },
    { name: "English (Indian)", type: "Standard Communications" },
    { name: "Tamil (தமிழ்)", type: "Vernacular Text/Audio" },
    { name: "Telugu (తెలుగు)", type: "Vernacular Text/Audio" },
    { name: "Marathi (मराठी)", type: "Vernacular Text/Audio" },
    { name: "Bengali (বাংলা)", type: "Vernacular Text/Audio" },
    { name: "Kannada (ಕನ್ನಡ)", type: "Vernacular Text/Audio" }
  ];

  const faqItems = [
    {
      q: "How does ScamSathi explain why a message is a scam?",
      a: "Our AI breaks down messages into linguistic patterns (e.g. advance-fee hooks), technical signals (unverified shortened URLs), and psychological traps (inducing fear or false urgency). The resulting report details precisely which triggers indicate fraud."
    },
    {
      q: "Can ScamSathi detect voice message scams?",
      a: "Yes! ScamSathi supports uploading voice clips (MP3/WAV). It transcribes the speech to text, detects the regional language or accent, and screens it for fraud patterns (like fake bank officer OTP calls or custom seizure traps)."
    },
    {
      q: "Is my personal data safe when running scans?",
      a: "Absolutely. We sanitize all input files and do not log private credentials or user details. The reports generated are completely secure and shareable only at your discretion."
    },
    {
      q: "Where do you check suspicious domains?",
      a: "We inspect domains against multiple parameters: brand typosquatting rules, domain registration age via WHOIS data, SSL parameters, and blacklist databases (like Google Safe Browsing and VirusTotal)."
    }
  ];

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8">
      {/* Hero Section */}
      <section className="w-full max-w-7xl mx-auto text-center py-16 md:py-24 flex flex-col items-center">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-6 animate-bounce">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Multimodal Vernacular Fraud Detector</span>
        </div>
        
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl mb-6 leading-tight">
          Detect Scam Messages. <br className="hidden sm:inline" />
          Understand <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Why They Are Scams</span>.
        </h1>
        
        <p className="text-sm sm:text-lg text-foreground/70 max-w-2xl mb-10">
          India's first explainable AI platform analyzing screenshots, voice clips, URLs, and texts in local regional scripts. Protect yourself from UPI, KYC, and courier traps.
        </p>

        {/* Dynamic Scan Typer Input Preview */}
        <div className="w-full max-w-xl glass-card p-4 flex items-center space-x-3 mb-10 shadow-lg border border-border">
          <div className="p-2 rounded bg-accent/10 text-accent">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex-grow text-left text-xs sm:text-sm font-mono text-foreground/80 overflow-hidden whitespace-nowrap border-r-2 border-primary pr-2">
            {typedText}
          </div>
          <Link href="/scan" className="p-2.5 rounded bg-primary text-white hover:opacity-90 transition">
            <Search className="h-4 w-4" />
          </Link>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/scan" className="px-8 py-3 font-semibold rounded-custom bg-primary text-white hover:opacity-95 transition flex items-center space-x-2">
            <span>Run Instant Scan</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/about" className="px-8 py-3 font-semibold rounded-custom border border-border bg-foreground/5 hover:bg-foreground/10 transition">
            How It Works
          </Link>
        </div>
      </section>

      {/* Logged in Profile Section */}
      {user && (
        <section className="w-full max-w-xl mx-auto mb-16 animate-fade-in">
          <div className="glass-card p-6 border border-primary/30 shadow-xl relative overflow-hidden flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="absolute top-0 right-0 p-3">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
            </div>
            
            <div className="p-4 bg-primary/10 rounded-full text-primary shrink-0">
              <UserCheck className="h-8 w-8" style={{ color: "var(--primary)" }} />
            </div>
            
            <div className="text-center sm:text-left space-y-1.5 flex-grow">
              <span className="text-xxs font-bold uppercase tracking-wider text-primary">Logged in Secure Profile</span>
              <h3 className="text-lg font-extrabold text-foreground">{user.name}</h3>
              <p className="text-xs text-foreground/60">{user.email}</p>
              
              <div className="pt-2 flex flex-wrap gap-2 justify-center sm:justify-start">
                <Link href="/dashboard" className="px-3 py-1 bg-primary/80 border border-primary text-white text-xxs font-bold rounded-custom hover:bg-primary transition">
                  Go to Dashboard
                </Link>
                <Link href="/profile" className="px-3 py-1 border border-border bg-foreground/3 text-foreground text-xxs font-bold rounded-custom hover:bg-foreground/5 transition">
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats Section */}
      <section className="w-full max-w-7xl mx-auto py-12 border-y border-border bg-foreground/2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="p-4">
              <div className="text-3xl font-extrabold text-primary mb-2">{stat.value}</div>
              <div className="text-xs text-foreground/60">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full max-w-7xl mx-auto py-20">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">Securing You Against Modern Cyber Frauds</h2>
          <p className="text-xs sm:text-sm text-foreground/60 max-w-xl mx-auto">
            Traditional tools only block threats. ScamSathi educates you with linguistic and visual markers so you can notice traps instantly.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feat, i) => (
            <div key={i} className="glass-card p-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-foreground/5 inline-block">{feat.icon}</div>
                <h3 className="text-base font-bold">{feat.title}</h3>
                <p className="text-xs text-foreground/75 leading-relaxed">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Workflow Section */}
      <section className="w-full max-w-5xl mx-auto py-16 bg-primary/5 rounded-custom border border-border p-8 text-center">
        <h3 className="text-xl sm:text-2xl font-bold mb-8">AI Analysis Workflow</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="space-y-2">
            <div className="text-primary font-mono font-bold text-lg">01. Inputs Extraction</div>
            <p className="text-xs text-foreground/75 leading-relaxed">
              We extract text strings directly, use OCR for image texts, or transcribe voice notes into readable transcripts.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-accent font-mono font-bold text-lg">02. Explainable AI Scanning</div>
            <p className="text-xs text-foreground/75 leading-relaxed">
              Our heuristics model isolates key danger phrases, tests URLs for typosquatting, and scans text for manipulation traits.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-primary font-mono font-bold text-lg">03. Verification & Advice</div>
            <p className="text-xs text-foreground/75 leading-relaxed">
              Generate visual report detailing risk indices, explaining threat strategies, and detailing safe emergency contact lines.
            </p>
          </div>
        </div>
      </section>

      {/* Languages & Scams */}
      <section className="w-full max-w-7xl mx-auto py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Languages Table */}
        <div className="glass-card p-6 border border-border">
          <h3 className="text-lg font-bold mb-4 flex items-center space-x-2 text-primary">
            <Globe className="h-5 w-5" />
            <span>Supported Vernacular Languages</span>
          </h3>
          <div className="divide-y divide-border">
            {languages.map((lang, idx) => (
              <div key={idx} className="flex justify-between py-3 text-xs">
                <span className="font-semibold">{lang.name}</span>
                <span className="text-foreground/60">{lang.type}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Threat Coverage */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold mb-2">Scam Vectors Covered</h3>
          <p className="text-xs text-foreground/60">
            We actively monitor recent regional cyber crimes in India to construct heuristics templates against the following scam families:
          </p>
          <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
            {[
              "KYC / Account Block Warnings",
              "Electricity Disconnection panic",
              "Advance Fee Rewards (KBC)",
              "Digital Arrests & Skype Scams",
              "Video Like Part-time Jobs",
              "Customs Parcel Seizures",
              "Ponzi Scheme Investment Pools",
              "UPI Refund Redirection traps"
            ].map((scam, i) => (
              <div key={i} className="flex items-center space-x-2 p-3 bg-foreground/5 rounded-custom border border-border/60">
                <ShieldAlert className="h-4 w-4 text-accent" />
                <span>{scam}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="w-full max-w-4xl mx-auto py-16">
        <h3 className="text-xl sm:text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <div key={index} className="border border-border rounded-custom overflow-hidden">
              <button
                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                className="w-full text-left p-4 bg-foreground/2 hover:bg-foreground/5 font-semibold text-xs sm:text-sm flex justify-between items-center text-foreground transition"
              >
                <span>{item.q}</span>
                <QuestionIcon className={`h-4 w-4 transition-transform duration-200 ${activeFaq === index ? "rotate-180" : ""}`} />
              </button>
              {activeFaq === index && (
                <div className="p-4 bg-background text-xs text-foreground/75 leading-relaxed border-t border-border">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
