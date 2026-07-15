"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, Sparkles, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOtpMode, setIsOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isForgotMode, setIsForgotMode] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    const resetToken = searchParams.get("reset");
    if (resetToken) {
      setSuccessMsg("Please choose a new password. Enter details below.");
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errData = await res.json();
        let errMsg = "Invalid login credentials.";
        if (errData.detail) {
          if (typeof errData.detail === "string") {
            errMsg = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errMsg = errData.detail.map((err: any) => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join(", ");
          }
        }
        throw new Error(errMsg);
      }

      const data = await res.json();
      localStorage.setItem("scamsathi-token", data.access_token);
      
      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${data.access_token}` }
      });
      
      if (meRes.ok) {
        const meData = await meRes.json();
        localStorage.setItem("scamsathi-user-name", meData.full_name || meData.email);
        localStorage.setItem("scamsathi-user-email", meData.email);
      }

      setSuccessMsg("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("Authenticating via Google...");

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "developer@scamsathi.in", password: "developer123" })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Google authentication failed");
      }

      const data = await res.json();
      localStorage.setItem("scamsathi-token", data.access_token);
      
      const meRes = await fetch(`${API_URL}/api/auth/me`, {
        headers: { "Authorization": `Bearer ${data.access_token}` }
      });
      
      if (meRes.ok) {
        const meData = await meRes.json();
        localStorage.setItem("scamsathi-user-name", meData.full_name || meData.email);
        localStorage.setItem("scamsathi-user-email", meData.email);
      }

      setSuccessMsg("Logged in successfully! Redirecting...");
      setTimeout(() => {
        router.push("/");
      }, 1000);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Google authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp_code: otpCode })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Invalid OTP code");
      }

      setSuccessMsg("Email verified successfully! You can now log in.");
      setIsOtpMode(false);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || "Failed to process request");
      }

      setSuccessMsg("Instructions sent! Check console / server logs for simulated reset link.");
      setIsForgotMode(false);
      
    } catch (err: any) {
      setErrorMsg(err.message || "Request failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass-card p-8 border border-border shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>

        {/* Heading */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="p-3 bg-primary/10 rounded-full text-primary mb-3">
            <Shield className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold">
            {isForgotMode ? "Reset Password" : isOtpMode ? "Verify Email" : "Access ScamSathi"}
          </h2>
          <p className="text-xs text-foreground/60 mt-1">
            {isForgotMode
              ? "We will dispatch recovery instructions"
              : isOtpMode
              ? "Input the 6-digit OTP code sent to your email"
              : "Enter credentials to load your security portal"}
          </p>
        </div>

        {/* Form Notifications */}
        {errorMsg && (
          <div className="flex items-center space-x-2 bg-accent/10 border border-accent/20 text-accent text-xs p-3 rounded mb-4">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="flex items-center space-x-2 bg-primary/10 border border-primary/20 text-primary text-xs p-3 rounded mb-4">
            <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--primary)" }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Forgot Password Form */}
        {isForgotMode && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/75">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground pl-9 outline-none focus:border-primary"
                />
                <Mail className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-custom text-xs font-bold hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center space-x-2"
            >
              <span>{loading ? "Processing..." : "Email Recovery Link"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsForgotMode(false)}
                className="text-xs text-primary hover:underline"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {/* OTP Verification Form */}
        {isOtpMode && (
          <form onSubmit={handleOTPVerify} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/75">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground outline-none"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/75">One-Time Password (OTP)</label>
              <input
                type="text"
                required
                maxLength={6}
                placeholder="123456"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground font-mono text-center tracking-widest outline-none focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-custom text-xs font-bold hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Confirm OTP"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setIsOtpMode(false)}
                className="text-xs text-primary hover:underline"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Standard Login Form */}
        {!isForgotMode && !isOtpMode && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground/75">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground pl-9 outline-none focus:border-primary"
                />
                <Mail className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-semibold text-foreground/75">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotMode(true)}
                  className="text-xxs text-primary hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground pl-9 outline-none focus:border-primary"
                />
                <Lock className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-custom text-xs font-bold hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center space-x-2"
            >
              <span>{loading ? "Authenticating..." : "Sign In"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Google Sign-in Mock */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full border border-border bg-foreground/3 text-foreground py-2 rounded-custom text-xs hover:bg-foreground/5 transition flex items-center justify-center space-x-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.18 4.114-3.414 0-6.19-2.776-6.19-6.19 0-3.414 2.776-6.19 6.19-6.19 1.483 0 2.836.526 3.9 1.4l3.1-3.1C18.835 1.8 15.74 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.72 0 11.24-4.72 11.24-11.24 0-.765-.085-1.5-.24-2.205H12.24z"/>
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="text-center pt-2 flex flex-col space-y-2">
              <span className="text-xxs text-foreground/60">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-bold hover:underline">
                  Create one here
                </Link>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsOtpMode(true);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="text-xxs text-primary hover:underline"
              >
                Verify an existing registration (Enter OTP)
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
