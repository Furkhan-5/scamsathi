"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ShieldAlert, 
  Smartphone, 
  Award, 
  Activity, 
  ListRestart, 
  TrendingUp, 
  ChevronRight, 
  FileText, 
  Sparkles,
  Lock,
  RefreshCw,
  BellRing
} from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { API_URL } from "@/utils/api";

export default function DashboardPage() {
  const router = useRouter();
  
  const [isLogged, setIsLogged] = useState(false);
  const [userName, setUserName] = useState("User");
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Cyber hygiene assessment quiz state
  const [quizScore, setQuizScore] = useState(70);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, boolean>>({});

  const quizQuestions = [
    { id: 1, text: "Do you use 2FA on all email and banking accounts?", points: 15 },
    { id: 2, text: "Do you verify strange sender URLs before clicking?", points: 20 },
    { id: 3, text: "Do you refuse to share OTPs over voice calls?", points: 25 },
    { id: 4, text: "Do you regularly check bank alerts for illegal UPI transfers?", points: 20 },
    { id: 5, text: "Do you use unique passwords for separate websites?", points: 20 }
  ];

  const handleQuizAnswer = (qId: number, answer: boolean, points: number) => {
    const updated = { ...quizAnswers, [qId]: answer };
    setQuizAnswers(updated);
    
    // Calculate score
    let score = 0;
    quizQuestions.forEach((q) => {
      if (updated[q.id] === true) {
        score += q.points;
      }
    });
    setQuizScore(score);
  };

  useEffect(() => {
    const token = localStorage.getItem("scamsathi-token");
    const name = localStorage.getItem("scamsathi-user-name");
    
    if (!token) {
      setIsLogged(false);
      setLoading(false);
      return;
    }

    setIsLogged(true);
    setUserName(name || "User");
    fetchHistory(token);
  }, []);

  const fetchHistory = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/analyze/history`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoading(false);
    }
  };

  // Process data for Recharts (Risk score over time)
  const chartData = history.slice(0, 10).reverse().map((r, i) => ({
    name: `Scan ${i + 1}`,
    risk: r.risk_score
  }));

  // Fallback charts if empty
  const fallbackChartData = [
    { name: "Scan 1", risk: 25 },
    { name: "Scan 2", risk: 90 },
    { name: "Scan 3", risk: 12 },
    { name: "Scan 4", risk: 45 },
    { name: "Scan 5", risk: 95 }
  ];

  const recentTrendingScams = [
    { title: "SBI NetBanking Deactivation Lure", language: "Hinglish / SMS", trend: "High (+40% this week)" },
    { title: "KBC Lucky Draw Lottery Advance Fee", language: "Hindi / WhatsApp", trend: "Medium" },
    { title: "FedEx Drug Import Digital Arrest Case", language: "English / Skype Call", trend: "Critical" },
    { title: "YouTube Video Likes Deposit Scheme", language: "Hindi / WhatsApp", trend: "High" }
  ];

  if (!isLogged) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 flex flex-col items-center text-center">
        <div className="p-4 bg-primary/10 rounded-full text-primary mb-6 animate-pulse">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">Dashboard Secured</h2>
        <p className="text-sm sm:text-lg text-foreground/60 max-w-md mb-8">
          Please log in or register to load your personalized cyber analytics, risk trends, and history synchronization.
        </p>
        <div className="flex space-x-4">
          <Link href="/login" className="px-6 py-2.5 bg-primary text-white font-semibold rounded-custom hover:opacity-90 transition">
            Sign In
          </Link>
          <Link href="/register" className="px-6 py-2.5 border border-border bg-foreground/5 font-semibold rounded-custom hover:bg-foreground/10 transition">
            Create Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Welcome banner */}
      <div className="glass-card p-8 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden border border-border">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="h-5 w-5 text-primary animate-spin" style={{ animationDuration: "10s" }} />
        </div>
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-2">Welcome Back, {userName}!</h2>
          <p className="text-xs sm:text-sm text-foreground/60">
            Platform health status: <span className="text-primary font-bold">Operational</span>. No new anomalies detected in your profiles.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link href="/scan" className="px-5 py-2 rounded-custom bg-primary text-white text-xs font-semibold hover:opacity-95 transition">
            Scan Message
          </Link>
          <button 
            onClick={() => {
              setLoading(true);
              const token = localStorage.getItem("scamsathi-token") || "";
              fetchHistory(token);
            }} 
            className="p-2 border border-border rounded-custom text-foreground/75 hover:bg-foreground/5 hover:text-primary transition"
            title="Refresh statistics"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="glass-card p-6 border border-border">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Total Scans Run</span>
              <div className="text-2xl font-bold">{history.length}</div>
            </div>
            <div className="p-2 bg-primary/10 rounded text-primary">
              <Activity className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border border-border">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Critical Threats</span>
              <div className="text-2xl font-bold text-accent">
                {history.filter((r) => r.risk_score > 70).length}
              </div>
            </div>
            <div className="p-2 bg-accent/10 rounded text-accent">
              <ShieldAlert className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 border border-border">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Cyber Hygiene Score</span>
              <div className="text-2xl font-bold text-primary">{quizScore}/100</div>
            </div>
            <div className="p-2 bg-primary/10 rounded text-primary">
              <Award className="h-5 w-5" />
            </div>
          </div>
          <div className="w-full bg-border h-1 rounded-full mt-3 overflow-hidden">
            <div className="bg-primary h-full transition-all duration-300" style={{ width: `${quizScore}%` }} />
          </div>
        </div>

        <div className="glass-card p-6 border border-border">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Vernacular Distribution</span>
              <div className="text-2xl font-bold">
                {new Set(history.map((r) => r.language)).size || 1} Langs
              </div>
            </div>
            <div className="p-2 bg-primary/10 rounded text-primary">
              <Smartphone className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Main charts and lists grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Risk Trend Rechart */}
        <div className="glass-card p-6 border border-border lg:col-span-2">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80 mb-6">Threat Risk Index Over Time</h3>
          <div className="h-64 w-full text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData.length > 0 ? chartData : fallbackChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#21262d" opacity={0.3} />
                <XAxis dataKey="name" stroke="var(--foreground)" opacity={0.6} />
                <YAxis stroke="var(--foreground)" opacity={0.6} />
                <Tooltip 
                  contentStyle={{ 
                    background: "var(--card)", 
                    border: "1px solid var(--border)", 
                    borderRadius: "8px",
                    color: "var(--foreground)"
                  }} 
                />
                <Line type="monotone" dataKey="risk" stroke="var(--primary)" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cyber Hygiene Assessment Calculator */}
        <div className="glass-card p-6 border border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80 mb-4 flex items-center space-x-2">
            <Award className="h-4 w-4 text-primary" />
            <span>Cyber Hygiene Check</span>
          </h3>
          <div className="space-y-4">
            {quizQuestions.map((q) => (
              <div key={q.id} className="text-xs space-y-2 border-b border-border/40 pb-2">
                <p className="text-foreground/80 font-medium">{q.text}</p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleQuizAnswer(q.id, true, q.points)}
                    className={`py-1 px-3 rounded text-xxs font-semibold border transition ${
                      quizAnswers[q.id] === true ? "bg-primary/20 border-primary" : "border-border hover:bg-foreground/5"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => handleQuizAnswer(q.id, false, q.points)}
                    className={`py-1 px-3 rounded text-xxs font-semibold border transition ${
                      quizAnswers[q.id] === false ? "bg-accent/20 border-accent" : "border-border hover:bg-foreground/5"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* History table & Trending scams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Analyses List */}
        <div className="glass-card p-6 border border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80">Recent Analyses</h3>
            <Link href="/scan" className="text-xxs text-primary hover:underline flex items-center">
              <span>Scan new file</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-12 bg-foreground/5 rounded animate-pulse" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10 text-xs text-foreground/50">
              No recent scans run on this account.
            </div>
          ) : (
            <div className="space-y-3 overflow-y-auto max-h-[350px] pr-2">
              {history.map((report) => (
                <div 
                  key={report.id} 
                  onClick={() => router.push(`/results?id=${report.id}`)}
                  className="p-3 bg-foreground/3 border border-border/60 rounded-custom hover:border-primary hover:bg-foreground/5 transition cursor-pointer flex justify-between items-center"
                >
                  <div className="space-y-1 pr-4 min-w-0">
                    <div className="text-xs font-bold truncate text-foreground/90 capitalize">
                      {report.scan_type}: {report.input_data.replace(/\[Screenshot:[^\]]*\]|\[Audio Upload:[^\]]*\]/g, "").trim().slice(0, 50)}...
                    </div>
                    <div className="text-xxs text-foreground/60 flex space-x-2">
                      <span className="capitalize">{report.scan_type}</span>
                      <span>•</span>
                      <span>{report.language}</span>
                      <span>•</span>
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className={`px-2.5 py-1 rounded text-xxs font-bold ${
                    report.risk_score > 70 ? "bg-accent/15 text-accent" : 
                    report.risk_score > 40 ? "bg-yellow-500/10 text-yellow-500" : "bg-primary/10 text-primary"
                  }`}>
                    {report.risk_score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Trending scams cards */}
        <div className="glass-card p-6 border border-border">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <span>Trending Frauds (India Region)</span>
            </h3>
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-accent/10 text-xxs font-semibold text-accent">
              <BellRing className="h-3 w-3 mr-1 animate-swing" />
              Live Alerts
            </span>
          </div>

          <div className="space-y-4">
            {recentTrendingScams.map((scam, i) => (
              <div key={i} className="p-3 bg-foreground/2 border border-border/40 rounded-custom flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-foreground">{scam.title}</p>
                  <p className="text-xxs text-foreground/50 mt-0.5">{scam.language}</p>
                </div>
                <span className={`text-xxs font-semibold ${scam.trend.includes("Critical") ? "text-accent font-bold" : "text-foreground/75"}`}>
                  {scam.trend}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
