"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Send } from "lucide-react";

export const Footer: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-background/30 backdrop-blur-sm transition-colors duration-300 py-12 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-lg">
              <Shield className="h-5 w-5" />
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ScamSathi</span>
            </Link>
            <p className="text-xs text-foreground/60 leading-relaxed max-w-xs">
              Explainable Multimodal AI Platform for detecting digital fraud attempts across Indian vernacular communications.
            </p>
            <div className="text-xs text-foreground/50">
              &copy; 2026 ScamSathi. All rights reserved.
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Platform</h4>
            <ul className="space-y-2 text-xs text-foreground/70">
              <li><Link href="/scan" className="hover:text-primary transition">Instant Scam Scan</Link></li>
              <li><Link href="/dashboard" className="hover:text-primary transition">Scam Activity Map</Link></li>
              <li><Link href="/recommendations" className="hover:text-primary transition">Cyber Hygiene Portal</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-4">Company</h4>
            <ul className="space-y-2 text-xs text-foreground/70">
              <li><Link href="/about" className="hover:text-primary transition">About ScamSathi</Link></li>
              <li><Link href="/about#architecture" className="hover:text-primary transition">AI Architecture</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition">Contact Security Desk</Link></li>
            </ul>
          </div>

          {/* Newsletter subscription */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Awareness Newsletter</h4>
            <p className="text-xs text-foreground/60">
              Receive weekly updates on recent scam trends and cyber safety tips.
            </p>
            {subscribed ? (
              <div className="text-xs text-primary font-semibold">
                ✓ Thank you for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex max-w-sm items-center border border-border bg-foreground/5 rounded-custom p-1">
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-transparent text-xs text-foreground outline-none px-2 flex-grow min-w-0"
                  required
                />
                <button
                  type="submit"
                  className="bg-primary text-white p-1.5 rounded-custom hover:opacity-90 transition"
                  title="Subscribe"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
