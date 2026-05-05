"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import Toggle from "@/components/Toggle";
import AuthModal from "@/components/AuthModal";
import Image from "next/image";
import logo from "@/assets/main-screen.png";

export default function Home() {
  const [modeIdx, setModeIdx] = useState(0);
  const [showAuth, setShowAuth] = useState(false);

  const placeholder =
    modeIdx === 0
      ? "Find a Polymarket or Kalshi contract"
      : "eg. Long-term effects of germline gene editing outweigh its therapeutic benefits.";

  return (
    <>
      <Navbar isLoggedIn={false} />

      <main className="min-h-screen flex flex-col items-center justify-center ">
        {/* Center logo block */}
        <div className="flex flex-col items-center mb-10 animate-fade-in">
          {/* Icon + wordmark row */}
          <div className="flex items-center gap-5">
            <Image src={logo} alt="Augle icon" width={488} height={181} priority />

            
          </div>

        
        </div>

        {/* Search bar */}
        <div
          className="w-full flex justify-center animate-fade-in"
          style={{ animationDelay: "0.15s", opacity: 0 }}
        >
          <SearchBar placeholder={placeholder} />
        </div>
      </main>

      {/* Bottom toggle — fixed */}
      <div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 animate-fade-in"
        style={{ animationDelay: "0.3s", opacity: 0 }}
      >
        <div className="w-[320px]">
          <Toggle
            options={["Prediction Markets", "Letters and Science"]}
            active={modeIdx}
            onChange={setModeIdx}
            variant="pill"
          />
        </div>
      </div>

      {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
    </>
  );
}
