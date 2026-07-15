"use client";

import React from "react";
import { Shield, Cpu, Award, Zap, CodeXml, GitCommit } from "lucide-react";

export default function AboutPage() {
  const values = [
    { icon: <Shield className="h-6 w-6 text-primary" />, title: "Explainability First", desc: "We focus on explaining linguistic tricks and visual evidence, preparing you for future encounters rather than just blacklisting links." },
    { icon: <Cpu className="h-6 w-6 text-accent" />, title: "State-of-the-Art NLP", desc: "Combining IndicBERT language models and custom speech transcription pipelines to resolve multilingual Hinglish messages." },
    { icon: <Zap className="h-6 w-6 text-primary" />, title: "Instant Response", desc: "Analyze suspicious screenshots, texts, or audio files within seconds with clean interactive reports." }
  ];

  const timeline = [
    { year: "Phase 1: Research", task: "Analyzing linguistics profiles of UPI scams, lottery traps, and digital arrest scripts across Indian states." },
    { year: "Phase 2: NLP Mockups", task: "Compiling multilingual dataset token weights and training IndicBERT classifiers against panic markers." },
    { year: "Phase 3: Launch", task: "Deploying ScamSathi Multimodal Core (Text, Screenshots, Voice notes) with direct reporting portals." }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      
      {/* Hero */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <h2 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent inline-block">
          Our Mission & Vision
        </h2>
        <p className="text-sm sm:text-lg text-foreground/70 leading-relaxed">
          Digital connectivity is rising rapidly in India. ScamSathi stands as a shield to explain, educate, and guard regional language users from online predatory traps.
        </p>
      </section>

      {/* Values Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((v, i) => (
          <div key={i} className="glass-card p-6 border border-border flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 bg-foreground/3 rounded-lg inline-block">{v.icon}</div>
              <h3 className="text-base font-bold">{v.title}</h3>
              <p className="text-xs text-foreground/75 leading-relaxed">{v.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Architecture Visualized */}
      <section id="architecture" className="glass-card p-8 border border-border space-y-6">
        <div className="text-center max-w-xl mx-auto mb-8">
          <h3 className="text-xl font-bold flex items-center justify-center space-x-2">
            <CodeXml className="h-5 w-5 text-primary" />
            <span>AI Platform Architecture</span>
          </h3>
          <p className="text-xxs text-foreground/50 mt-1">
            Modular layout supporting hybrid local classifiers & external domain APIs.
          </p>
        </div>

        {/* Text Diagram layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center text-xs font-mono">
          <div className="p-4 bg-foreground/3 border border-border/80 rounded-custom">
            <p className="font-bold text-primary">Input Layer</p>
            <p className="text-xxs text-foreground/60 mt-1">Text strings / Screenshot OCR / WAV audio files</p>
          </div>
          
          <div className="p-4 bg-foreground/3 border border-border/80 rounded-custom">
            <p className="font-bold text-accent">Parsing pipeline</p>
            <p className="text-xxs text-foreground/60 mt-1">Speech Transcription & Image OCR text extractors</p>
          </div>

          <div className="p-4 bg-foreground/3 border border-border/80 rounded-custom">
            <p className="font-bold text-primary">Threat AI Engine</p>
            <p className="text-xxs text-foreground/60 mt-1">IndicBERT + Typosquatting checks + Threat DB</p>
          </div>

          <div className="p-4 bg-foreground/3 border border-border/80 rounded-custom">
            <p className="font-bold text-accent">Explainability Layer</p>
            <p className="text-xxs text-foreground/60 mt-1">Risk Scores, Phrasing Flags, PDF Reports</p>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="space-y-6">
        <h3 className="text-lg font-bold border-b border-border pb-2 flex items-center space-x-2">
          <GitCommit className="h-5 w-5 text-primary" />
          <span>Research & Launch Timeline</span>
        </h3>
        <div className="relative border-l border-border pl-6 space-y-8">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative text-xs">
              <div className="absolute -left-[30px] top-0 h-4.5 w-4.5 rounded-full bg-background border-2 border-primary" />
              <h4 className="font-bold text-primary">{item.year}</h4>
              <p className="text-foreground/75 leading-relaxed mt-1">{item.task}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
