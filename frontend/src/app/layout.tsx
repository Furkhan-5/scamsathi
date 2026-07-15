import "@/styles/globals.css";
import React from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Spotlight from "@/components/UI/Spotlight";

export const metadata = {
  title: "ScamSathi - Explainable Multimodal AI Platform for Digital Scam Detection",
  description: "Detect and explain phishing, UPI scams, fake job offers, and voice message frauds in Indian languages.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="cyber-grid relative overflow-x-hidden min-h-screen flex flex-col">
        <ThemeProvider>
          <Spotlight />
          <Navbar />
          <main className="flex-grow z-10 relative">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
