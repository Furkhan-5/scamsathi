"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useThemeEngine } from "./ThemeProvider";
import { Shield, Settings, User, LogOut, Check, ChevronDown } from "lucide-react";

export const Navbar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, accent, font, radius, speed, setTheme, setAccent, setFont, setRadius, setSpeed } = useThemeEngine();
  
  const [isLogged, setIsLogged] = useState(false);
  const [showConfig, setShowConfig] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("scamsathi-token");
    const name = localStorage.getItem("scamsathi-user-name");
    setIsLogged(!!token);
    setUserName(name || "User");
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("scamsathi-token");
    localStorage.removeItem("scamsathi-user-name");
    setIsLogged(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Scan AI", href: "/scan" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Recommendations", href: "/recommendations" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/50 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-primary font-bold text-xl tracking-wider">
            <Shield className="h-6 w-6 animate-pulse" />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">ScamSathi</span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex space-x-6">
            {navLinks.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    active ? "text-primary border-b-2 border-primary" : "text-foreground/75"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Customizer Toggle */}
            <button
              onClick={() => setShowConfig(!showConfig)}
              className="p-2 rounded-full hover:bg-foreground/5 text-foreground/80 hover:text-primary transition-all duration-200"
              title="Theme Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            {isLogged ? (
              <div className="flex items-center space-x-3">
                <Link
                  href="/profile"
                  className="flex items-center space-x-1.5 text-sm font-medium hover:text-primary transition"
                >
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline text-xs">{userName}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-full hover:bg-accent/15 text-accent/80 hover:text-accent transition"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-1.5 text-xs font-semibold rounded-custom bg-primary text-white hover:opacity-90 transition duration-200 shadow-[0_0_15px_rgba(var(--primary),0.3)]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Config Popover */}
      {showConfig && (
        <div className="absolute right-4 top-18 w-80 glass-card p-6 shadow-2xl z-50 border border-border">
          <div className="flex items-center justify-between mb-4 border-b border-border pb-2">
            <h4 className="text-sm font-bold text-foreground">Theme Engine Setup</h4>
            <button onClick={() => setShowConfig(false)} className="text-xs text-foreground/50 hover:text-foreground">Close</button>
          </div>
          
          <div className="space-y-4 text-xs">
            {/* Presets */}
            <div>
              <p className="font-semibold mb-2 text-foreground/80">Active Preset</p>
              <div className="grid grid-cols-2 gap-2">
                {(["light", "dark", "cyber", "midnight", "auto"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`py-1.5 px-3 rounded text-center capitalize border transition ${
                      theme === t ? "border-primary bg-primary/10 font-bold" : "border-border hover:bg-foreground/5 text-foreground/75"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Accents */}
            <div>
              <p className="font-semibold mb-2 text-foreground/80">Accent Color</p>
              <div className="flex space-x-2">
                {(["blue", "purple", "cyan", "green", "red"] as const).map((a) => (
                  <button
                    key={a}
                    onClick={() => setAccent(a)}
                    className="h-6 w-6 rounded-full border border-white/20 transition relative hover:scale-110"
                    style={{
                      backgroundColor:
                        a === "blue" ? "#3b82f6" :
                        a === "purple" ? "#8b5cf6" :
                        a === "cyan" ? "#06b6d4" :
                        a === "green" ? "#10b981" : "#ef4444"
                    }}
                  >
                    {accent === a && <Check className="h-3 w-3 text-white absolute inset-0 m-auto" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Typography Selector */}
            <div>
              <p className="font-semibold mb-2 text-foreground/80">Primary Font</p>
              <select
                value={font}
                onChange={(e) => setFont(e.target.value as any)}
                className="w-full bg-background border border-border rounded p-1.5 text-foreground outline-none cursor-pointer"
              >
                {["Inter", "Poppins", "Manrope", "Space Grotesk", "IBM Plex Sans", "JetBrains Mono"].map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>

            {/* Border Radius */}
            <div>
              <p className="font-semibold mb-2 text-foreground/80">Card Border Radius</p>
              <div className="grid grid-cols-4 gap-1.5">
                {(["8px", "12px", "16px", "24px"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRadius(r)}
                    className={`py-1 rounded border text-center transition ${
                      radius === r ? "border-primary bg-primary/10 font-bold" : "border-border hover:bg-foreground/5 text-foreground/75"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Animation Speed */}
            <div>
              <p className="font-semibold mb-2 text-foreground/80">Animation Speed</p>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { label: "Fast", val: "0.1s" },
                  { label: "Normal", val: "0.3s" },
                  { label: "Cinematic", val: "0.6s" }
                ].map((s) => (
                  <button
                    key={s.val}
                    onClick={() => setSpeed(s.val as any)}
                    className={`py-1 rounded border text-center transition ${
                      speed === s.val ? "border-primary bg-primary/10 font-bold" : "border-border hover:bg-foreground/5 text-foreground/75"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
