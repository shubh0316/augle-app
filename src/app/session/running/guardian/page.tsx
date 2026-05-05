"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { MoreHorizontal } from "lucide-react";

import cartographerImg from "@/assets/gemini-cartographer.png";
import methodologistImg from "@/assets/chatgpt-methodologist.png";
import contrarianImg from "@/assets/claude-contrarian.png";
import synthesizerImg from "@/assets/synthesizer.png";
import pragmatistImg from "@/assets/grok-pragmatist.png";
import ledgerImg from "@/assets/logo.png";

function AgentImg({ name, size }: { name: string; size: number }) {
  const map: Record<string, Parameters<typeof Image>[0]["src"]> = {
    Cartographer: cartographerImg,
    Methodologist: methodologistImg,
    Contrarian: contrarianImg,
    Synthesizer: synthesizerImg,
    Pragmatist: pragmatistImg,
    Ledger: ledgerImg,
  };
  const src = map[name];
  if (!src) return null;
  return <Image src={src} alt={name} width={size} height={size} className="rounded-full shrink-0" />;
}

/* ─── Guardian spinner ───────────────────────────────────────── */
function GuardianSpinner() {
  return (
    <div className="relative w-8 h-8 shrink-0">
      <svg className="guardian-spin" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="13" stroke="#c15f3c" strokeWidth="1.5" strokeDasharray="4 3" strokeLinecap="round"/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-4 h-4 rounded-full bg-accent opacity-80" />
      </div>
    </div>
  );
}

/* ─── Bottom processing cards ────────────────────────────────── */
const BOTTOM_CARDS = [
  { name: "Cartographer", task: "Evidence Clusters",    model: "Gemini 2.5 Pro",    status: "completed" },
  { name: "Methodologist", task: "Validity Assessment", model: "GPT-4o",             status: "waiting" },
  { name: "Contrarian",    task: "Challenge · Steelman", model: "Claude Sonnet 4.6", status: "waiting" },
  { name: "Synthesizer",   task: "Finding Assembly",    model: "DeepSeek V4",        status: "waiting" },
  { name: "Pragmatist",    task: "Application notes",   model: "Grok 4.1 Fast",      status: "waiting" },
  { name: "Ledger",        task: "Evidence Nodes",      model: "Augle 1.1",          status: "Active" },
];

function BottomProcessingCard({ name, task, model, status }: typeof BOTTOM_CARDS[0]) {
  const isCompleted = status === "completed";
  const isActive = status === "Active";
  return (
    <div className={`relative rounded-xl p-3 flex flex-col gap-1.5 min-w-0 border ${
      isCompleted ? "border-[#58A74A]/40 bg-[rgba(88,167,74,0.06)]"
      : isActive ? "border-accent/40 bg-accent-bg"
      : "border-border-primary/40 bg-bg-secondary/60"
    }`}>
      <div className="flex items-center gap-1.5 min-w-0">
        <div className={`w-2 h-2 rounded-full shrink-0 ${
          isCompleted ? "bg-[#58A74A]" : isActive ? "bg-accent" : "bg-text-disabled/40"
        }`} />
        <span className={`text-[12px] font-semibold truncate ${
          isCompleted ? "text-[#58A74A]" : isActive ? "text-accent" : "text-text-disabled"
        }`}>{name}</span>
      </div>
      <p className="text-text-primary text-[11px] font-medium leading-snug">{task}</p>
      <p className="text-text-secondary text-[11px] leading-snug">{model}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isCompleted ? "bg-[#58A74A]" : isActive ? "bg-accent animate-pulse" : "bg-text-disabled/30"
        }`} />
        <span className={`text-[11px] ${
          isCompleted ? "text-[#58A74A]" : isActive ? "text-accent-hover" : "text-text-disabled"
        }`}>{status}</span>
      </div>
      <div className="absolute bottom-2 right-2">
        <AgentImg name={name} size={22} />
      </div>
    </div>
  );
}

const PHASES = ["Exploration", "Deliberation", "Synthesis", "Conclusion"];

/* ─── Main ───────────────────────────────────────────────────── */
function GuardianContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [activeTab, setActiveTab] = useState(0);
  const [flagged, setFlagged] = useState(true);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[76px] pb-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-[860px]">

          {/* ── Page header ── */}
          <div className="flex items-start justify-between gap-4 mb-4 pt-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-[18px] h-[18px] bg-[#1652f0] rounded-[4px] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 7L3.5 3.5L6 5.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <span className="text-text-secondary text-sm font-medium">Polymarket</span>
              </div>
              <h1 className="font-serif font-bold text-xl text-text-primary leading-snug">{query}</h1>
            </div>

            <div className="flex items-center gap-2 shrink-0 mt-1">
              <div className="flex items-center bg-bg-card border border-border-primary rounded-full p-1 gap-0.5">
                {["Conversation", "Signals"].map((tab, i) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(i)}
                    className={`px-5 py-1.5 rounded-full text-sm font-semibold transition-all ${
                      activeTab === i ? "bg-accent text-white" : "text-text-muted hover:text-text-primary"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <button
                type="button"
                aria-label="More"
                className="w-9 h-9 rounded-full bg-bg-card border border-border-primary flex items-center justify-center hover:bg-bg-input transition-colors"
              >
                <MoreHorizontal size={16} className="text-text-primary" />
              </button>
            </div>
          </div>

          {/* ── Main card ── */}
          <div className="bg-bg-card border border-border-primary rounded-t-[12px] overflow-hidden">

            {/* Guardian bar */}
            <div className="bg-bg-secondary border-b border-border-primary px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GuardianSpinner />
                <div>
                  <p className="font-serif font-bold text-[15px] text-text-primary leading-none">Guardian</p>
                  <p className="text-accent text-[11px] font-medium mt-0.5">Integrity • Bias check</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-accent-bg border border-accent/50 rounded px-3.5 h-[30px] flex items-center gap-1.5">
                  <span className="text-accent text-sm font-medium">Confidence</span>
                  <span className="text-accent text-sm tracking-widest">•••</span>
                </div>
                {/* 1 Flag — orange border when flagged */}
                <div className={`rounded px-3.5 h-[30px] flex items-center border ${
                  flagged ? "border-accent/70 bg-accent-bg" : "border-border-secondary/50"
                }`}>
                  <span className={`text-sm font-medium ${flagged ? "text-accent" : "text-text-disabled"}`}>
                    {flagged ? "1 Flag" : "0 Flags"}
                  </span>
                </div>
                <div className="bg-bg-card border border-border-primary/50 rounded px-3.5 h-[30px] flex items-center">
                  <span className="text-text-disabled text-sm">Session paused</span>
                </div>
              </div>
            </div>

            {/* Messages area */}
            <div className="px-8 py-7 space-y-6 min-h-[420px]">

              {/* Cartographer message — normal */}
              <div className="flex gap-4 animate-fade-in">
                <div className="shrink-0 mt-0.5">
                  <AgentImg name="Cartographer" size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-bold text-[15px] mb-2 agent-name-Cartographer">
                    Cartographer
                  </h3>
                  <div className="text-text-primary text-[14px] leading-relaxed space-y-1">
                    <p>Evidence landscape mapped. Three primary clusters identified:</p>
                    <p>
                      <strong className="font-semibold text-text-primary">Macro indicators</strong>
                      {" "}— GDP growth rate (Q1 2026: +0.4% annualized), yield curve inversion history, manufacturing PMI in contraction for 5 consecutive months, consumer confidence index at 18-month low.
                    </p>
                    <p>
                      <strong className="font-semibold text-text-primary">Labor market signals</strong>
                      {" "}— Unemployment trending to 4.8%, 4-week jobless claims average elevated, hiring freezes reported across tech and financial sectors.
                    </p>
                    <p>
                      <strong className="font-semibold text-text-primary">Policy environment</strong>
                      {" "}— Fed rate trajectory uncertain, fiscal drag from debt ceiling resolution, tariff pass-through adding 0.6–1.1% inflationary pressure on consumer goods.
                    </p>
                  </div>
                </div>
              </div>

              {/* Moderate flag tab */}
              {flagged && (
                <div className="animate-fade-in">
                  <div className="inline-flex items-center gap-1.5 border border-accent/50 rounded-t-[6px] px-3 py-1 bg-bg-card -mb-px relative z-10">
                    <span className="text-accent text-[12px]">🚩</span>
                    <span className="text-accent text-[12px] font-semibold">Moderate flag</span>
                  </div>

                  {/* Flagged Methodologist card */}
                  <div className="border border-accent/50 rounded-b-[10px] rounded-tr-[10px] overflow-hidden bg-bg-card">
                    <div className="px-6 py-5">
                      <div className="flex gap-4">
                        <div className="shrink-0 mt-0.5">
                          <AgentImg name="Methodologist" size={32} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-bold text-[15px] mb-2 agent-name-Methodologist">
                            Methodologist
                          </h3>
                          <p className="text-text-primary text-[14px] leading-relaxed">
                            Research question confirmed. Depth: Standard, 3 phases. Evidence threshold: Moderate. Recession operationalized as two consecutive quarters of negative real GDP growth. Time horizon locked to Q4 2026. No ambiguity flags on intake.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Interject / Ignore */}
                    <div className="px-6 pb-5 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setFlagged(false)}
                        className="px-5 py-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary text-[13px] font-semibold hover:bg-bg-input transition-colors"
                      >
                        Interject
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlagged(false)}
                        className="px-5 py-2 rounded-lg bg-bg-secondary border border-border-primary text-text-primary text-[13px] font-semibold hover:bg-bg-input transition-colors"
                      >
                        Ignore
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Phase tabs ── */}
          <div className="flex w-full overflow-hidden border-x border-b border-border-primary rounded-b-[12px]">
            {PHASES.map((phase, i) => (
              <div
                key={phase}
                className={`flex-1 h-[42px] flex items-center justify-center text-sm font-semibold tracking-tight transition-all ${
                  i === 0
                    ? "bg-accent text-white"
                    : "bg-bg-secondary text-text-disabled border-l border-border-primary/50"
                }`}
              >
                {phase}
              </div>
            ))}
          </div>

          {/* ── Bottom processing strip ── */}
          <div className="bg-bg-card border border-border-primary rounded-[12px] mt-4 p-4">
            <div className="grid grid-cols-6 gap-3">
              {BOTTOM_CARDS.map((card) => (
                <BottomProcessingCard key={card.name} {...card} />
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  );
}

export default function GuardianPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <GuardianContent />
    </Suspense>
  );
}
