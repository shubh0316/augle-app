"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { Check } from "lucide-react";

const agents = [
  { initial: "C", name: "Cartographer", color: "#22a86f" },
  { initial: "M", name: "Methodologist", color: "#c15f3c" },
  { initial: "CT", name: "Contrarian", color: "#c15f3c" },
  { initial: "S", name: "Synthesizer", color: "#c15f3c" },
  { initial: "P", name: "Pragmatist", color: "#c15f3c" },
  { initial: "G", name: "Guardian", color: "#c15f3c" },
];

const tiers = [
  { name: "Rapid", credits: 1, price: "$0.20", phases: "1 phase - Exploration", agents: "Cartographer + Synthesizer", runtime: "~ 3 min runtime", agentIcons: ["C", "S"], selected: false },
  { name: "Standard", credits: 3, price: "$0.60", phases: "3 phase - full deliberation", agents: "All 6 agents - full ensemble", runtime: "~ 15 min runtime", agentIcons: ["C", "M", "CT", "S", "P", "G"], popular: true, selected: false },
  { name: "Deep", credits: 6, price: "$1.20", phases: "3 phases + async expert", agents: "All 6 agents + domain expert", runtime: "~ 45 min runtime", agentIcons: ["C", "M", "CT", "S", "P", "G"], extra: "+ domain expert", selected: false },
];

function SessionSetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [selectedTier, setSelectedTier] = useState(0);

  const agentColors: Record<string, string> = { C: "#22a86f", M: "#ca8f32", CT: "#8b5cf6", S: "#c15f3c", P: "#3b82f6", G: "#c15f3c" };

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[85px] pb-8 px-4 flex flex-col items-center">
        {/* Search bar */}
        <div className="w-full max-w-[985px] mb-6">
          <SearchBar placeholder="Find a Polymarket or Kalshi contract (eg. Will the US enter recession by Q4 2026?)" compact />
        </div>

        {/* Research question card */}
        <div className="w-full max-w-[985px] bg-bg-card border border-border-primary rounded-[14px] p-8 mb-4 animate-fade-in">
          <p className="text-text-muted text-sm mb-2 tracking-wide">RESEARCH QUESTION</p>
          <h1 className="font-serif font-bold text-xl text-text-primary tracking-tight mb-6">{query}</h1>
          <div className="border-t border-border-primary pt-4 flex flex-wrap items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-[17px] h-[17px] bg-[#1652f0] rounded-[6px] flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white"><path d="M1 7L4 3L7 5L9 1" stroke="white" strokeWidth="1.5" fill="none"/></svg>
              </div>
              <span className="text-text-primary">Polymarket</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-text-primary">Current probability</span>
              <span className="text-warning font-medium">34% YES</span>
            </div>
            <span className="text-text-primary">As of July 4, 2026 | 9:21 AM PST</span>
          </div>
          {/* Confirmation bar */}
          <div className="mt-4 bg-success-bg border border-success/50 rounded px-4 py-3">
            <p className="text-success text-sm font-light">Question confirmed. No ambiguity detected. Evidence threshold set to Standard. No domain flags on intake.</p>
          </div>
        </div>

        {/* Tier selection */}
        <div className="w-full max-w-[985px] grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
          {tiers.map((tier, i) => (
            <button
              key={tier.name}
              onClick={() => setSelectedTier(i)}
              className={`relative bg-bg-card rounded-[14px] p-7 text-left transition-all border ${selectedTier === i ? "border-accent" : "border-[#49443f]"}`}
            >
              {tier.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent rounded-b-[5px] px-4 py-1">
                  <span className="text-text-primary text-xs font-semibold tracking-wide">MOST POPULAR</span>
                </div>
              )}
              {selectedTier === i && (
                <div className="absolute top-4 right-4 w-7 h-7 rounded-full bg-accent flex items-center justify-center">
                  <Check size={16} className="text-white" />
                </div>
              )}
              <h3 className="font-serif text-lg text-white mb-4">{tier.name}</h3>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-text-primary text-[40px] font-medium leading-none">{tier.credits}</span>
                <span className="text-text-secondary text-lg">credit{tier.credits > 1 ? "s" : ""}</span>
              </div>
              <p className="text-[#5c5c59] text-base mb-6">= {tier.price}</p>
              <div className="border-t border-border-input/30 pt-4 space-y-3">
                {[tier.phases, tier.agents, tier.runtime].map((item, j) => (
                  <div key={j} className="flex items-center gap-3">
                    <div className="w-[7px] h-[7px] rounded-full bg-text-secondary/50 shrink-0" />
                    <span className={`text-base ${selectedTier === i ? "text-[#e8e2db]" : "text-text-secondary"}`}>{item}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-1.5 mt-4">
                {tier.agentIcons.map((a) => (
                  <div key={a} className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold" style={{ backgroundColor: agentColors[a] || "#c15f3c", color: "#171613" }}>
                    {a}
                  </div>
                ))}
                {tier.extra && <span className="text-text-secondary text-[11px] font-semibold ml-1">{tier.extra}</span>}
              </div>
            </button>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="w-full max-w-[985px] bg-bg-secondary border border-border-primary rounded-[14px] p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
          <div className="space-y-1.5">
            <p className="text-base font-medium">
              <span className="text-accent">{tiers[selectedTier].credits} credit{tiers[selectedTier].credits > 1 ? "s" : ""}</span>
              <span className="text-text-primary"> reserved for this session</span>
            </p>
            <p className="text-sm">
              <span className="text-accent-hover">{12 - tiers[selectedTier].credits} credits</span>
              <span className="text-text-primary"> remaining after reserved session • 12 total</span>
            </p>
            <p className="text-sm text-text-primary">
              Credits are reserved, not spent. <span className="text-accent-hover cursor-pointer hover:underline">Refund policy</span> applies if the session returns insufficient evidence.
            </p>
          </div>
          <button
            onClick={() => router.push(`/session/running?q=${encodeURIComponent(query)}&tier=${selectedTier}`)}
            className="bg-accent hover:bg-accent-hover transition-colors text-white font-medium text-base px-10 py-3.5 rounded-lg whitespace-nowrap shrink-0"
          >
            Start session
          </button>
        </div>
      </main>
    </>
  );
}

export default function SessionSetupPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>}>
      <SessionSetupContent />
    </Suspense>
  );
}
