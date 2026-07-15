"use client";

import React, { useState } from "react";
import { BookOpen, ShieldCheck, HelpCircle, ArrowRight, Star, HeartCrack } from "lucide-react";

export default function RecommendationsPage() {
  const articles = [
    {
      title: "Anatomy of a UPI Refund Scam",
      category: "UPI Security",
      readTime: "4 mins read",
      desc: "Learn why clicking on 'Receive' links inside UPI apps can drain your bank balance and how to spot fraudulent QR codes."
    },
    {
      title: "Recognizing Typosquatted Banking Portals",
      category: "Phishing",
      readTime: "6 mins read",
      desc: "Identify tiny character changes (like sbi-update.com vs sbi.co.in) that indicate a site is built to harvest netbanking passwords."
    },
    {
      title: "What to do during a 'Digital Arrest' Threat",
      category: "Voice Call Frauds",
      readTime: "5 mins read",
      desc: "Cybercriminals pose as CBI or Customs officers on Skype calls. Know your rights and learn standard government call protocols."
    },
    {
      title: "YouTube Video Likes: The Part-Time Job Lure",
      category: "Job Scam",
      readTime: "4 mins read",
      desc: "Understand how scammers offer low cash for liking YouTube videos, then require premium registration fees to access larger deposits."
    }
  ];

  const hygieneGuidelines = [
    { title: "Enable Two-Factor Authentication (2FA)", detail: "Lock all critical banking and communication handles with biometric or authenticator token layers." },
    { title: "Audit Active UPI Permissions", detail: "Remove unfamiliar merchant handles or third-party bindings in GooglePay, PhonePe, or Paytm regularly." },
    { title: "Refuse Skype Verification requests", detail: "Indian enforcement agencies never perform statement recordings or legal detentions over internet video links." },
    { title: "Install Verified Scam Blockers", detail: "Deploy utilities like TRAI's DND registry and Google's spam-blocking filters for text messages." }
  ];

  const [activeArticleIdx, setActiveArticleIdx] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
          Cyber Hygiene Recommendations
        </h2>
        <p className="text-sm text-foreground/60 max-w-md mx-auto">
          Equip yourself with the knowledge to recognize linguistic manipulators and digital trap vectors.
        </p>
      </div>

      {/* Learning Articles */}
      <div className="space-y-6">
        <h3 className="text-lg font-bold flex items-center space-x-2 border-b border-border pb-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <span>Interactive Learning Library</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art, idx) => (
            <div 
              key={idx} 
              onClick={() => setActiveArticleIdx(activeArticleIdx === idx ? null : idx)}
              className="glass-card p-6 border border-border/80 hover:border-primary transition cursor-pointer space-y-3"
            >
              <div className="flex justify-between items-center text-xxs font-bold uppercase tracking-wider text-foreground/50">
                <span>{art.category}</span>
                <span>{art.readTime}</span>
              </div>
              <h4 className="text-base font-bold text-foreground">{art.title}</h4>
              <p className="text-xs text-foreground/75 leading-relaxed">{art.desc}</p>
              
              {activeArticleIdx === idx && (
                <div className="pt-4 border-t border-border/60 text-xxs text-foreground/70 leading-relaxed bg-foreground/2 p-3 rounded-custom space-y-2">
                  <p className="font-bold text-foreground">💡 Key Prevention Rule:</p>
                  {idx === 0 && "Legitimate merchant payouts never require you to enter your UPI PIN. If you are inputting a PIN, you are SENDING money, not receiving it."}
                  {idx === 1 && "Always bookmark official banking URLs. Do not trust search engine sponsored results, which frequently link to clone websites."}
                  {idx === 2 && "Official police calls are conducted in person at physical precincts. Disconnect Skype calls immediately and report caller details to 1930."}
                  {idx === 3 && "If a job requires you to deposit capital to unlock tasks, it is a Ponzi scheme. Legitimate companies pay you; they do not charge you to work."}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hygiene Checklists */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Basic Hygiene Protocols */}
        <div className="glass-card p-6 border border-border lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-foreground/80 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            <span>Essential Cyber Safety Guidelines</span>
          </h3>
          <div className="space-y-4">
            {hygieneGuidelines.map((guideline, i) => (
              <div key={i} className="flex items-start space-x-3 text-xs bg-foreground/2 p-3 rounded-custom border border-border/40">
                <span className="p-1 rounded bg-primary/10 text-primary font-bold">{i + 1}</span>
                <div>
                  <p className="font-bold text-foreground">{guideline.title}</p>
                  <p className="text-foreground/75 text-xxs mt-0.5">{guideline.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Emergency Helplines */}
        <div className="glass-card p-6 border border-accent/40 bg-accent/2 space-y-4 text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-accent flex items-center space-x-2">
            <HeartCrack className="h-4 w-4" />
            <span>Emergency Help Support</span>
          </h3>
          <p className="text-foreground/75 leading-relaxed">
            If you have been defrauded online or shared critical OTP data, act immediately. Time is critical to freeze transfers.
          </p>
          <div className="space-y-3 pt-2">
            <div className="p-3 bg-background border border-border rounded-custom">
              <p className="font-bold text-foreground">National Cybercrime Helpline</p>
              <p className="text-lg font-extrabold text-accent mt-1">Call 1930</p>
              <p className="text-xxs text-foreground/50 mt-0.5">Operational 24/7. Immediate fund-lock requests.</p>
            </div>
            
            <div className="p-3 bg-background border border-border rounded-custom">
              <p className="font-bold text-foreground">Government Portal</p>
              <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold block mt-1">
                cybercrime.gov.in
              </a>
              <p className="text-xxs text-foreground/50 mt-0.5">Submit screenshot details and threat profiles.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
