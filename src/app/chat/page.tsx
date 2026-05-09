"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, ChevronRight, SlidersHorizontal, AlertTriangle, Check, TrendingUp, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Lottie from "lottie-react";
import loader09Animation from "@/assets/loader09.json";
import typingLoader from "@/assets/loader-20.json";

import cartographerImg from "@/assets/gemini-cartographer.png";
import methodologistImg from "@/assets/chatgpt-methodologist.png";
import contrarianImg from "@/assets/claude-contrarian.png";
import synthesizerImg from "@/assets/synthesizer.png";
import pragmatistImg from "@/assets/grok-pragmatist.png";
import ledgerImg from "@/assets/augle-icon.png";

const ACCENT = "#c15f3c";

/* ── Agent image map ─────────────────────────────────────────── */
const AGENT_IMGS: Record<string, Parameters<typeof Image>[0]["src"]> = {
  Cartographer: cartographerImg,
  Methodologist: methodologistImg,
  Contrarian: contrarianImg,
  Synthesizer: synthesizerImg,
  Pragmatist: pragmatistImg,
  Ledger: ledgerImg,
};

function AgentImg({ name, size = 28 }: { name: string; size?: number }) {
  const src = AGENT_IMGS[name];
  if (!src) return null;
  return <Image src={src} alt={name} width={size} height={size} className="rounded-full shrink-0" style={{ width: size, height: size, objectFit: "cover" }} />;
}

/* ── Guardian spinner ────────────────────────────────────────── */
function GuardianSpinner() {
  return <Lottie animationData={loader09Animation} loop autoplay style={{ width: 32, height: 32 }} />;
}

/* ── Messages (Conversation tab) ─────────────────────────────── */
type MessagePart = string | { label: string; text: string };
type Message = { agent: string; parts: MessagePart[] };

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
    parts: ["Research question confirmed. Depth: Standard, 3 phases. Evidence threshold: Moderate. Recession operationalized as two consecutive quarters of negative real GDP growth. Time horizon locked to Q4 2026. No ambiguity flags on intake."],
  },
  {
    agent: "Contrarian",
    parts: ["Recession consensus may be premature. Labor market deterioration historically lags GDP by 2–3 quarters. Services PMI remains above contraction threshold. A Fed pivot before Q3 could sustain the soft-landing scenario."],
  },
  {
    agent: "Synthesizer",
    parts: ["Converging signals align with pre-recessionary patterns in 6 of 8 tracked indicators. Primary conflict: services sector resilience and real wage growth continue supporting household spending. Probability weight trending toward recession."],
  },
  {
    agent: "Pragmatist",
    parts: ["Key inflection points: June Fed decision, Q2 GDP advance estimate (July release), and August tariff impact report. Recommend flagging Q1 GDP revision risk. Current evidence supports a 58–72% recession probability range."],
  },
];

/* ── Agent signal cards (Signals tab) ───────────────────────── */
const SIGNAL_CARDS = [
  {
    name: "Cartographer", task: "Evidence Clusters", model: "Gemini 2.5 Pro",
    status: "Streaming", statusColor: ACCENT,
    bg: "#1e1c1a", border: "#434341",
    nameColor: "#f7f6f2",
    evidence: ["Fed minutes - Jan - Mar 2026", "Q4 2025 GDP - 1.2% annualized", "Labor market - claims +8%", "Yield spread - 0.12%"],
    footer: ["Gemini 2.5 Pro", "Assessing 3 of 4"],
  },
  {
    name: "Methodologist", task: "Validity Assessment", model: "GPT-4o",
    status: "Waiting", statusColor: "#524c48",
    bg: "#2e2b28", border: "#524c48",
    nameColor: "#524c48",
    evidence: [],
    footer: ["GPT-40", ""],
  },
  {
    name: "Contrarian", task: "Evidence Challenge • Steelman", model: "Claude Sonnet 4.6",
    status: "Waiting", statusColor: "#524c48",
    bg: "#2e2b28", border: "#524c48",
    nameColor: "#524c48",
    evidence: [],
    footer: ["Claude Sonnet 4.6", ""],
  },
  {
    name: "Synthesizer", task: "Finding Assembly", model: "Mistral Large",
    status: "Waiting", statusColor: "#524c48",
    bg: "#2e2b28", border: "#524c48",
    nameColor: "#524c48",
    evidence: [],
    footer: ["", ""],
  },
  {
    name: "Pragmatist", task: "Application notes", model: "Grok 4.1 Fast",
    status: "Waiting", statusColor: "#524c48",
    bg: "#2e2b28", border: "#524c48",
    nameColor: "#524c48",
    evidence: [],
    footer: ["", ""],
  },
  {
    name: "Ledger", task: "Evidence Nodes", model: "Augle 1.1",
    status: "Waiting", statusColor: "#524c48",
    bg: "#2e2b28", border: "#524c48",
    nameColor: "#524c48",
    evidence: [],
    footer: ["", ""],
  },
];

/* ── Evidence nodes ──────────────────────────────────────────── */
const EVIDENCE_NODES = [
  {
    label: "Established", labelColor: "#58a74a", labelBg: "rgba(88,167,74,0.34)", labelBorder: "#58a74a",
    title: "NBER Lag 6-8 months", statusText: "Documented", statusColor: "#58a74a",
    bg: "#283625", border: "#58a74a",
    dotColor: "#58a74a",
  },
  {
    label: "Probable", labelColor: "#4392f1", labelBg: "rgba(67,146,241,0.14)", labelBorder: "#4392f1",
    title: "GDP below trend", statusText: "Not yet contracted", statusColor: "#4392f1",
    bg: "rgba(67,146,241,0.12)", border: "#4392f1",
    dotColor: "#4392f1",
  },
  {
    label: "Contested", labelColor: "#d4982a", labelBg: "rgba(212,152,42,0.34)", labelBorder: "#d4982a",
    title: "Claims increased", statusText: "Pending", statusColor: "#d4982a",
    bg: "#372f21", border: "#d4982a",
    dotColor: "#d4982a",
  },
  {
    label: "Gap", labelColor: "#f68864", labelBg: "rgba(217,120,88,0.34)", labelBorder: "#d97858",
    title: "Q1 2026 GDP", statusText: "Release April 30", statusColor: "#d97858",
    bg: "rgba(217,120,88,0.2)", border: "#d97858",
    dotColor: "#d97858",
  },
];

/* ── Agent processing mini-cards ─────────────────────────────── */
const PROCESSING_CARDS = [
  { name: "Cartographer",  task: "Evidence Clusters",    model: "Gemini 2.5 Pro",   status: "completed", statusColor: "#22a86f", initial: "C",  bg: "rgba(34,168,111,0.11)", border: "#22a86f", nameColor: "#22a86f", initialColor: "#fff" },
  { name: "Methodologist", task: "Validity Assessment",  model: "GPT-4o",            status: "waiting",   statusColor: "#524c48", initial: "M",  bg: "#2e2b28",              border: "#524c48", nameColor: "#524c48", initialColor: "#524c48" },
  { name: "Contrarian",    task: "Challenge · Steelman", model: "Claude Sonnet 4.6", status: "waiting",   statusColor: "#524c48", initial: "CT", bg: "#2e2b28",              border: "#524c48", nameColor: "#524c48", initialColor: "#524c48" },
  { name: "Synthesizer",   task: "Finding Assembly",     model: "Mistral Large",     status: "waiting",   statusColor: "#524c48", initial: "S",  bg: "#2e2b28",              border: "#524c48", nameColor: "#524c48", initialColor: "#524c48" },
  { name: "Pragmatist",    task: "Application notes",    model: "Grok 4.1 Fast",     status: "waiting",   statusColor: "#524c48", initial: "P",  bg: "#2e2b28",              border: "#524c48", nameColor: "#524c48", initialColor: "#524c48" },
  { name: "Ledger",        task: "Evidence Nodes",       model: "Augle 1.1",         status: "Active",    statusColor: "#d97858", initial: "L",  bg: "#33251e",              border: "#c15f3c", nameColor: "#c2603f", initialColor: "#fff" },
];

const PHASES = ["Exploration", "Deliberation", "Synthesis", "Conclusion"];

/* ── Sidebar data ────────────────────────────────────────────── */
const ACTIVE_SESSIONS = [
  { icon: "polymarket", title: "Will the US Enter a Recession by Q4 2026?" },
  { icon: "warning",    title: "Will Bitcoin Surpass $200,000 before Dec..." },
  { icon: "check",      title: "Will the US Enter a Recession by Q4 2026?" },
];

const HISTORY_ITEMS = [
  "Will Bitcoin Surpass $200,000 before Dec...",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will Bitcoin Surpass $200,000 before Dec...",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will Bitcoin Surpass $200,000 before Dec...",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will Bitcoin Surpass $200,000 before Dec...",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will Bitcoin Surpass $200,000 before Dec...",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
  "Will the US Enter a Recession by Q4 2026?",
];

function SessionIcon({ type }: { type: string }) {
  if (type === "polymarket") {
    return (
      <div className="shrink-0 w-[22px] h-[22px] rounded-[4px] bg-[#1652f0] flex items-center justify-center">
        <TrendingUp size={12} color="white" strokeWidth={2} />
      </div>
    );
  }
  if (type === "warning") {
    return (
      <div className="shrink-0 w-[22px] h-[22px] rounded-[5px] flex items-center justify-center" style={{ background: "rgba(247,208,2,0.3)", border: "0.5px solid #f7d002" }}>
        <AlertTriangle size={12} color="#c8a900" strokeWidth={2} />
      </div>
    );
  }
  return (
    <div className="shrink-0 w-[22px] h-[22px] rounded-[5px] flex items-center justify-center" style={{ background: "rgba(40,200,120,0.3)", border: "0.5px solid #28c878" }}>
      <Check size={12} color="#1a9e60" strokeWidth={2.5} />
    </div>
  );
}

function Sidebar() {
  return (
    <aside
      className="w-[402px] shrink-0 flex flex-col h-full overflow-y-auto rounded-tl-[11px]"
      style={{ background: "#262321", borderLeft: "0.5px solid #333230" }}
    >
      {/* Top header: Start new session */}
      <div
        className="shrink-0 h-[90px] flex items-center justify-center px-[22px] rounded-tl-[11px]"
        style={{ background: "#1e1c1a", borderBottom: "0.5px solid #333230", borderTop: "0.5px solid #333230" }}
      >
        <button
          type="button"
          className="w-full h-[52px] rounded-[8px] text-text-primary text-[16px] font-medium"
          style={{ background: ACCENT }}
        >
          Start new session
        </button>
      </div>

      {/* Active sessions */}
      <div className="px-[22px] pt-5 pb-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-[26px] h-[26px] rounded-[5px] flex items-center justify-center text-text-primary text-[14px] font-medium" style={{ background: ACCENT }}>3</div>
          <span className="font-serif font-bold text-[16px]" style={{ color: ACCENT }}>Active</span>
        </div>
        <div className="space-y-3">
          {ACTIVE_SESSIONS.map((s, i) => (
            <div key={i} className="flex items-start gap-3 cursor-pointer">
              <SessionIcon type={s.icon} />
              <p className="text-[16px] text-text-primary leading-[24px] flex-1">{s.title}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "0.5px solid #434341" }} />

      {/* Session history */}
      <div className="px-[22px] pt-5 flex-1 min-h-0 flex flex-col">
        {/* Section header */}
        <div className="flex items-center justify-between mb-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-[26px] h-[26px] rounded-[5px] flex items-center justify-center text-text-primary text-[14px] font-medium" style={{ background: ACCENT }}>9</div>
            <span className="font-serif font-bold text-[16px]" style={{ color: ACCENT }}>Session history</span>
          </div>
          <button type="button" aria-label="Filter" className="flex items-center justify-center w-[24px] h-[24px]">
            <SlidersHorizontal size={16} color="#b5ada4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-2 h-[43px] px-3 rounded-[8px] mb-2 shrink-0"
          style={{ background: "#2e2b28", border: "0.5px solid #49443f" }}
        >
          <Search size={16} color="#6a645e" strokeWidth={1.5} />
          <span className="text-[16px]" style={{ color: "#6a645e" }}>Search history</span>
        </div>

        {/* Filters */}
        {["Category", "Depth", "Confidence"].map((label) => (
          <div
            key={label}
            className="flex items-center justify-between h-[43px] px-3 rounded-[8px] mb-2 shrink-0 cursor-pointer"
            style={{ background: "#2e2b28", border: "0.5px solid #49443f" }}
          >
            <span className="text-[16px]" style={{ color: "#b1ada5" }}>{label}</span>
            <ChevronRight size={16} color="#b1ada5" strokeWidth={1.5} />
          </div>
        ))}

        {/* History list */}
        <div className="flex-1  mt-1">
          {HISTORY_ITEMS.map((item, i) => (
            <p
              key={i}
              className="text-[16px] text-text-primary leading-[24px] py-[9px] cursor-pointer hover:text-accent transition-colors"
            >
              {item}
            </p>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ── Page content ────────────────────────────────────────────── */
function ChatContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [activeTab, setActiveTab] = useState(0); // 0 = Conversation, 1 = Signals
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setVisibleCount(i);
      if (i >= MESSAGES.length) clearInterval(id);
    }, 600);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-[1155px] mx-auto px-6 py-[22px] space-y-4">

        {/* ── Title row ── */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-[18px] h-[18px] bg-[#1652f0] rounded-[4px] flex items-center justify-center shrink-0">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 7L3.5 3.5L6 5.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <span className="text-text-secondary text-[14px] font-medium">Polymarket</span>
            </div>
            <h1 className="font-serif font-bold text-[20px] text-text-primary tracking-[-0.2px]">{query}</h1>
          </div>

          {/* Conversation | Signals toggle */}
          <div
            className="flex p-[4px] rounded-[71px]"
            style={{ background: "#1e1c1a", border: "1px solid #30302e" }}
          >
            {["Conversation", "Signals"].map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(i)}
                className="px-4 py-1 text-[14px] tracking-[-0.14px] transition-all"
                style={
                  activeTab === i
                    ? { background: ACCENT, color: "#f7f6f2", borderRadius: "40px", fontWeight: 600, boxShadow: "0px 16px 16px -4px rgba(0,0,0,0.1)" }
                    : { color: "#8b8078", borderRadius: "8px", fontWeight: 500 }
                }
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main card ── */}
        <div
          className="rounded-[11px] overflow-hidden"
          style={{ background: "#262321", border: "0.5px solid #434341" }}
        >
          {/* Card header: Guardian + status chips */}
          <div
            className="flex items-center justify-between px-[33px] h-[64px]"
            style={{ background: "#1e1c1a", borderBottom: "0.5px solid #434341" }}
          >
            {/* Guardian */}
            <div className="flex items-center gap-3">
              <GuardianSpinner />
              <div>
                <p className="font-serif font-bold text-[16px] text-text-primary leading-none">Guardian</p>
                <p className="text-[11px] font-medium mt-1" style={{ color: ACCENT }}>Integrity • Bias check</p>
              </div>
            </div>

            {/* Status chips */}
            <div className="flex items-center gap-4 text-[14px]">
              {/* Confidence ••• */}
              <div
                className="flex items-center gap-1.5 h-[30px] px-3 rounded-[4px]"
                style={{ background: "#33251e", border: "0.5px solid #c15f3c" }}
              >
                <span style={{ color: ACCENT }}>Confidence</span>
                <Lottie animationData={typingLoader} loop autoplay style={{ width: 40, height: 20 }} />
              </div>
              {/* 0 Flags */}
              <div
                className="flex items-center h-[30px] px-3 rounded-[4px]"
                style={{ border: "0.5px solid #434341" }}
              >
                <span className="text-text-disabled">0 Flags</span>
              </div>
              {/* Session paused */}
              <div
                className="flex items-center h-[30px] px-3 rounded-[4px]"
                style={{ background: "#1e1c1a", border: "0.5px solid #3e3a36" }}
              >
                <span className="text-text-disabled">Session paused</span>
              </div>
              {/* Interject phase */}
              <div
                className="flex items-center gap-2 h-[30px] px-3 rounded-[4px]"
                style={{ background: "#1e1c1a", border: "0.5px solid #3e3a36" }}
              >
                <Clock size={14} color="#524c48" strokeWidth={1.5} />
                <span className="text-text-disabled">Interject phase</span>
                <span className="font-mono text-text-disabled tracking-[-0.56px]">0:00</span>
              </div>
            </div>
          </div>

          {/* Phase tabs */}
          <div className="flex w-full" style={{ borderBottom: "0.5px solid #434341" }}>
            {PHASES.map((phase, i) => (
              <div
                key={phase}
                className="flex-1 h-[40px] flex items-center justify-center text-[14px] font-bold tracking-[-0.14px] transition-all"
                style={
                  i === 0
                    ? { background: "rgba(193,95,60,0.59)", color: "#fff", borderRight: "0.5px solid #d97858", borderBottom: "0.5px solid #d97858" }
                    : { background: "#1e1c1a", color: "#524c48", borderRight: i < 3 ? "0.5px solid #434341" : undefined }
                }
              >
                {phase}
              </div>
            ))}
          </div>

          {/* ── Conversation tab ── */}
          {activeTab === 0 && (
            <div className="px-[33px] py-7 space-y-8 min-h-[380px]">
              {MESSAGES.slice(0, visibleCount).map((msg) => (
                <div key={msg.agent} className="animate-fade-in">
                  <div className="flex items-center gap-2 mb-2">
                    <AgentImg name={msg.agent} size={28} />
                    <h3 className="font-serif font-bold text-[15px]" style={{ color: ACCENT }}>{msg.agent}</h3>
                  </div>
                  <div className="pl-9">
                    <div className="text-text-primary text-[16px] leading-relaxed space-y-1">
                      {msg.parts.map((part, j) =>
                        typeof part === "string" ? (
                          <p key={j}>{part}</p>
                        ) : (
                          <p key={j}>
                            <strong className="font-semibold">{part.label}</strong>
                            {part.text}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {visibleCount < MESSAGES.length && (
                <div className="flex gap-3 items-center">
                  <div className="w-8 h-8 rounded-full bg-bg-input flex items-center justify-center shrink-0">
                    <div className="flex gap-1">
                      {[0, 1, 2].map((d) => (
                        <div key={d} className={`w-1 h-1 rounded-full bg-text-muted animate-pulse stream-dot-${d + 1}`} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Signals tab ── */}
          {activeTab === 1 && (
            <div className="p-6 grid grid-cols-3 gap-4">
              {SIGNAL_CARDS.map((card) => (
                <div
                  key={card.name}
                  className="rounded-[6px] overflow-hidden flex flex-col"
                  style={{ background: card.bg, border: `1px solid ${card.border}`, minHeight: 333 }}
                >
                  {/* Card header */}
                  <div
                    className="flex items-start justify-between px-4 pt-[22px] pb-3"
                    style={{ borderBottom: `1px solid ${card.border}` }}
                  >
                    <div>
                      <p className="font-serif text-[14px] leading-[14px] mb-1" style={{ color: card.nameColor }}>{card.name}</p>
                      <p className="text-[11px] font-medium" style={{ color: card.nameColor, opacity: 0.7 }}>{card.task}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px]" style={{ color: card.statusColor }}>{card.status}</p>
                      <p className="text-[11px]" style={{ color: card.nameColor, opacity: 0.6 }}>{card.model}</p>
                    </div>
                  </div>
                  {/* Card content */}
                  <div className="flex-1 px-4 pt-4">
                    <p
                      className="text-[16px] font-medium uppercase mb-4"
                      style={{ color: card.nameColor === "#f7f6f2" ? "#b1ada5" : "#524c48" }}
                    >
                      {card.task}
                    </p>
                    {card.evidence.length > 0 ? (
                      <ul className="space-y-2">
                        {card.evidence.map((e, i) => (
                          <li key={i} className="flex items-center gap-2 text-[14px] text-text-primary">
                            <div className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: ACCENT }} />
                            {e}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="space-y-3">
                        {[187, 210, 210].map((w, i) => (
                          <div key={i} className="h-[18px] rounded-[3px]" style={{ width: w, background: "#262321" }} />
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Footer */}
                  <div className="px-4 py-3 flex justify-between" style={{ borderTop: `1px solid ${card.border}` }}>
                    <span className="text-[14px]" style={{ color: card.nameColor === "#f7f6f2" ? "#b1ada5" : "rgba(247,246,242,0.22)" }}>
                      {card.footer[0]}
                    </span>
                    {card.footer[1] && (
                      <span className="text-[14px]" style={{ color: ACCENT }}>{card.footer[1]}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

       

        {/* ── Agent processing section ── */}
        <div>
          <p className="text-[14px] font-medium mb-3" style={{ color: "#6a645e" }}>Agent processing</p>
          <div
            className="rounded-[11px] px-6 py-[27px]"
            style={{ background: "#262321", border: "0.5px solid #434341", minHeight: 162 }}
          >
            <div className="flex gap-[11px] justify-center">
              {PROCESSING_CARDS.map((card) => (
                <div
                  key={card.name}
                  className="rounded-[8px] p-[10px] relative"
                  style={{ width: 153, height: 97, background: card.bg, border: `0.5px solid ${card.border}`, flexShrink: 0 }}
                >
                  {/* Header row */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div
                      className="w-[16px] h-[16px] rounded-full flex items-center justify-center shrink-0"
                      style={{ background: card.border }}
                    >
                      <span className="text-[6px] font-medium" style={{ color: card.initialColor }}>{card.initial}</span>
                    </div>
                    <span className="text-[14px] font-medium truncate" style={{ color: card.nameColor }}>{card.name}</span>
                  </div>
                  <p className="text-[11px] font-medium mb-1" style={{ color: card.nameColor }}>{card.task}</p>
                  <p className="text-[11px] font-medium" style={{ color: card.nameColor }}>{card.model}</p>
                  <div className="flex items-center gap-1 mt-2">
                    <div className="w-[6px] h-[6px] rounded-full shrink-0" style={{ background: card.statusColor }} />
                    <span className="text-[11px] font-medium" style={{ color: card.statusColor }}>{card.status}</span>
                  </div>
                  {/* Agent image bottom-right */}
                  <div className="absolute bottom-2 right-2">
                    <AgentImg name={card.name} size={28} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function ChatPageContent() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg-primary">
      <Navbar isLoggedIn={true} />
      <div className="flex flex-1 pt-[69px] overflow-hidden">
        <ChatContent />
        <Sidebar />
      </div>
    </div>
  );
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: `${ACCENT} transparent transparent transparent` }} />
        </div>
      }
    >
      <ChatPageContent />
    </Suspense>
  );
}
