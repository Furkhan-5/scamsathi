"use client";

import React, { useEffect, useState } from "react";

export const Spotlight: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  if (!isMounted) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Dynamic Cursor Spotlight */}
      <div
        className="hidden md:block absolute h-[400px] w-[400px] rounded-full bg-primary/10 blur-[120px] transition-all duration-75"
        style={{
          left: `${position.x - 200}px`,
          top: `${position.y - 200}px`,
        }}
      />
      
      {/* Floating Blobs */}
      <div className="absolute top-[10%] left-[20%] h-80 w-80 rounded-full bg-primary/5 blur-[90px] animate-glow-slow" />
      <div className="absolute bottom-[20%] right-[10%] h-96 w-96 rounded-full bg-accent/5 blur-[100px] animate-pulse-slow" />
      <div className="absolute top-[40%] right-[30%] h-64 w-64 rounded-full bg-cyber-purple/5 blur-[80px] animate-glow-slow" />
    </div>
  );
};
export default Spotlight;
