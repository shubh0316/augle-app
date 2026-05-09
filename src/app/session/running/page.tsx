"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import LoadingScreen from "@/components/LoadingScreen";
import Lottie from "lottie-react";
import typingLoader from "@/assets/loader-20.json";
import loader09Animation from "@/assets/loader09.json";

import cartographerImg from "@/assets/gemini-cartographer.png";
import methodologistImg from "@/assets/chatgpt-methodologist.png";
import contrarianImg from "@/assets/claude-contrarian.png";
import synthesizerImg from "@/assets/synthesizer.png";
import pragmatistImg from "@/assets/grok-pragmatist.png";
import ledgerImg from "@/assets/augle-icon.png";
import polymarketImg from "@/assets/polymarket.png";

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
    title: "NBER Lag 6-8 months",
    sub: "Documented",
    cardCls: "border-[#58A74A] bg-[rgba(88,167,74,0.07)]",
    badgeCls: "text-[#58A74A] bg-[rgba(88,167,74,0.34)]",
    dotCls: "bg-[#58A74A]",
    subCls: "text-[#58A74A]",
  },
  {
    badge: "Probable",
    title: "GDP below trend",
    sub: "Not yet contracted",
    cardCls: "border-[#4392F1] bg-[rgba(67,146,241,0.07)]",
    badgeCls: "text-[#4392F1] bg-[rgba(67,146,241,0.14)]",
    dotCls: "bg-[#4392F1]",
    subCls: "text-[#4392F1]",
  },
  {
    badge: "Contested",
    title: "Claims increased",
    sub: "Pending",
    cardCls: "border-[#D4982A] bg-[rgba(212,152,42,0.07)]",
    badgeCls: "text-[#D4982A] bg-[rgba(212,152,42,0.34)]",
    dotCls: "bg-[#D4982A]",
    subCls: "text-[#D4982A]",
  },
  {
    badge: "Gap",
    title: "Q1 2026 GDP",
    sub: "Release April 30",
    cardCls: "border-[#D97858] bg-[rgba(217,120,88,0.07)]",
    badgeCls: "text-[#f68864] bg-[rgba(217,120,88,0.34)]",
    dotCls: "bg-[#D97858]",
    subCls: "text-[#D97858]",
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
  return <Lottie animationData={loader09Animation} loop autoplay style={{ width: 32, height: 32 }} />;
}

/* ─── Agent grid card ────────────────────────────────────────── */
function AgentGridCard(card: typeof AGENT_GRID[0]) {
  const { name, task, model, status, active, assessing, bullets } = card;
  return (
    <div
      className={`rounded-[6px] border flex flex-col overflow-hidden transition-all ${
        active
          ? "border-border-primary bg-bg-card"
          : "border-border-primary/40 bg-bg-secondary"
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2 min-w-0">
          <AgentImg name={name} size={32} />
          <div className="min-w-0">
            <p className={`font-serif text-[14px] font-normal truncate ${active ? "text-text-primary" : "text-text-disabled"}`}>{name}</p>
            <p className={`text-[11px] truncate ${active ? "text-text-secondary" : "text-text-disabled/60"}`}>{task}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-0.5 shrink-0">
          <div className="flex items-center gap-1.5">
            <div className={`w-1.5 h-1.5 rounded-full ${active ? "bg-accent animate-pulse" : "bg-text-disabled/40"}`} />
            <span className={`text-[11px] font-medium ${active ? "text-accent" : "text-text-disabled/60"}`}>{status}</span>
          </div>
          <span className={`text-[11px] ${active ? "text-text-secondary" : "text-text-disabled/50"}`}>{model}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border-primary/30 mx-0" />

      {/* Body */}
      <div className="flex-1 px-4 py-4">
        <p className={`text-[11px] font-semibold tracking-widest uppercase mb-3 ${active ? "text-text-secondary" : "text-text-disabled/40"}`}>{task}</p>
        {active && bullets ? (
          <ul className="space-y-2">
            {bullets.map((b) => (
              <li key={b} className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent mt-[5px] shrink-0" />
                <span className="text-text-primary text-[13px] leading-snug">{b}</span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-2">
            <Skeleton className="h-[18px] w-[187px] rounded-[3px]" />
            <Skeleton className="h-[18px] w-[210px] rounded-[3px]" />
            <Skeleton className="h-[18px] w-[210px] rounded-[3px]" />
          </div>
        )}
      </div>

      {/* Bottom divider + footer */}
      <div className="border-t border-border-primary/30" />
      <div className="px-4 py-2.5 flex items-center justify-between">
        <span className={`text-[13px] ${active ? "text-text-secondary" : "text-text-disabled/40"}`}>{model}</span>
        {active && assessing && (
          <span className="text-[13px] text-accent font-medium">{assessing}</span>
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
                <Image src={polymarketImg} alt="Polymarket" width={18} height={18} className="rounded-[4px] shrink-0" />
                <span className="text-base font-serif" style={{ color: "#F7F6F2" }}>Polymarket</span>
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
                      activeTab === i ? "bg-accent text-text-primary" : "text-text-muted hover:text-text-primary"
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
          <div className="bg-bg-card border border-border-primary rounded-[12px] overflow-hidden">
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
                  <Lottie animationData={typingLoader} loop autoplay style={{ width: 40, height: 20 }} />
                </div>
                <div className="border border-border-secondary/50 rounded px-3.5 h-[30px] flex items-center">
                  <span className="text-text-disabled text-sm">0 Flags</span>
                </div>
                <div className="bg-bg-card border border-border-primary/50 rounded px-3.5 h-[30px] flex items-center">
                  <span className="text-text-disabled text-sm">Session paused</span>
                </div>
              </div>
            </div>

            {/* ── Phase tabs (Signals) — inside Guardian bg ── */}
            {activeTab === 1 && (
              <div className="bg-bg-secondary border-b border-border-primary flex w-full p-4">
                {PHASES.map((phase, i) => (
                  <div
                    key={phase}
                    className={`flex-1 h-[40px] flex items-center justify-center text-sm tracking-tight transition-all ${
                      i === 0
                        ? "bg-accent-bg border border-accent font-semibold text-accent"
                        : "border-t border-r border-b border-border-secondary font-normal text-[#524c48]"
                    }`}
                  >
                    {phase}
                  </div>
                ))}
              </div>
            )}

            {/* ── TAB: Conversation ── */}
            {activeTab === 0 && (
              <div className="px-8 py-7 space-y-8 min-h-[420px]">
                {MESSAGES.slice(0, visibleCount).map((msg) => (
                  <div key={msg.agent} className="animate-fade-in flex gap-4">
                    <div className="shrink-0 flex flex-col items-center">
                      <AgentImg name={msg.agent} size={32} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-serif font-bold text-[15px] mb-2 text-accent flex items-center min-h-[32px]">
                        {msg.agent}
                      </h3>
                      <div className="text-text-primary text-[16px] leading-relaxed space-y-1">
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
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-bg-input flex items-center justify-center shrink-0 overflow-hidden">
                      <AgentImg name={MESSAGES[visibleCount]?.agent ?? ""} size={32} />
                    </div>
                    <Lottie animationData={typingLoader} loop autoplay style={{ width: 32, height: 32 }} />
                  </div>
                )}
              </div>
            )}

            {/* ── TAB: Signals ── */}
            {activeTab === 1 && (
              <div className="p-5">
                <div className="grid grid-cols-3 gap-4">
                  {AGENT_GRID.map((card) => (
                    <AgentGridCard key={card.name} {...card} />
                  ))}
                </div>
              </div>
            )}

            {/* ── Phase tabs — bottom of chat card ── */}
            {activeTab === 0 && (
              <div className="flex w-full border-t border-border-primary">
                {PHASES.map((phase, i) => (
                  <div
                    key={phase}
                    className={`flex-1 h-[42px] flex items-center justify-center text-sm font-semibold tracking-tight transition-all ${
                      i === 0
                        ? "bg-accent text-text-primary rounded-bl-[12px]"
                        : "bg-bg-secondary text-text-disabled border-l border-border-primary/50"
                    }`}
                  >
                    {phase}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Agent processing strip — separate card ── */}
          {activeTab === 0 && (
            <div className="bg-bg-card border border-border-primary rounded-[12px] p-4 mt-3">
              <div className="grid grid-cols-6 gap-3">
                {BOTTOM_CARDS.map((card) => (
                  <BottomProcessingCard key={card.name} {...card} />
                ))}
              </div>
            </div>
          )}

          {/* ── Signals tab: evidence nodes + agent processing ── */}
          {activeTab === 1 && (
            <div className="space-y-3 mt-3">
              {/* Evidence nodes */}
              <div>
                <p className="text-[#6a645e] text-[14px] font-medium mb-2">Evidence nodes - Exploration phase</p>
                <div className="bg-bg-card border border-border-primary rounded-[11px] p-4">
                  <div className="flex gap-12 justify-center">
                    {EVIDENCE_NODES.map((node) => (
                      <div
                        key={node.badge}
                        className={`rounded-[8px] p-4 border flex flex-col gap-2 w-[229px] min-h-[96px] ${node.cardCls}`}
                      >
                        <span className={`text-[11px] font-semibold px-4 py-1 rounded-[8px] self-start ${node.badgeCls}`}>
                          {node.badge}
                        </span>
                        <p className="text-text-primary text-[11px] font-medium leading-snug mt-auto">{node.title}</p>
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${node.dotCls}`} />
                          <span className={`text-[11px] ${node.subCls}`}>{node.sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Agent processing */}
              <div>
                <p className="text-[#6a645e] text-[14px] font-medium mb-2">Agent processing</p>
                <div className="bg-bg-card border border-border-primary rounded-[11px] p-4">
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
