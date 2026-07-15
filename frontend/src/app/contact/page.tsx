"use client";

import React, { useState } from "react";
import { API_URL } from "@/utils/api";
import { Mail, Shield, User, MessageSquare, Send, Sparkles, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_URL}/api/users/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "Failed to submit message.");
      }

      setSuccess(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");

    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
      
      {/* Description column */}
      <div className="space-y-6">
        <div className="inline-flex p-3 bg-primary/10 text-primary rounded-full">
          <Shield className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
          Contact Security Desk
        </h2>
        <p className="text-xs sm:text-sm text-foreground/75 leading-relaxed">
          Spotted a new scam layout in your regional communities? Submit details to our Threat Intelligence Desk. 
          We'll analyze the markers and add them to our database.
        </p>

        <div className="space-y-3 text-xs">
          <div className="flex items-center space-x-2 text-foreground/60">
            <Mail className="h-4 w-4 text-primary" />
            <span>threat-intelligence@scamsathi.in</span>
          </div>
          <p className="text-xxs text-foreground/50">
            🔒 Submitted logs are sanitized and strictly secured.
          </p>
        </div>
      </div>

      {/* Form column */}
      <div className="glass-card p-8 border border-border shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>

        {success ? (
          <div className="text-center py-12 space-y-4 animate-fade-in">
            <div className="inline-flex p-4 bg-primary/10 text-primary rounded-full justify-center">
              <CheckCircle2 className="h-8 w-8" style={{ color: "var(--primary)" }} />
            </div>
            <h3 className="text-xl font-bold">Message Dispatched!</h3>
            <p className="text-xs text-foreground/60 leading-relaxed max-w-xs mx-auto">
              Our auto-responder has fired a verification email. ScamSathi engineers will review your report shortly.
            </p>
            <button
              onClick={() => setSuccess(false)}
              className="text-xs text-primary font-bold hover:underline"
            >
              Send another message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {errorMsg && (
              <div className="bg-accent/10 border border-accent/20 text-accent p-2.5 rounded mb-2">
                {errorMsg}
              </div>
            )}
            
            <div className="space-y-1">
              <label className="font-semibold text-foreground/75">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Rahul"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-foreground pl-9 outline-none focus:border-primary"
                />
                <User className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground/75">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="rahul@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-foreground pl-9 outline-none focus:border-primary"
                />
                <Mail className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground/75">Subject</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Suspicious UPI request alert"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-background border border-border rounded-custom p-2.5 text-foreground pl-9 outline-none focus:border-primary"
                />
                <MessageSquare className="h-4 w-4 absolute left-3 top-3 text-foreground/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-foreground/75">Message details</label>
              <textarea
                required
                placeholder="Paste links, scammer contact details or outline details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-background border border-border rounded-custom p-2.5 text-foreground min-h-[100px] outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-2.5 rounded-custom font-bold hover:opacity-90 transition disabled:opacity-50 flex justify-center items-center space-x-2"
            >
              <span>{loading ? "Sending..." : "Submit Message"}</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
