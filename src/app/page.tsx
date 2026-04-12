"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import Toggle from "@/components/Toggle";
import AuthModal from "@/components/AuthModal";

export default function Home() {
  const [modeIdx, setModeIdx] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  const placeholder = modeIdx === 0
    ? "Search for a Polymarket or Kalshi contract"
    : "eg. Long-term effects of germline gene editing outweigh its therapeutic benefits.";

  return (
    <>
      <Navbar isLoggedIn={false} />
      <main className="min-h-screen flex flex-col items-center justify-center px-4 pt-[69px]">
        {/* Logo */}
        <div className="flex flex-col items-center mb-12 animate-fade-in">
          <div className="relative">
            <svg width="488" height="181" viewBox="0 0 488 181" fill="none" className="w-[320px] md:w-[400px] lg:w-[488px] h-auto">
              <circle cx="52" cy="55" r="42" fill="#c15f3c" opacity="0.9"/>
              <path d="M52 12 L80 48 L52 110 L24 48Z" fill="#171613" opacity="0.3"/>
              <circle cx="52" cy="48" r="16" stroke="#171613" strokeWidth="2" fill="none" opacity="0.4"/>
              <text x="115" y="95" fontFamily="Libre Baskerville" fontWeight="700" fontSize="72" fill="#f7f6f2" letterSpacing="-1">Augle</text>
              <text x="390" y="25" fontFamily="IBM Plex Sans" fontWeight="600" fontSize="18" fill="#f7f6f2">BETA</text>
            </svg>
          </div>
          <p className="text-accent font-serif text-lg tracking-wide mt-[-8px]">Augmented deliberation.</p>
        </div>

        {/* Search */}
        <div className="w-full flex justify-center mb-auto animate-fade-in" style={{ animationDelay: "0.15s", opacity: 0 }}>
          <SearchBar placeholder={placeholder} />
        </div>

        {/* Bottom toggle */}
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
          <div className="w-[320px]">
            <Toggle options={["Prediction Markets", "Science and Letters"]} active={modeIdx} onChange={setModeIdx} variant="pill" />
          </div>
        </div>
      </main>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
