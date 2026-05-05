"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingScreen from "@/components/LoadingScreen";

import cartographerImg from "@/assets/gemini-cartographer.png";
import methodologistImg from "@/assets/chatgpt-methodologist.png";
import contrarianImg from "@/assets/claude-contrarian.png";
import synthesizerImg from "@/assets/synthesizer.png";
import pragmatistImg from "@/assets/grok-pragmatist.png";
import ledgerImg from "@/assets/logo.png";

/* ─── Agent icon maps ────────────────────────────────────────── */
const AGENT_IMGS: Record<string, { src: Parameters<typeof Image>[0]["src"]; alt: string }> = {
  Cartographer: { src: cartographerImg, alt: "Cartographer" },
  Methodologist: { src: methodologistImg, alt: "Methodologist" },
  Contrarian: { src: contrarianImg, alt: "Contrarian" },
  Synthesizer: { src: synthesizerImg, alt: "Synthesizer" },
  Pragmatist: { src: pragmatistImg, alt: "Pragmatist" },
  Ledger: { src: ledgerImg, alt: "Ledger" },
};

function AgentImg({ name, size }: { name: string; size: number }) {
  const img = AGENT_IMGS[name];
  if (!img) return null;
  return <Image src={img.src} alt={img.alt} width={size} height={size} className="rounded-full shrink-0" />;
}

/* ─── Messages (Conversation tab) ───────────────────────────── */
type Message = { agent: string; parts: (string | { label: string; text: string })[] };

const MESSAGES: Message[] = [
  {
    agent: "Cartographer",
    parts: [
      "Evidence landscape mapped. Three primary clusters identified:",
      { label: "Macro indicators", text: " — GDP growth rate (Q1 2026: +0.4% annualized), yield curve inversion history, manufacturing PMI in contraction for 5 consecutive months, consumer confidence index at 18-month low." },
      { label: "Labor market signals", text: " — Unemployment trending to 4.8%, 4-week jobless claims average elevated, hiring freezes reported across tech and financial sectors." },
      { label: "Policy environment", text: " — Fed rate trajectory uncertain, fiscal drag from debt ceiling resolution, tariff pass-through adding 0.6–1.1% inflationary pressure on consumer goods." },
    ],
  },
  {
    agent: "Methodologist",
    parts: [
      "Research question confirmed. Depth: Standard, 3 phases. Evidence threshold: Moderate. Recession operationalized as two consecutive quarters of negative real GDP growth. Time horizon locked to Q4 2026. No ambiguity flags on intake.",
    ],
  },
  {
    agent: "Contrarian",
    parts: [
      "Recession consensus may be premature. Labor market deterioration historically lags GDP by 2–3 quarters. Services PMI remains above contraction threshold. A Fed pivot before Q3 could sustain the soft-landing scenario.",
    ],
  },
  {
    agent: "Synthesizer",
    parts: [
      "Converging signals align with pre-recessionary patterns in 6 of 8 tracked indicators. Primary conflict: services sector resilience and real wage growth continue supporting household spending. Probability weight trending toward recession.",
    ],
  },
  {
    agent: "Pragmatist",
    parts: [
      "Key inflection points: June Fed decision, Q2 GDP advance estimate (July release), and August tariff impact report. Recommend flagging Q1 GDP revision risk. Current evidence supports a 58–72% recession probability range.",
    ],
  },
];

/* ─── Agent grid cards (Signals tab) ────────────────────────── */
const AGENT_GRID = [
  {
    name: "Cartographer",
    task: "Evidence Clusters",
    model: "Gemini 3.1 Pro",
    status: "Streaming",
    active: true,
    assessing: "Assessing 3 of 4",
    bullets: [
      "Fed minutes - Jan – Mar 2026",
      "Q4 2025 GDP - 1.2% annualized",
      "Labor market - claims +8%",
      "Yield spread - 0.12%",
    ],
  },
  { name: "Methodologist", task: "Validity Assessment", model: "GPT-4o",          status: "Waiting", active: false },
  { name: "Contrarian",    task: "Evidence Challenge · Steelman", model: "Claude Opus 4.7", status: "Waiting", active: false },
  { name: "Synthesizer",   task: "Finding Assembly",  model: "DeepSeek V4",       status: "Waiting", active: false },
  { name: "Pragmatist",    task: "Application Nodes", model: "Grok 4.1 Fast",     status: "Waiting", active: false },
  { name: "Ledger",        task: "Evidence Nodes",    model: "Augle 1.1",         status: "Waiting", active: false },
];

/* ─── Evidence nodes ─────────────────────────────────────────── */
const EVIDENCE_NODES = [
  {
    badge: "Established",
    badgeColor: "#58A74A",
    title: "NBER Lag 6-8 months",
    sub: "Documented",
    subColor: "#58A74A",
    border: "#58A74A",
    bg: "rgba(88,167,74,0.07)",
  },
  {
    badge: "Probable",
    badgeColor: "#4392F1",
    title: "GDP below trend",
    sub: "Not yet contracted",
    subColor: "#4392F1",
    border: "#4392F1",
    bg: "rgba(67,146,241,0.07)",
  },
  {
    badge: "Contested",
    badgeColor: "#D4982A",
    title: "Claims increased",
    sub: "Pending",
    subColor: "#D4982A",
    border: "#D4982A",
    bg: "rgba(212,152,42,0.07)",
  },
  {
    badge: "Gap",
    badgeColor: "#D97858",
    title: "Q1 2026 GDP",
    sub: "Release April 30",
    subColor: "#D97858",
    border: "#D97858",
    bg: "rgba(217,120,88,0.07)",
  },
];

/* ─── Bottom processing strip ────────────────────────────────── */
const BOTTOM_CARDS = [
  { name: "Cartographer", task: "Evidence Clusters",    model: "Gemini 2.5 Pro",    status: "completed" },
  { name: "Methodologist", task: "Validity Assessment", model: "GPT-4o",             status: "waiting" },
  { name: "Contrarian",    task: "Challenge · Steelman", model: "Claude Optus 4.6", status: "waiting" },
  { name: "Synthesizer",   task: "Finding Assembly",    model: "DeepSeek V4",        status: "waiting" },
  { name: "Pragmatist",    task: "Application notes",   model: "Grok 4.1 Fast",      status: "waiting" },
  { name: "Ledger",        task: "Evidence Nodes",      model: "Augle 1.1",          status: "Active" },
];

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

/* ─── Agent grid card ────────────────────────────────────────── */
function AgentGridCard(card: typeof AGENT_GRID[0]) {
  const { name, task, model, status, active, assessing, bullets } = card;
  return (
    <div
      className={`rounded-xl border flex flex-col overflow-hidden transition-all ${
        active
          ? "border-border-primary bg-bg-card"
          : "border-border-primary/40 bg-bg-secondary/60"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary/30">
        <div className="flex items-center gap-2 min-w-0">
          <AgentImg name={name} size={22} />
          <div className="min-w-0">
            <p className={`text-[13px] font-semibold truncate ${active ? "text-text-primary" : "text-text-disabled"}`}>{name}</p>
            <p className={`text-[11px] truncate ${active ? "text-text-secondary" : "text-text-disabled/60"}`}>{task}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-accent animate-pulse" : "bg-text-disabled/40"}`} />
          <span className={`text-[11px] font-medium ${active ? "text-accent" : "text-text-disabled"}`}>{status}</span>
          <span className={`text-[11px] ${active ? "text-text-secondary" : "text-text-disabled/50"}`}>{model}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 py-4">
        {active && bullets ? (
          <>
            <p className="text-[11px] font-bold tracking-wider text-text-secondary uppercase mb-3">{task}</p>
            <ul className="space-y-1.5">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 shrink-0" />
                  <span className="text-text-primary text-[12px] leading-snug">{b}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <>
            <p className="text-[11px] font-bold tracking-wider text-text-disabled/50 uppercase mb-3">{task}</p>
            <div className="space-y-2">
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-4/5" />
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-3/4 mt-4" />
              <Skeleton className="h-2.5 w-full" />
              <Skeleton className="h-2.5 w-2/3" />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-border-primary/20 flex items-center justify-between">
        <span className={`text-[11px] ${active ? "text-text-secondary" : "text-text-disabled/50"}`}>{model}</span>
        {active && assessing && (
          <span className="text-[11px] text-accent font-medium">{assessing}</span>
        )}
      </div>
    </div>
  );
}

/* ─── Bottom processing card ─────────────────────────────────── */
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
          isCompleted ? "bg-[#58A74A]"
          : isActive ? "bg-accent"
          : "bg-text-disabled/40"
        }`} />
        <span className={`text-[12px] font-semibold truncate ${
          isCompleted ? "text-[#58A74A]"
          : isActive ? "text-accent"
          : "text-text-disabled"
        }`}>{name}</span>
      </div>
      <p className="text-text-primary text-[11px] font-medium leading-snug">{task}</p>
      <p className="text-text-secondary text-[11px] leading-snug">{model}</p>
      <div className="flex items-center gap-1 mt-0.5">
        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
          isCompleted ? "bg-[#58A74A]"
          : isActive ? "bg-accent animate-pulse"
          : "bg-text-disabled/30"
        }`} />
        <span className={`text-[11px] ${
          isCompleted ? "text-[#58A74A]"
          : isActive ? "text-accent-hover"
          : "text-text-disabled"
        }`}>{status}</span>
      </div>
      {/* Logo bottom-right */}
      <div className="absolute bottom-2 right-2">
        <AgentImg name={name} size={22} />
      </div>
    </div>
  );
}

/* ─── Phases ─────────────────────────────────────────────────── */
const PHASES = ["Exploration", "Deliberation", "Synthesis", "Conclusion"];

/* ─── Main ───────────────────────────────────────────────────── */
function SessionRunningContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [activeTab, setActiveTab] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t0 = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t0);
  }, []);

  useEffect(() => {
    if (loading) return;
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= MESSAGES.length) clearInterval(id);
    }, 800);
    return () => clearInterval(id);
  }, [loading]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[76px] pb-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-[900px]">

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

          {/* ── Guardian bar (always visible) ── */}
          <div className="bg-bg-card border border-border-primary rounded-t-[12px] overflow-hidden">
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
                <div className="border border-border-secondary/50 rounded px-3.5 h-[30px] flex items-center">
                  <span className="text-text-disabled text-sm">0 Flags</span>
                </div>
                <div className="bg-bg-card border border-border-primary/50 rounded px-3.5 h-[30px] flex items-center">
                  <span className="text-text-disabled text-sm">Session paused</span>
                </div>
              </div>
            </div>

            {/* ── Phase tabs ── */}
            <div className="flex w-full border-b border-border-primary">
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

            {/* ── TAB: Conversation ── */}
            {activeTab === 0 && (
              <div className="px-8 py-7 space-y-8 min-h-[420px]">
                {MESSAGES.slice(0, visibleCount).map((msg) => (
                  <div key={msg.agent} className="animate-fade-in flex gap-4">
                    <div className="shrink-0 mt-0.5">
                      <AgentImg name={msg.agent} size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className={`font-serif font-bold text-[15px] mb-2 agent-name-${msg.agent}`}>
                        {msg.agent}
                      </h3>
                      <div className="text-text-primary text-[14px] leading-relaxed space-y-1">
                        {msg.parts.map((part, j) =>
                          typeof part === "string" ? (
                            <p key={j}>{part}</p>
                          ) : (
                            <p key={j}>
                              <strong className="font-semibold text-text-primary">{part.label}</strong>
                              {part.text}
                            </p>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {visibleCount < MESSAGES.length && (
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-bg-input flex items-center justify-center shrink-0">
                      <div className="flex gap-1">
                        {[0, 1, 2].map((d) => (
                          <div key={d} className={`w-1 h-1 rounded-full bg-text-muted animate-pulse-dot stream-dot-${d + 1}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Signals ── */}
            {activeTab === 1 && (
              <div className="p-5 space-y-5">
                {/* Agent 3×2 grid */}
                <div className="grid grid-cols-3 gap-4">
                  {AGENT_GRID.map((card) => (
                    <AgentGridCard key={card.name} {...card} />
                  ))}
                </div>

                {/* Evidence nodes */}
                <div>
                  <p className="text-text-secondary text-[12px] font-medium mb-3">Evidence nodes – Exploration phase</p>
                  <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                    <div className="grid grid-cols-4 gap-3">
                      {EVIDENCE_NODES.map((node) => (
                        <div
                          key={node.badge}
                          className="rounded-xl p-3 border flex flex-col gap-2"
                          style={{ borderColor: node.border, background: node.bg }}
                        >
                          <span
                            className="text-[11px] font-bold px-2 py-0.5 rounded-full self-start"
                            style={{ color: node.badgeColor, background: `${node.badgeColor}22` }}
                          >
                            {node.badge}
                          </span>
                          <p className="text-text-primary text-[13px] font-semibold leading-snug">{node.title}</p>
                          <div className="flex items-center gap-1.5 mt-auto">
                            <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: node.subColor }} />
                            <span className="text-[11px]" style={{ color: node.subColor }}>{node.sub}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Agent processing strip */}
                <div>
                  <p className="text-text-secondary text-[12px] font-medium mb-3">Agent processing</p>
                  <div className="bg-bg-card border border-border-primary rounded-xl p-4">
                    <div className="grid grid-cols-6 gap-3">
                      {BOTTOM_CARDS.map((card) => (
                        <BottomProcessingCard key={card.name} {...card} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Conversation tab bottom strip ── */}
          {activeTab === 0 && (
            <div className="bg-bg-card border border-border-primary rounded-b-[12px] border-t-0 p-4 mt-0">
              <div className="grid grid-cols-6 gap-3">
                {BOTTOM_CARDS.map((card) => (
                  <BottomProcessingCard key={card.name} {...card} />
                ))}
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  );
}

export default function SessionRunningPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <SessionRunningContent />
    </Suspense>
  );
}
