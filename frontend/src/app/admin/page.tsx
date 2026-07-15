"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { API_URL } from "@/utils/api";
import { 
  ShieldCheck, 
  Users, 
  FileText, 
  Terminal, 
  MessageSquare, 
  Lock, 
  Cpu, 
  AlertTriangle,
  RefreshCw
} from "lucide-react";

export default function AdminPage() {
  const [isLogged, setIsLogged] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("scamsathi-token");
    if (!token) {
      setIsLogged(false);
      setLoading(false);
      return;
    }
    setIsLogged(true);
    fetchAdminData(token);
  }, []);

  const fetchAdminData = async (token: string) => {
    setLoading(true);
    try {
      // 1. Stats
      const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (statsRes.ok) setStats(await statsRes.json());

      // 2. Logs
      const logsRes = await fetch(`${API_URL}/api/admin/logs`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (logsRes.ok) setLogs(await logsRes.json());

      // 3. Feedbacks
      const feedRes = await fetch(`${API_URL}/api/admin/feedbacks`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (feedRes.ok) setFeedbacks(await feedRes.json());

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    const token = localStorage.getItem("scamsathi-token");
    if (token) fetchAdminData(token);
  };

  if (!isLogged) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 flex flex-col items-center text-center">
        <div className="p-4 bg-accent/10 rounded-full text-accent mb-6 animate-pulse">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">Admin Security Block</h2>
        <p className="text-sm sm:text-lg text-foreground/60 max-w-md mb-8">
          Admin portal requires authentication. Please sign in to fetch dashboard metrics.
        </p>
        <Link href="/login" className="px-6 py-2.5 bg-primary text-white font-semibold rounded-custom hover:opacity-90 transition">
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-2">
            <ShieldCheck className="h-7 w-7 text-primary" />
            <span>ScamSathi Admin Dashboard</span>
          </h2>
          <p className="text-xs text-foreground/60">
            System administration, user metrics, message logs, and feedback loops.
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="p-2 border border-border rounded-custom text-foreground/75 hover:bg-foreground/5 transition flex items-center space-x-2 text-xs"
        >
          <RefreshCw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh Data</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-xs font-mono">Compiling metrics logs...</div>
      ) : (
        <>
          {/* Stats grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="glass-card p-6 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Total Registered Users</p>
                  <p className="text-2xl font-bold mt-1">{stats?.total_users || 0}</p>
                </div>
                <Users className="h-8 w-8 text-primary/40" />
              </div>
            </div>

            <div className="glass-card p-6 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Total Scans Run</p>
                  <p className="text-2xl font-bold mt-1">{stats?.total_reports || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-primary/40" />
              </div>
            </div>

            <div className="glass-card p-6 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Average Risk Score</p>
                  <p className="text-2xl font-bold mt-1 text-accent">{stats?.average_risk || 0}%</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-accent/40" />
              </div>
            </div>

            <div className="glass-card p-6 border border-border">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xxs font-semibold uppercase tracking-wider text-foreground/50">Server Engine Status</p>
                  <p className="text-2xl font-bold mt-1 text-primary">{stats?.system_status || "Online"}</p>
                </div>
                <Cpu className="h-8 w-8 text-primary/40 animate-pulse" />
              </div>
            </div>
          </div>

          {/* Main admin panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* System Logs */}
            <div className="glass-card p-6 border border-border flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center space-x-2 border-b border-border pb-2">
                  <Terminal className="h-4 w-4 text-primary" />
                  <span>Real-time System Action Log</span>
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 font-mono text-xxs leading-normal scrollbar-hide">
                  {logs.map((log) => (
                    <div key={log.id} className="p-2 border border-border/40 bg-foreground/2 rounded flex flex-col space-y-1">
                      <div className="flex justify-between">
                        <span className={`font-bold ${log.level === "WARNING" ? "text-yellow-500" : "text-primary"}`}>
                          [{log.level}]
                        </span>
                        <span className="text-foreground/40">{new Date(log.created_at).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-foreground/80">{log.message}</p>
                      {log.details && <p className="text-foreground/50 text-[10px]">Details: {log.details}</p>}
                    </div>
                  ))}
                  {logs.length === 0 && <div className="text-center py-6 text-foreground/50">No logs returned.</div>}
                </div>
              </div>
            </div>

            {/* Feedbacks Listing */}
            <div className="glass-card p-6 border border-border flex flex-col justify-between">
              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center space-x-2 border-b border-border pb-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  <span>Threat Submissions / feedback</span>
                </h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 text-xs scrollbar-hide">
                  {feedbacks.map((fb) => (
                    <div key={fb.id} className="p-3 border border-border/40 bg-foreground/2 rounded-custom space-y-1">
                      <div className="flex justify-between text-xxs font-bold text-foreground/50">
                        <span>{fb.name} ({fb.email})</span>
                        <span>{new Date(fb.created_at).toLocaleDateString()}</span>
                      </div>
                      <p className="font-bold text-foreground">{fb.subject}</p>
                      <p className="text-foreground/75 leading-relaxed text-xxs">{fb.message}</p>
                    </div>
                  ))}
                  {feedbacks.length === 0 && <div className="text-center py-6 text-foreground/50">No feedback entries found.</div>}
                </div>
              </div>
            </div>

          </div>
        </>
      )}
    </div>
  );
}
