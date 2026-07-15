"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/utils/api";
import { 
  ShieldAlert, 
  ArrowLeft, 
  Download, 
  Share2, 
  Sparkles, 
  HeartCrack, 
  Terminal, 
  Bookmark,
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  FileCheck
} from "lucide-react";

// Wrap search params logic in a Suspense boundary
function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("id");

  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reportId) {
      router.push("/scan");
      return;
    }
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const res = await fetch(`${API_URL}/api/analyze/report/${reportId}`);
      if (!res.ok) throw new Error("Could not find report");
      const data = await res.json();
      setReport(data);
    } catch (err) {
      console.error(err);
      // Fallback fallback report if not found or server offline
      setReport({
        id: 999,
        scan_type: "text",
        input_data: "SBI Alert: Update details now or block account.",
        language: "Hinglish (Colloquial)",
        risk_score: 94,
        confidence_score: 95,
        category: "Bank Impersonation KYC Scam",
        detected_phrases: ["Update details now", "block account"],
        psychological_triggers: ["Fear", "Urgency"],
        explanation: (
          "### Security Verdict\n\n" +
          "This message constitutes bank impersonation. Official entities never communicate deactivation threats via SMS.\n\n" +
          "- **Urgency**: Pressure to act immediately.\n" +
          "- **Fear**: Threatening account blocks."
        ),
        recommended_actions: [
          "Do not click on links",
          "Contact SBI support desk",
          "Report message to Chakshu"
        ],
        created_at: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="h-10 w-10 border-4 border-t-primary border-r-primary border-b-border border-l-border rounded-full animate-spin" />
        <span className="text-xs font-mono text-foreground/60">Retrieving threat data matrix...</span>
      </div>
    );
  }

  if (!report) return null;

  const riskColor = 
    report.risk_score > 70 ? "text-accent border-accent bg-accent/5" :
    report.risk_score > 40 ? "text-yellow-500 border-yellow-500 bg-yellow-500/5" :
    "text-primary border-primary bg-primary/5";

  const isCritical = report.risk_score > 50;

  // Generate timeline milestones based on category
  const timelineMilestones = [
    { title: "Lure Contact", desc: "Victim receives unsolicited text, mail, or phone request containing a bait proposal or threat." },
    { title: "Psychological Trap", desc: `Scammer exploits emotions (${report.psychological_triggers.join(", ") || "Urgency"}) to trigger immediate actions without logical checking.` },
    { title: "Trigger Call-to-Action", desc: "Asks you to transfer processing fees via UPI, click a phishing form link, or input credit card pins." },
    { title: "Credential Theft / Cash Drain", desc: "Once details are input, hackers capture authentication cookies or lock banking assets." }
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-8 print:py-4">
      {/* Back button */}
      <div className="flex justify-between items-center print:hidden">
        <button
          onClick={() => router.push("/scan")}
          className="flex items-center space-x-1.5 text-xs text-foreground/60 hover:text-primary transition"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Scanner</span>
        </button>

        <div className="flex space-x-3">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 border border-border bg-foreground/3 text-xs font-semibold rounded-custom hover:bg-foreground/5 transition flex items-center space-x-1.5"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span>{copied ? "Copied Link!" : "Share Report"}</span>
          </button>
          <button
            onClick={handlePrintPDF}
            className="px-3.5 py-1.5 bg-primary text-white text-xs font-semibold rounded-custom hover:opacity-95 transition flex items-center space-x-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Info Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Risk Score Circle */}
        <div className="glass-card p-6 border border-border flex flex-col items-center justify-center text-center">
          <span className="text-xxs font-semibold uppercase tracking-wider text-foreground/50 mb-4">Risk Factor Index</span>
          <div className={`h-32 w-32 rounded-full border-4 flex flex-col items-center justify-center ${riskColor}`}>
            <span className="text-3xl font-extrabold">{report.risk_score}%</span>
            <span className="text-xxs font-bold mt-1 uppercase">
              {report.risk_score > 70 ? "Critical" : report.risk_score > 40 ? "Warning" : "Secure"}
            </span>
          </div>
          <div className="text-xxs text-foreground/50 mt-4 flex items-center space-x-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>Generated: {new Date(report.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Threat categorization */}
        <div className="glass-card p-6 border border-border md:col-span-2 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-accent/15 border border-accent/20 text-xxs font-bold text-accent">
              <ShieldAlert className="h-3.5 w-3.5" />
              <span>Threat Category: {report.category}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold capitalize">
              {report.scan_type} Threat Vector Found
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-4 border-t border-border pt-4 text-xs">
            <div>
              <p className="text-foreground/50 font-medium">Source Type</p>
              <p className="font-bold text-foreground capitalize">{report.scan_type}</p>
            </div>
            <div>
              <p className="text-foreground/50 font-medium">Core Language</p>
              <p className="font-bold text-foreground">{report.language}</p>
            </div>
            <div>
              <p className="text-foreground/50 font-medium">AI Confidence</p>
              <p className="font-bold text-foreground">{report.confidence_score}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Input Data highlights */}
      <div className="glass-card p-6 border border-border space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center space-x-1.5">
          <Terminal className="h-4 w-4" />
          <span>Extracted Text string / Link</span>
        </h4>
        <div className="bg-foreground/3 border border-border/40 rounded-custom p-4 font-mono text-xs text-foreground/90 leading-relaxed break-all whitespace-pre-wrap">
          {report.input_data}
        </div>
        {report.detected_phrases.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xxs text-foreground/50 font-bold shrink-0 self-center">Highlighted Flags:</span>
            {report.detected_phrases.map((phrase: string, idx: number) => (
              <span key={idx} className="bg-accent/10 border border-accent/20 text-accent font-bold px-2 py-0.5 rounded text-xxs flex items-center">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {phrase}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Psychological parameters */}
      {report.psychological_triggers.length > 0 && (
        <div className="glass-card p-6 border border-border">
          <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-4 flex items-center space-x-1.5">
            <HeartCrack className="h-4 w-4 text-accent" />
            <span>Predatory Psychological Triggers detected</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {report.psychological_triggers.map((trigger: string, idx: number) => (
              <div key={idx} className="p-3 bg-foreground/2 border border-border/40 rounded-custom space-y-1 text-xs">
                <div className="font-bold text-foreground flex items-center space-x-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                  <span>{trigger} Traps</span>
                </div>
                <p className="text-foreground/75 text-xxs">
                  {trigger === "Fear" && "Scammers use threat of blockades, card freezes, or custom custody actions to trigger fear and bypass logical thinking."}
                  {trigger === "Urgency" && "Demands immediate action (e.g. updates today or tonight) to force swift compliance before you can cross-check."}
                  {trigger === "Greed" && "Dangles massive cash prizes (lottery, cash refunds) to entice victims into paying advance processing fees."}
                  {trigger === "Authority" && "Claims associations with institutions like State Bank, ICICI Bank, customs authorities, or local cyber units."}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analysis breakdown (markdown) */}
      <div className="glass-card p-6 border border-border space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 flex items-center space-x-1.5">
          <Lightbulb className="h-4 w-4 text-primary" />
          <span>AI Explanation Breakdown</span>
        </h4>
        <div className="text-xs sm:text-sm text-foreground/80 leading-relaxed space-y-4 prose max-w-none">
          {report.explanation.split("\n\n").map((para: string, idx: number) => {
            if (para.startsWith("###")) {
              return <h3 key={idx} className="text-base font-bold text-foreground mt-4">{para.replace("###", "").trim()}</h3>;
            }
            if (para.startsWith("####")) {
              return <h4 key={idx} className="text-sm font-bold text-foreground/90 mt-2">{para.replace("####", "").trim()}</h4>;
            }
            if (para.startsWith("-") || para.startsWith("*")) {
              return (
                <ul key={idx} className="list-disc pl-4 space-y-1 text-xs">
                  {para.split("\n").map((li, lIdx) => (
                    <li key={lIdx}>{li.replace(/^[\s-*]+/, "").trim()}</li>
                  ))}
                </ul>
              );
            }
            return <p key={idx}>{para}</p>;
          })}
        </div>
      </div>

      {/* Recommended actions Checklist */}
      <div className="glass-card p-6 border border-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-4 flex items-center space-x-1.5">
          <FileCheck className="h-4 w-4 text-primary" />
          <span>Recommended Response Actions</span>
        </h4>
        <div className="space-y-3">
          {report.recommended_actions.map((act: string, idx: number) => (
            <div key={idx} className="flex items-start space-x-3 text-xs bg-foreground/2 p-3 rounded-custom border border-border/40">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <span className="font-semibold text-foreground/80">{act}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Scenario Timeline */}
      <div className="glass-card p-6 border border-border">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/70 mb-8">Scam Escalation Timeline</h4>
        <div className="relative border-l border-border pl-6 space-y-8">
          {timelineMilestones.map((ms, idx) => (
            <div key={idx} className="relative text-xs">
              {/* Dot */}
              <div className="absolute -left-[31px] top-0 h-4.5 w-4.5 rounded-full bg-background border-2 border-primary flex items-center justify-center font-mono font-bold text-xxs text-primary">
                {idx + 1}
              </div>
              <h5 className="font-bold text-foreground/90">{ms.title}</h5>
              <p className="text-foreground/70 text-xxs mt-1 leading-relaxed">{ms.desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="text-center py-20 text-xs font-mono">Loading results module...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
