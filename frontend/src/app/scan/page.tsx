"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/api";
import { 
  FileText, 
  Globe, 
  Image as ImageIcon, 
  Volume2, 
  UploadCloud, 
  Sparkles, 
  Check, 
  ShieldAlert, 
  AlertTriangle,
  FileCode
} from "lucide-react";

type ScanTab = "text" | "url" | "screenshot" | "audio";

export default function ScanPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ScanTab>("text");
  
  // Form values
  const [textContent, setTextContent] = useState("");
  const [urlContent, setUrlContent] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [language, setLanguage] = useState("en");

  // Scanner UI States
  const [scanning, setScanning] = useState(false);
  const [scanSteps, setScanSteps] = useState<string[]>([]);
  const [activeStepIndex, setActiveStepIndex] = useState(-1);

  const startScanAnimation = async (steps: string[], executeScan: () => Promise<any>) => {
    setScanning(true);
    setScanSteps(steps);
    
    // Simulate step progress
    for (let i = 0; i < steps.length; i++) {
      setActiveStepIndex(i);
      await new Promise((r) => setTimeout(r, 600));
    }

    try {
      const data = await executeScan();
      router.push(`/results?id=${data.id}`);
    } catch (err: any) {
      alert(err.message || "Failed to complete AI scanning.");
      setScanning(false);
    }
  };

  const handleTextScan = () => {
    if (!textContent) return;
    const steps = [
      "Connecting to ScamSathi Threat Core...",
      "Extracting linguistic components...",
      "Scanning regional Indian dictionaries (IndicBERT)...",
      "Evaluating psychological triggers (Urgency/Panic)...",
      "Drafting threat rating report..."
    ];

    const runScan = async () => {
      const token = localStorage.getItem("scamsathi-token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/analyze/scan`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          scan_type: "text",
          content: textContent,
          language
        })
      });

      if (!res.ok) throw new Error("Scan request failed");
      return res.json();
    };

    startScanAnimation(steps, runScan);
  };

  const handleUrlScan = () => {
    if (!urlContent) return;
    const steps = [
      "Resolving domain name records...",
      "Detecting typosquatting parameters...",
      "Validating SSL Issuer details...",
      "Checking Safe Browsing listings...",
      "Compiling final threat verdict..."
    ];

    const runScan = async () => {
      const token = localStorage.getItem("scamsathi-token");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/analyze/scan`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          scan_type: "url",
          content: urlContent,
          language: "en"
        })
      });

      if (!res.ok) throw new Error("URL Scan request failed");
      return res.json();
    };

    startScanAnimation(steps, runScan);
  };

  const handleScreenshotScan = () => {
    if (!imageFile) return;
    const steps = [
      "Uploading threat asset image...",
      "Initializing OCR processing core...",
      "Running text segmentation blocks...",
      "Extricating threat vectors (Hinglish/Native)...",
      "Compiling risk report logs..."
    ];

    const runScan = async () => {
      const token = localStorage.getItem("scamsathi-token");
      const fd = new FormData();
      fd.append("file", imageFile);
      fd.append("language", language);

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/analyze/screenshot`, {
        method: "POST",
        headers,
        body: fd
      });

      if (!res.ok) throw new Error("Screenshot OCR failed");
      return res.json();
    };

    startScanAnimation(steps, runScan);
  };

  const handleAudioScan = () => {
    if (!audioFile) return;
    const steps = [
      "Uploading voice record file...",
      "Mapping acoustic spectrum indices...",
      "Triggering speech-to-text transcriber...",
      "Parsing transcripts for advance-fee triggers...",
      "Computing risk logs..."
    ];

    const runScan = async () => {
      const token = localStorage.getItem("scamsathi-token");
      const fd = new FormData();
      fd.append("file", audioFile);

      const headers: Record<string, string> = {};
      if (token) headers["Authorization"] = `Bearer ${token}`;

      const res = await fetch(`${API_URL}/api/analyze/audio`, {
        method: "POST",
        headers,
        body: fd
      });

      if (!res.ok) throw new Error("Audio analysis failed");
      return res.json();
    };

    startScanAnimation(steps, runScan);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {scanning ? (
        /* Progress loader screen */
        <div className="glass-card p-8 border border-border shadow-2xl flex flex-col items-center justify-center text-center space-y-8 animate-fade-in min-h-[400px]">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-t-primary border-r-primary border-b-border border-l-border animate-spin" />
            <Sparkles className="h-6 w-6 text-primary absolute inset-0 m-auto animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold">Scanning Suspicious Content</h3>
            <p className="text-xs text-foreground/60">ScamSathi is dissecting linguistic and network parameters...</p>
          </div>

          <div className="w-full max-w-sm text-left border border-border/60 bg-foreground/3 rounded-custom p-4 space-y-3 font-mono text-xs text-foreground/80">
            {scanSteps.map((step, idx) => {
              const active = idx === activeStepIndex;
              const completed = idx < activeStepIndex;
              return (
                <div key={idx} className="flex items-center space-x-2">
                  <div className="h-4 w-4 shrink-0 flex items-center justify-center">
                    {completed ? (
                      <Check className="h-3.5 w-3.5 text-primary" style={{ strokeWidth: 3 }} />
                    ) : active ? (
                      <div className="h-2 w-2 rounded-full bg-accent animate-ping" />
                    ) : (
                      <div className="h-1.5 w-1.5 rounded-full bg-border" />
                    )}
                  </div>
                  <span className={`${completed ? "text-foreground/50 line-through" : active ? "text-primary font-bold" : "text-foreground/75"}`}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Interactive Scan Input Forms */
        <div className="space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
              ScamSathi Threat Scanner
            </h2>
            <p className="text-sm text-foreground/70 max-w-md mx-auto">
              Select your input vector to run real-time threat explanations.
            </p>
          </div>

          <div className="glass-card border border-border shadow-xl overflow-hidden">
            {/* Tabs Header */}
            <div className="flex bg-foreground/2 border-b border-border text-xs">
              {[
                { id: "text", label: "Message Text", icon: <FileText className="h-4 w-4" /> },
                { id: "url", label: "Website URL", icon: <Globe className="h-4 w-4" /> },
                { id: "screenshot", label: "Screenshot OCR", icon: <ImageIcon className="h-4 w-4" /> },
                { id: "audio", label: "Voice Message", icon: <Volume2 className="h-4 w-4" /> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ScanTab)}
                  className={`flex-1 py-3.5 px-4 font-semibold flex items-center justify-center space-x-2 border-b-2 transition ${
                    activeTab === tab.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-foreground/70 hover:bg-foreground/5"
                  }`}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content Tabs */}
            <div className="p-6">
              
              {/* Text Scan Form */}
              {activeTab === "text" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Message Content</label>
                    <textarea
                      placeholder="Paste your suspicious WhatsApp text, SMS message, or Job offer scripts here..."
                      value={textContent}
                      onChange={(e) => setTextContent(e.target.value)}
                      className="w-full bg-background border border-border rounded-custom p-3 text-xs text-foreground min-h-[140px] outline-none focus:border-primary resize-none"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="space-y-1">
                      <label className="text-xxs font-bold text-foreground/50 uppercase">Expected Language</label>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="bg-background border border-border rounded p-1 text-xs text-foreground cursor-pointer"
                      >
                        <option value="en">English / Hinglish (SMS)</option>
                        <option value="hi">Hindi (Devanagari)</option>
                        <option value="ta">Tamil</option>
                        <option value="te">Telugu</option>
                      </select>
                    </div>

                    <button
                      onClick={handleTextScan}
                      disabled={!textContent}
                      className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-custom hover:opacity-90 transition disabled:opacity-50"
                    >
                      Analyze Text
                    </button>
                  </div>
                </div>
              )}

              {/* URL Scan Form */}
              {activeTab === "url" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-foreground/80">Suspicious Domain / Link</label>
                    <input
                      type="url"
                      placeholder="e.g. http://sbi-pan-update.com/login"
                      value={urlContent}
                      onChange={(e) => setUrlContent(e.target.value)}
                      className="w-full bg-background border border-border rounded-custom p-3 text-xs text-foreground outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleUrlScan}
                      disabled={!urlContent}
                      className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-custom hover:opacity-90 transition disabled:opacity-50"
                    >
                      Inspect Website URL
                    </button>
                  </div>
                </div>
              )}

              {/* Screenshot OCR Form */}
              {activeTab === "screenshot" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border/80 rounded-custom p-8 text-center bg-foreground/2 hover:bg-foreground/4 transition relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <UploadCloud className="h-10 w-10 text-foreground/40" />
                      {imageFile ? (
                        <div className="text-xs">
                          <p className="font-semibold text-primary">Selected: {imageFile.name}</p>
                          <p className="text-xxs text-foreground/50">{(imageFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      ) : (
                        <div className="text-xs text-foreground/60">
                          <p className="font-semibold">Click to upload screenshot</p>
                          <p className="text-xxs">Supports PNG, JPG, or JPEG up to 5MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <p className="text-xxs text-foreground/50">
                      💡 Tip: Try renaming file to contains 'lottery', 'kyc', 'job' or 'courier' to mock specific categories.
                    </p>
                    <button
                      onClick={handleScreenshotScan}
                      disabled={!imageFile}
                      className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-custom hover:opacity-90 transition disabled:opacity-50"
                    >
                      Extract & Scan Image
                    </button>
                  </div>
                </div>
              )}

              {/* Audio Scam Form */}
              {activeTab === "audio" && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-border/80 rounded-custom p-8 text-center bg-foreground/2 hover:bg-foreground/4 transition relative">
                    <input
                      type="file"
                      accept="audio/*"
                      onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center space-y-2">
                      <Volume2 className="h-10 w-10 text-foreground/40" />
                      {audioFile ? (
                        <div className="text-xs">
                          <p className="font-semibold text-primary">Selected: {audioFile.name}</p>
                          <p className="text-xxs text-foreground/50">{(audioFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                      ) : (
                        <div className="text-xs text-foreground/60">
                          <p className="font-semibold">Upload Voice Recording / Call Clip</p>
                          <p className="text-xxs">Supports MP3, WAV, M4A, or OGG up to 10MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {audioFile && (
                    <div className="p-3 bg-foreground/2 border border-border/60 rounded-custom flex items-center justify-between">
                      <span className="text-xxs text-foreground/75 font-semibold">Audio Waveform Matrix:</span>
                      {/* Animated wave bars */}
                      <div className="flex items-center h-8">
                        <div className="waveform-bar" style={{ animationDelay: "0.1s" }} />
                        <div className="waveform-bar" style={{ animationDelay: "0.4s" }} />
                        <div className="waveform-bar" style={{ animationDelay: "0.2s" }} />
                        <div className="waveform-bar" style={{ animationDelay: "0.6s" }} />
                        <div className="waveform-bar" style={{ animationDelay: "0.3s" }} />
                        <div className="waveform-bar" style={{ animationDelay: "0.5s" }} />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <p className="text-xxs text-foreground/50">
                      💡 Tip: Try renaming file to contain 'bank', 'police' or 'invest' to mock specific audio clips.
                    </p>
                    <button
                      onClick={handleAudioScan}
                      disabled={!audioFile}
                      className="px-6 py-2.5 bg-primary text-white text-xs font-bold rounded-custom hover:opacity-90 transition disabled:opacity-50"
                    >
                      Transcribe & Analyze
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
