"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import { Check } from "lucide-react";

/* ── agent metadata ─────────────────────────────────────────── */
const AGENTS: Record<string, { name: string; label: string; description: string }> = {
  C:  { name: "Cartographer",  label: "C",  description: "Maps the evidence landscape and identifies key information gaps." },
  M:  { name: "Methodologist", label: "M",  description: "Evaluates evidence quality and sets confidence limits the ensemble must respect." },
  CT: { name: "Contrarian",    label: "CT", description: "Stress-tests consensus views and surfaces overlooked counter-evidence." },
  S:  { name: "Synthesizer",   label: "S",  description: "Integrates outputs from all agents into a coherent final assessment." },
  P:  { name: "Pragmatist",    label: "P",  description: "Grounds the analysis in actionable, real-world constraints." },
  G:  { name: "Guardian",      label: "G",  description: "Monitors for bias, hallucination, and epistemic overreach." },
};

/* ── tier data ──────────────────────────────────────────────── */
const TIERS = [
  {
    name: "Rapid",
    credits: 1,
    price: "$0.20",
    bullets: [
      { text: "1 phase - Exploration" },
      { text: "Cartographer + Synthesizer" },
      { text: "~ 3 min runtime" },
    ],
    agentIcons: ["C", "S"],
  },
  {
    name: "Standard",
    credits: 3,
    price: "$0.60",
    popular: true,
    bullets: [
      { text: "3 phases - full deliberation" },
      { text: "All 6 agents - full ensemble" },
      { text: "~ 15 min runtime" },
    ],
    agentIcons: ["C", "M", "CT", "S", "P", "G"],
  },
  {
    name: "Deep",
    credits: 6,
    price: "$1.20",
    bullets: [
      { text: "3 phases + async expert" },
      { text: "All 6 agents + domain expert" },
      { text: "~ 45 min runtime" },
    ],
    agentIcons: ["C", "M", "CT", "S", "P", "G"],
    extra: "+ domain expert",
  },
];

/* ── credit packs ───────────────────────────────────────────── */
const PACKS = [
  { credits: 10, price: "$2.00", perCredit: "$0.20 / credit" },
  { credits: 30, price: "$5.40", perCredit: "$0.18 / credit", bestValue: true },
  { credits: 50, price: "$8.00", perCredit: "$0.16 / credit" },
];

const TOTAL_CREDITS = 12;

/* ── AgentBubble with tooltip ───────────────────────────────── */
function AgentBubble({ id }: { id: string }) {
  const [show, setShow] = useState(false);
  const agent = AGENTS[id];
  return (
    <div className="relative" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      <div className={`agent-${id} w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 cursor-default`}>
        {agent.label}
      </div>
      {show && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50 w-[200px] bg-bg-secondary border border-border-primary rounded-lg px-3 py-2.5 shadow-xl pointer-events-none">
          <p className="text-[11px] leading-snug text-text-secondary">
            <span className={`font-semibold agent-name-${id}`}>{agent.name}</span>
            {" "}— {agent.description}
          </p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-border-primary" />
        </div>
      )}
    </div>
  );
}

/* ── main page ──────────────────────────────────────────────── */
function SessionSetupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [selectedTier, setSelectedTier] = useState(0);

  const tier = TIERS[selectedTier];
  const remaining = TOTAL_CREDITS - tier.credits;

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[85px] pb-16 px-4 flex flex-col items-center">

        {/* ── Search bar full width ── */}
        <div className="w-full max-w-[985px] mb-6">
          <SearchBar
            placeholder="Find a Polymarket or Kalshi contract (eg. Will the US enter recession by Q4 2026?)"
            fullWidth
          />
        </div>

        {/* ── Research question card ── */}
        <div className="w-full max-w-[985px] bg-bg-card border border-border-primary rounded-[14px] px-8 py-7 mb-4 animate-fade-in">
          <p className="text-text-muted text-[11px] font-semibold tracking-[0.14em] uppercase mb-2">
            Research Question
          </p>
          <h1 className="font-serif font-bold text-[22px] text-text-primary leading-snug mb-5">
            {query}
          </h1>

          <div className="border-t border-border-primary pt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-[18px] h-[18px] bg-[#1652f0] rounded-[5px] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 7L3.5 3.5L6 5.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span className="text-text-primary font-medium">Polymarket</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-text-secondary">Current probability</span>
              <span className="font-semibold text-warning-amber">34% YES</span>
            </div>
            <span className="text-text-secondary">As of July 4, 2026 &nbsp;|&nbsp; 9:21 AM PST</span>
          </div>

          <div className="mt-4 bg-success-bg border border-success/30 rounded-lg px-4 py-3">
            <p className="text-sm font-light leading-relaxed text-confirmed-green">
              Question confirmed. No ambiguity detected. Evidence threshold set to Standard. No domain flags on intake.
            </p>
          </div>
        </div>

        {/* ── Tier cards ── */}
        <div className="w-full max-w-[985px] grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 animate-fade-in">
          {TIERS.map((t, i) => {
            const active = selectedTier === i;
            return (
              <button
                key={t.name}
                type="button"
                onClick={() => setSelectedTier(i)}
                className={`relative bg-bg-card rounded-[14px] p-7 text-left transition-all border focus:outline-none ${
                  active ? "border-accent" : "border-[#3a3632] hover:border-border-primary"
                }`}
              >
                {t.popular && (
                  <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent rounded-b-[6px] px-4 py-[3px] whitespace-nowrap">
                    <span className="text-text-primary text-[10px] font-bold tracking-widest uppercase">
                      Most Popular
                    </span>
                  </div>
                )}

                {active && (
                  <div className="absolute top-4 right-4 w-[26px] h-[26px] rounded-full bg-accent flex items-center justify-center">
                    <Check size={13} className="text-text-primary" strokeWidth={3} />
                  </div>
                )}

                <h3 className={`font-serif text-lg mb-5 ${active ? "text-accent" : "text-text-primary"}`}>
                  {t.name}
                </h3>

                <div className="flex items-baseline gap-1 mb-0.5">
                  <span className="text-text-primary text-[42px] font-medium leading-none">{t.credits}</span>
                  <span className="text-text-secondary text-lg ml-1">credit{t.credits > 1 ? "s" : ""}</span>
                </div>
                <p className="text-text-dim text-sm mb-5">≈ {t.price}</p>

                <div className="border-t border-border-input/30 pt-4 space-y-3">
                  {t.bullets.map((bullet, j) => (
                    <div key={j} className="flex items-start gap-2.5">
                      <div className="w-[6px] h-[6px] rounded-full bg-text-muted/40 mt-[6px] shrink-0" />
                      <span className={`text-sm leading-snug ${active ? "text-text-primary" : "text-text-secondary"}`}>
                        {bullet.text}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Agent bubbles */}
                <div className="flex items-center gap-1.5 mt-5">
                  {t.agentIcons.map((a) => <AgentBubble key={a} id={a} />)}
                  {t.extra && (
                    <span className="text-text-muted text-[11px] font-medium ml-1">{t.extra}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Reserved credits bar ── */}
        <div className="w-full max-w-[985px] bg-bg-card border border-border-primary rounded-[14px] px-8 py-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-4 animate-fade-in">
          <div className="space-y-1">
            <p className="text-base font-medium">
              <span className="text-accent">{tier.credits} credit{tier.credits > 1 ? "s" : ""}</span>
              <span className="text-text-primary"> reserved for this session</span>
            </p>
            <p className="text-sm">
              <span className="text-accent-hover">{remaining} credits</span>
              <span className="text-text-secondary"> remaining after reserved session • {TOTAL_CREDITS} total</span>
            </p>
            <p className="text-sm text-text-secondary">
              Credits are reserved, not spent.{" "}
              <span className="text-accent-hover cursor-pointer hover:underline">Refund policy</span>
              {" "}applies if the session returns insufficient evidence.
            </p>
          </div>
          <button
            type="button"
            onClick={() => router.push(`/session/running?q=${encodeURIComponent(query)}&tier=${selectedTier}`)}
            className="bg-accent hover:bg-accent-hover transition-colors text-text-primary font-semibold text-base px-10 py-3.5 rounded-xl whitespace-nowrap shrink-0"
          >
            Start session
          </button>
        </div>

        {/* ── Current balance ── */}
        <div className="w-full max-w-[985px] bg-bg-card border border-border-primary rounded-[14px] px-8 py-6 mb-4 animate-fade-in">
          <p className="text-text-muted text-[11px] font-semibold tracking-[0.14em] uppercase mb-3">
            Current Balance
          </p>
          <div className="flex items-end justify-between">
            <div className="flex items-baseline gap-2">
              <span className="text-text-primary text-[44px] font-medium leading-none">{TOTAL_CREDITS}</span>
              <span className="text-text-secondary text-xl">credits</span>
            </div>
            <div className="text-right pb-1">
              <p className="text-text-muted text-sm">≈ $2.40 value</p>
              <p className="text-text-secondary text-sm mt-0.5">4 Standard sessions</p>
            </div>
          </div>
        </div>

        {/* ── Credit packs ── */}
        <div className="w-full max-w-[985px] grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-fade-in">
          {PACKS.map((pack) => (
            <div
              key={pack.credits}
              className={`relative bg-bg-card rounded-[14px] px-8 py-8 border flex flex-col items-center text-center ${
                pack.bestValue ? "border-accent" : "border-[#3a3632]"
              }`}
            >
              {pack.bestValue && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 bg-accent rounded-b-[6px] px-4 py-[3px] whitespace-nowrap">
                  <span className="text-text-primary text-[10px] font-bold tracking-widest uppercase">
                    Best Value
                  </span>
                </div>
              )}

              <span className={`text-[52px] font-medium leading-none mb-1 ${pack.bestValue ? "text-accent" : "text-text-primary"}`}>
                {pack.credits}
              </span>
              <p className="text-text-secondary text-base mb-5">credits</p>

              <p className={`text-2xl font-semibold mb-1 ${pack.bestValue ? "text-accent" : "text-text-primary"}`}>
                {pack.price}
              </p>
              <p className="text-text-muted text-sm mb-7">{pack.perCredit}</p>

              <button
                type="button"
                className="w-full bg-accent hover:bg-accent-hover transition-colors text-text-primary font-semibold text-base py-3 rounded-xl"
              >
                Buy
              </button>
            </div>
          ))}
        </div>

        {/* ── Footer ── */}
        <p className="text-text-muted text-sm text-center animate-fade-in">
          Credits never expire. Unused credits carry over indefinitely.
        </p>

      </main>
    </>
  );
}

export default function SessionSetupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <SessionSetupContent />
    </Suspense>
  );
}
