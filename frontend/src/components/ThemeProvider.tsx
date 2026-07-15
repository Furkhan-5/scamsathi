"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Theme = "light" | "dark" | "cyber" | "midnight" | "auto";
type Accent = "blue" | "purple" | "cyan" | "green" | "red";
type Font = "Inter" | "Poppins" | "Manrope" | "Space Grotesk" | "IBM Plex Sans" | "JetBrains Mono";
type Radius = "8px" | "12px" | "16px" | "24px";
type Speed = "0.1s" | "0.3s" | "0.6s";

interface ThemeContextType {
  theme: Theme;
  accent: Accent;
  font: Font;
  radius: Radius;
  speed: Speed;
  setTheme: (t: Theme) => void;
  setAccent: (a: Accent) => void;
  setFont: (f: Font) => void;
  setRadius: (r: Radius) => void;
  setSpeed: (s: Speed) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ACCENT_COLORS = {
  light: {
    blue: "#2563eb",
    purple: "#7c3aed",
    cyan: "#0891b2",
    green: "#059669",
    red: "#dc2626",
  },
  dark: {
    blue: "#3b82f6",
    purple: "#8b5cf6",
    cyan: "#06b6d4",
    green: "#10b981",
    red: "#ef4444",
  },
  cyber: {
    blue: "#00d2ff",
    purple: "#9b51e0",
    cyan: "#00f0ff",
    green: "#39ff14",
    red: "#ff3838",
  },
  midnight: {
    blue: "#6366f1",
    purple: "#a78bfa",
    cyan: "#22d3ee",
    green: "#34d399",
    red: "#f43f5e",
  },
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [accent, setAccentState] = useState<Accent>("blue");
  const [font, setFontState] = useState<Font>("Inter");
  const [radius, setRadiusState] = useState<Radius>("12px");
  const [speed, setSpeedState] = useState<Speed>("0.3s");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Load config from LocalStorage
    const savedTheme = localStorage.getItem("scamsathi-theme") as Theme;
    const savedAccent = localStorage.getItem("scamsathi-accent") as Accent;
    const savedFont = localStorage.getItem("scamsathi-font") as Font;
    const savedRadius = localStorage.getItem("scamsathi-radius") as Radius;
    const savedSpeed = localStorage.getItem("scamsathi-speed") as Speed;

    if (savedTheme) setThemeState(savedTheme);
    if (savedAccent) setAccentState(savedAccent);
    if (savedFont) setFontState(savedFont);
    if (savedRadius) setRadiusState(savedRadius);
    if (savedSpeed) setSpeedState(savedSpeed);
    
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Apply attributes
    let activeTheme = theme;
    if (theme === "auto") {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      activeTheme = systemDark ? "dark" : "light";
    }

    document.documentElement.setAttribute("data-theme", activeTheme);
    
    // Set variables
    const colors = ACCENT_COLORS[activeTheme as keyof typeof ACCENT_COLORS] || ACCENT_COLORS.dark;
    const activeColor = colors[accent] || colors.blue;
    
    document.documentElement.style.setProperty("--primary", activeColor);
    document.documentElement.style.setProperty("--radius", radius);
    document.documentElement.style.setProperty("--font-family", `'${font}', sans-serif`);
    document.documentElement.style.setProperty("--speed", speed);

    // Save
    localStorage.setItem("scamsathi-theme", theme);
    localStorage.setItem("scamsathi-accent", accent);
    localStorage.setItem("scamsathi-font", font);
    localStorage.setItem("scamsathi-radius", radius);
    localStorage.setItem("scamsathi-speed", speed);
  }, [theme, accent, font, radius, speed, mounted]);

  const setTheme = (t: Theme) => setThemeState(t);
  const setAccent = (a: Accent) => setAccentState(a);
  const setFont = (f: Font) => setFontState(f);
  const setRadius = (r: Radius) => setRadiusState(r);
  const setSpeed = (s: Speed) => setSpeedState(s);

  return (
    <ThemeContext.Provider value={{ theme, accent, font, radius, speed, setTheme, setAccent, setFont, setRadius, setSpeed }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeEngine = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeEngine must be used within a ThemeProvider");
  return context;
};
