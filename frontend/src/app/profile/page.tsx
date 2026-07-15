"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/utils/api";
import { useThemeEngine } from "@/components/ThemeProvider";
import { Shield, User, Mail, Globe, Sparkles, CheckCircle2, Lock } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { theme, accent, font, radius, speed, setTheme, setAccent, setFont, setRadius, setSpeed } = useThemeEngine();

  const [isLogged, setIsLogged] = useState(false);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scamsathi-token");
    if (!token) {
      setIsLogged(false);
      return;
    }
    setIsLogged(true);
    fetchProfile(token);
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEmail(data.email);
        setFullName(data.full_name || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    const token = localStorage.getItem("scamsathi-token");
    if (!token) return;

    try {
      const res = await fetch(`${API_URL}/api/users/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          full_name: fullName,
          preferred_language: "en",
          preferred_theme: theme
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Profile update failed");
      }

      const data = await res.json();
      localStorage.setItem("scamsathi-user-name", data.full_name || data.email);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to save profile.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLogged) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 flex flex-col items-center text-center">
        <div className="p-4 bg-primary/10 rounded-full text-primary mb-6 animate-pulse">
          <Lock className="h-8 w-8" />
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold mb-4">Profile Blocked</h2>
        <p className="text-sm sm:text-lg text-foreground/60 max-w-md mb-8">
          Please log in to edit profile settings.
        </p>
        <button onClick={() => router.push("/login")} className="px-6 py-2.5 bg-primary text-white font-semibold rounded-custom hover:opacity-90 transition">
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-extrabold flex items-center space-x-2">
          <User className="h-7 w-7 text-primary animate-pulse" />
          <span>User Profile & Security</span>
        </h2>
        <p className="text-xs text-foreground/60">
          Edit username, coordinate theme parameters, and configure notification alerts.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Settings Form */}
        <div className="glass-card p-6 border border-border md:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/85 border-b border-border pb-2">Profile Details</h3>
          
          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            {errorMsg && <div className="bg-accent/15 border border-accent/20 text-accent p-2.5 rounded">{errorMsg}</div>}
            {success && <div className="bg-primary/15 border border-primary/20 text-primary p-2.5 rounded flex items-center space-x-1.5"><CheckCircle2 className="h-4 w-4" /><span>Changes saved successfully!</span></div>}

            <div className="space-y-1">
              <label className="font-semibold text-foreground/75">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  disabled
                  value={email}
                  className="w-full bg-foreground/5 border border-border/80 rounded-custom p-2.5 text-foreground/50 pl-9 outline-none cursor-not-allowed"
                />
                <Mail className="h-4 w-4 absolute left-3 top-3 text-foreground/30" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground/75">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Rohan Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-foreground pl-9 outline-none focus:border-primary"
                />
                <User className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-primary text-white font-bold rounded-custom hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Saving Changes..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Quick Theme customizer box */}
        <div className="glass-card p-6 border border-border space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/85 border-b border-border pb-2 flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Style Engine</span>
          </h3>

          <div className="space-y-4 text-xxs font-semibold">
            <div>
              <p className="text-foreground/60 mb-2">Preset Theme</p>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as any)}
                className="w-full bg-background border border-border rounded p-2 text-foreground outline-none"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="cyber">Cyber (Neon)</option>
                <option value="midnight">Midnight</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div>
              <p className="text-foreground/60 mb-2">Typography</p>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value as any)}
                className="w-full bg-background border border-border rounded p-2 text-foreground outline-none"
              >
                {["Inter", "Poppins", "Manrope", "Space Grotesk", "IBM Plex Sans", "JetBrains Mono"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            <div>
              <p className="text-foreground/60 mb-2">Interface Radius</p>
              <select
                value={radius}
                onChange={(e) => setRadius(e.target.value as any)}
                className="w-full bg-background border border-border rounded p-2 text-foreground outline-none"
              >
                <option value="8px">8px (Sharp)</option>
                <option value="12px">12px (Standard)</option>
                <option value="16px">16px (Rounded)</option>
                <option value="24px">24px (Pill)</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
