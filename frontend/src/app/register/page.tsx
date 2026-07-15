"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Shield, Mail, Lock, User, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { API_URL } from "@/utils/api";

export default function RegisterPage() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [passwordStrength, setPasswordStrength] = useState(0); // 0 to 4
  const [strengthLabel, setStrengthLabel] = useState("Weak");
  const [strengthColor, setStrengthColor] = useState("bg-red-500");

  useEffect(() => {
    // Basic password strength logic
    if (!password) {
      setPasswordStrength(0);
      setStrengthLabel("Empty");
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    setPasswordStrength(strength);

    switch (strength) {
      case 1:
        setStrengthLabel("Weak");
        setStrengthColor("bg-red-500");
        break;
      case 2:
        setStrengthLabel("Fair");
        setStrengthColor("bg-orange-500");
        break;
      case 3:
        setStrengthLabel("Good");
        setStrengthColor("bg-blue-500");
        break;
      case 4:
        setStrengthLabel("Strong");
        setStrengthColor("bg-emerald-500");
        break;
      default:
        setStrengthLabel("Weak");
        setStrengthColor("bg-red-500");
    }
  }, [password]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          full_name: fullName
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        let errMsg = "Registration failed. Try again.";
        if (errData.detail) {
          if (typeof errData.detail === "string") {
            errMsg = errData.detail;
          } else if (Array.isArray(errData.detail)) {
            errMsg = errData.detail.map((err: any) => `${err.loc[err.loc.length - 1]}: ${err.msg}`).join(", ");
          }
        }
        throw new Error(errMsg);
      }

      setSuccessMsg("Account created! Verification OTP sent. Redirecting to verify...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);

    } catch (err: any) {
      setErrorMsg(err.message || "Failed to create account.");
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
          <h2 className="text-2xl font-bold">Join ScamSathi</h2>
          <p className="text-xs text-foreground/60 mt-1">
            Build your account to track analyses and boost cyber scores
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
            <svg className="h-4 w-4 shrink-0 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{successMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground/75">Full Name</label>
            <div className="relative">
              <input
                type="text"
                required
                placeholder="Rohan Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground pl-9 outline-none focus:border-primary"
              />
              <User className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
            </div>
          </div>

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
            <label className="text-xs font-semibold text-foreground/75">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-background border border-border rounded-custom p-2.5 text-xs text-foreground pl-9 outline-none focus:border-primary"
              />
              <Lock className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
            </div>

            {/* Strength Meter */}
            {password && (
              <div className="pt-2 space-y-1">
                <div className="flex justify-between text-xxs font-semibold">
                  <span className="text-foreground/50">Strength:</span>
                  <span className="text-foreground/80">{strengthLabel}</span>
                </div>
                <div className="w-full h-1 bg-border rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${strengthColor}`} 
                    style={{ width: `${(passwordStrength / 4) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-2.5 rounded-custom text-xs font-bold hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center space-x-2"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>

          <div className="text-center pt-2">
            <span className="text-xxs text-foreground/60">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-bold hover:underline">
                Sign In
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
