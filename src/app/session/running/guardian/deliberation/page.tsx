"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import { MoreHorizontal, X, ArrowUp } from "lucide-react";

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

/* ─── Agent pill colors ──────────────────────────────────────── */
const AGENT_PILL: Record<string, { color: string; bg: string; border: string }> = {
  Cartographer: { color: "#58A74A", bg: "rgba(88,167,74,0.12)",  border: "rgba(88,167,74,0.5)"  },
  Methodologist:{ color: "#D4982A", bg: "rgba(212,152,42,0.12)", border: "rgba(212,152,42,0.5)" },
  Contrarian:   { color: "#8B6FD4", bg: "rgba(139,111,212,0.12)",border: "rgba(139,111,212,0.5)"},
  Synthesizer:  { color: "#4392F1", bg: "rgba(67,146,241,0.12)", border: "rgba(67,146,241,0.5)" },
  Pragmatist:   { color: "#58A74A", bg: "rgba(88,167,74,0.12)",  border: "rgba(88,167,74,0.5)"  },
};

const FIRING_DOT: Record<string, string> = {
  Cartographer: "#58A74A",
  Methodologist: "#D4982A",
  Contrarian: "#4392F1",
};

/* ─── Modal data ─────────────────────────────────────────────── */
const SUMMARIES = [
  { agent: "Cartographer",  text: "Mapped 8 evidence nodes. NBER lag pattern confirmed as primary scope constraint. Settled, Contested, and Unknown terrain defined." },
  { agent: "Methodologist", text: "4 nodes Probable · 2 Contested · 2 Gap. Ceiling locked at Probable. No Established claims supported." },
  { agent: "Contrarian",    text: "1 Strong objection — comparison class framing. Accepted. \"Outperforms polls\" → Settled. \"Outperforms calibrated models\" → Contested." },
  { agent: "Synthesizer",   text: "Question confirmed well-formed. Contrarian amendment accepted. Confidence ceiling Probable. Evidence base developing." },
  { agent: "Pragmatist",    text: "Question confirmed well-formed. Contrarian amendment accepted. Confidence ceiling Probable. Evidence base developing." },
];

const FIRING = [
  { agent: "Cartographer",  desc: "Landscape amendment · responds to Contrarian R1" },
  { agent: "Methodologist", desc: "New evidence assessment · applies downgrade rule" },
  { agent: "Contrarian",    desc: "Evidence base challenge · targets validity bounds" },
];

const BOTTOM_CARDS = [
  { name: "Cartographer",  task: "Evidence Clusters",     model: "Gemini 2.5 Pro",    status: "completed" },
  { name: "Methodologist", task: "Validity Assessment",   model: "GPT-4o",             status: "waiting"   },
  { name: "Contrarian",    task: "Challenge · Steelman",  model: "Claude Sonnet 4.6",  status: "waiting"   },
  { name: "Synthesizer",   task: "Finding Assembly",      model: "DeepSeek V4",        status: "waiting"   },
  { name: "Pragmatist",    task: "Application notes",     model: "Grok 4.1 Fast",      status: "waiting"   },
  { name: "Ledger",        task: "Evidence Nodes",        model: "Augle 1.1",          status: "Active"    },
];

const PHASES = ["Exploration", "Deliberation", "Synthesis", "Conclusion"];

/* ─── Background ghost ───────────────────────────────────────── */
function BackgroundPage({ query }: { query: string }) {
  const MSGS = [
    { agent: "Cartographer",  preview: "Evidence landscape mapped. Three primary clusters identified:\nMacro indicators — GDP growth rate (Q1 2026: +0.4% annualized), yield curve inversion history, manufacturing PMI in contraction for 5 consecutive months, consumer confidence index at 18-month low.\nLabor market signals — Unemployment trending to 4.8%, 4-week jobless claims average elevated, hiring freezes reported across tech and financial sectors.\nPolicy environment — Fed rate trajectory uncertain, fiscal drag from debt ceiling resolution, tariff pass-through adding 0.6–1.1% inflationary pressure on consumer goods." },
    { agent: "Contrarian",    preview: "Recession consensus may be premature. Labor market deterioration historically lags GDP by 2–3 quarters. Services PMI remains above contraction threshold." },
    { agent: "Synthesizer",   preview: "Converging signals align with pre-recessionary patterns in 6 of 8 tracked indicators. Primary conflict: services sector resilience and real wage growth continue supporting household spending." },
    { agent: "Pragmatist",    preview: "Key inflection points: June Fed decision, Q2 GDP advance estimate (July release), and August tariff impact report. Recommend flagging Q1 GDP revision risk." },
  ];

  return (
    <div className="pointer-events-none select-none">
      <main className="min-h-screen pt-[76px] pb-8 px-4 flex flex-col items-center">
        <div className="w-full max-w-[860px]">
          {/* header */}
          <div className="flex items-start justify-between gap-4 mb-4 pt-4">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-[18px] h-[18px] bg-[#1652f0] rounded-[4px] flex items-center justify-center shrink-0">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M1 7L3.5 3.5L6 5.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-text-secondary text-sm font-medium">Polymarket</span>
              </div>
              <h1 className="font-serif font-bold text-xl text-text-primary leading-snug">{query}</h1>
            </div>
            <div className="flex items-center gap-2 shrink-0 mt-1">
              <div className="flex items-center bg-bg-card border border-border-primary rounded-full p-1 gap-0.5">
                {["Conversation","Signals"].map((t,i) => (
                  <div key={t} className={`px-5 py-1.5 rounded-full text-sm font-semibold ${i===0?"bg-accent text-white":"text-text-muted"}`}>{t}</div>
                ))}
              </div>
              <div className="w-9 h-9 rounded-full bg-bg-card border border-border-primary flex items-center justify-center">
                <MoreHorizontal size={16} className="text-text-primary" />
              </div>
            </div>
          </div>

          {/* main card */}
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
            <div className="px-8 py-7 space-y-7 min-h-[380px]">
              {MSGS.map((m) => (
                <div key={m.agent} className="flex gap-4">
                  <AgentImg name={m.agent} size={32} />
                  <div className="flex-1 min-w-0">
                    <h3 className={`font-serif font-bold text-[15px] mb-1.5 agent-name-${m.agent}`}>{m.agent}</h3>
                    <p className="text-text-primary text-[14px] leading-relaxed line-clamp-3">{m.preview}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-full overflow-hidden border-x border-b border-border-primary rounded-b-[12px]">
            {PHASES.map((p, i) => (
              <div key={p} className={`flex-1 h-[42px] flex items-center justify-center text-sm font-semibold ${i===0?"bg-accent text-white":"bg-bg-secondary text-text-disabled border-l border-border-primary/50"}`}>{p}</div>
            ))}
          </div>

          <div className="bg-bg-card border border-border-primary rounded-[12px] mt-4 p-4">
            <div className="grid grid-cols-6 gap-3">
              {BOTTOM_CARDS.map((c) => {
                const isCompleted = c.status === "completed";
                const isActive = c.status === "Active";
                return (
                  <div key={c.name} className={`relative rounded-xl p-3 flex flex-col gap-1.5 border ${isCompleted?"border-[#58A74A]/40 bg-[rgba(88,167,74,0.06)]":isActive?"border-accent/40 bg-accent-bg":"border-border-primary/40 bg-bg-secondary/60"}`}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-2 h-2 rounded-full ${isCompleted?"bg-[#58A74A]":isActive?"bg-accent":"bg-text-disabled/40"}`} />
                      <span className={`text-[12px] font-semibold truncate ${isCompleted?"text-[#58A74A]":isActive?"text-accent":"text-text-disabled"}`}>{c.name}</span>
                    </div>
                    <p className="text-text-primary text-[11px] font-medium">{c.task}</p>
                    <p className="text-text-secondary text-[11px]">{c.model}</p>
                    <div className="flex items-center gap-1">
                      <div className={`w-1.5 h-1.5 rounded-full ${isCompleted?"bg-[#58A74A]":isActive?"bg-accent":"bg-text-disabled/30"}`} />
                      <span className={`text-[11px] ${isCompleted?"text-[#58A74A]":isActive?"text-accent-hover":"text-text-disabled"}`}>{c.status}</span>
                    </div>
                    <div className="absolute bottom-2 right-2"><AgentImg name={c.name} size={22} /></div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ─── Modal ──────────────────────────────────────────────────── */
function DeliberationModal({ onClose }: { onClose: () => void }) {
  const [text, setText] = useState("I think th");

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 pb-6" onClick={onClose}>
      <div
        className="relative w-full max-w-[560px] bg-bg-card border border-border-primary rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[calc(100vh-5rem)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 shrink-0">
          <p className="text-accent text-[13px] font-bold tracking-widest uppercase">Next Phase – Deliberation</p>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full border border-border-primary bg-bg-secondary flex items-center justify-center hover:bg-bg-input transition-colors"
          >
            <X size={15} className="text-text-primary" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6">
          {/* ── Agent summaries ── */}
          <div className="space-y-0 border border-border-primary/30 rounded-xl overflow-hidden mb-5">
            {SUMMARIES.map((row, i) => {
              const pill = AGENT_PILL[row.agent];
              return (
                <div
                  key={row.agent}
                  className={`flex gap-4 items-start px-4 py-3 ${i < SUMMARIES.length - 1 ? "border-b border-border-primary/20" : ""}`}
                >
                  <span
                    className="text-[12px] font-semibold px-3 py-1 rounded-md shrink-0 whitespace-nowrap"
                    style={{ color: pill.color, background: pill.bg, border: `1px solid ${pill.border}` }}
                  >
                    {row.agent}
                  </span>
                  <p className="text-text-primary text-[13px] leading-relaxed">{row.text}</p>
                </div>
              );
            })}
          </div>

          {/* ── Deliberation firing next ── */}
          <p className="text-accent text-[11px] font-bold tracking-widest uppercase mb-3">Deliberation – Firing Next</p>
          <div className="border border-border-primary/30 rounded-xl overflow-hidden mb-5">
            {FIRING.map((row, i) => {
              const dotColor = FIRING_DOT[row.agent];
              return (
                <div
                  key={row.agent}
                  className={`flex items-center gap-4 px-4 py-3 ${i < FIRING.length - 1 ? "border-b border-border-primary/20" : ""}`}
                >
                  <div className="flex items-center gap-2 w-[130px] shrink-0">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ background: dotColor }} />
                    <span className="text-text-primary text-[13px] font-semibold">{row.agent}</span>
                  </div>
                  <p className="text-text-secondary text-[13px]">{row.desc}</p>
                </div>
              );
            })}
          </div>

          {/* ── Optional contribution ── */}
          <p className="text-text-primary text-[13px] leading-relaxed mb-3">
            <strong className="font-semibold">Optional — contribute context before Deliberation begins.</strong>
            {" "}The Guardian will evaluate and route any factual domain knowledge, source, or direct observation you have. 280 characters.
          </p>

          <div className="bg-bg-secondary border border-border-primary rounded-xl px-4 pt-3 pb-3 flex flex-col gap-3 mb-2">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, 280))}
              rows={2}
              placeholder="Start typing"
              className="w-full bg-transparent text-text-primary text-[14px] placeholder:text-text-disabled resize-none outline-none leading-relaxed"
            />
            <div className="flex justify-end">
              <button
                type="button"
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${text.trim() ? "bg-accent hover:bg-accent-hover" : "bg-bg-input border border-border-primary"}`}
              >
                <ArrowUp size={15} className={text.trim() ? "text-white" : "text-text-disabled"} />
              </button>
            </div>
          </div>

          <p className="text-text-disabled text-[12px] mb-5">Providing a source strengthens approval with the Guardian.</p>
        </div>

        {/* ── Footer buttons ── */}
        <div className="px-6 py-4 border-t border-border-primary/30 flex items-center justify-between gap-4 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="text-accent text-[13px] font-semibold hover:underline"
          >
            Skip and continue session
          </button>
          <button
            type="button"
            className="px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-white text-[13px] font-bold transition-colors"
          >
            Submit to Guardian
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────── */
function DeliberationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";

  return (
    <div className="relative min-h-screen">
      <Navbar isLoggedIn={true} />
      <div className="blur-[2px] brightness-50 pointer-events-none">
        <BackgroundPage query={query} />
      </div>
      <DeliberationModal onClose={() => router.back()} />
    </div>
  );
}

export default function DeliberationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        </div>
      }
    >
      <DeliberationContent />
    </Suspense>
  );
}
