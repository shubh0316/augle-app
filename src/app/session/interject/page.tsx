"use client";
import { useState } from "react";
import { X, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";

const ACCENT = "#c15f3c";

/* ── Agent badge config ─────────────────────────────────────── */
const AGENT_STYLE: Record<string, { color: string; bg: string; border: string; dot: string }> = {
  Cartographer: { color: "#28c878", bg: "rgba(40,200,120,0.1)",   border: "#28c878", dot: "#28c878" },
  Methodologist:{ color: "#d4982a", bg: "rgba(212,152,42,0.1)",  border: "#d4982a", dot: "#d4982a" },
  Contrarian:   { color: "#6f73d2", bg: "rgba(111,115,210,0.1)", border: "#6f73d2", dot: "#6f73d2" },
  Synthesizer:  { color: "#4392f1", bg: "rgba(67,146,241,0.1)",  border: "#4392f1", dot: "#4392f1" },
};

function AgentBadge({ name }: { name: string }) {
  const s = AGENT_STYLE[name] ?? AGENT_STYLE.Cartographer;
  return (
    <span
      className="inline-flex items-center justify-center h-[30px] px-3 rounded-[4px] text-[14px] shrink-0 whitespace-nowrap"
      style={{ color: s.color, background: s.bg, border: `0.5px solid ${s.border}` }}
    >
      {name}
    </span>
  );
}

/* ── Data ────────────────────────────────────────────────────── */
const EXPLORATION_SUMMARY = [
  {
    agent: "Cartographer",
    text: "Mapped 8 evidence nodes. NBER lag pattern confirmed as primary scope constraint. Settled, Contested, and Unknown terrain defined.",
  },
  {
    agent: "Methodologist",
    text: "4 nodes Probable · 2 Contested · 2 Gap. Ceiling locked at Probable. No Established claims supported.",
  },
  {
    agent: "Contrarian",
    text: `1 Strong objection — comparison class framing. Accepted. "Outperforms polls" → Settled. "Outperforms calibrated models" → Contested.`,
  },
  {
    agent: "Synthesizer",
    text: "Question confirmed well-formed. Contrarian amendment accepted. Confidence ceiling Probable. Evidence base developing.",
  },
];

const NEXT_AGENTS = [
  { agent: "Cartographer", task: "Landscape amendment · responds to Contrarian R1" },
  { agent: "Methodologist", task: "New evidence assessment · applies downgrade rule" },
  { agent: "Contrarian",   task: "Evidence base challenge · targets validity bounds" },
];

/* ── Page ─────────────────────────────────────────────────────── */
export default function InterjectPage() {
  const [text, setText] = useState("");

  return (
    <div className="relative min-h-screen bg-[#171613]  overflow-hidden">
      {/* Navbar (visible behind dim) */}
      <Navbar isLoggedIn={true} />

      {/* Dim overlay */}
      <div className="fixed inset-0 bg-[rgba(23,22,20,0.92)] z-10" />

      {/* Modal centered on screen */}
      <div className="fixed inset-0 z-20 flex items-center justify-center mt-20">
        <div
          className="relative w-[768px] max-h-[90vh] overflow-y-auto rounded-[20px] flex flex-col"
          style={{
            background: "#2e2b28",
            border: "0.5px solid #524c48",
            boxShadow: "0px 2px 8px 0px rgba(0,0,0,0.05), 0px 44px 48px -12px rgba(0,0,0,0.15), 0px 0px 24px 4px rgba(0,0,0,0.05)",
          }}
        >
          {/* Modal header */}
          <div
            className="flex items-center justify-between px-6 h-[78px] rounded-tl-[20px] rounded-tr-[20px] shrink-0"
            style={{ background: "#1e1c1a", borderBottom: "0.5px solid #524c48" }}
          >
            {/* Timer bar */}
            <div
              className="relative h-[36px] w-[316px] rounded-[4px] overflow-hidden"
              style={{ border: "0.5px solid #c15f3c" }}
            >
              {/* Filled left side */}
              <div className="absolute inset-0 w-[192px] rounded-bl-[4px] rounded-tl-[4px]" style={{ background: "#33251e" }} />
              {/* Divider */}
              <div className="absolute top-0 bottom-0 left-[192px]" style={{ borderLeft: "0.5px solid #c15f3c" }} />
              {/* Labels */}
              <div className="relative flex items-center justify-between h-full px-3">
                <div className="flex items-center gap-1.5">
                  <Clock size={15} style={{ color: "#d97858" }} />
                  <span className="font-mono text-[16px] tracking-[-0.64px]" style={{ color: "#d97858" }}>0:00</span>
                  <span className="text-[14px]" style={{ color: "#d97858" }}>left to interject</span>
                </div>
                <span className="text-[16px] font-medium" style={{ color: ACCENT }}>Exploration</span>
              </div>
            </div>

            {/* Close */}
            <button
              type="button"
              aria-label="Close"
              className="flex items-center justify-center w-[40px] h-[40px] rounded-full transition-colors hover:bg-[rgba(139,128,120,0.1)]"
              style={{ border: "0.5px solid #8b8078" }}
            >
              <X size={20} className="text-text-secondary" />
            </button>
          </div>

          {/* ── Exploration Complete ── */}
          <div className="px-10 pt-7 pb-6">
            <p className="font-medium text-[16px] mb-5" style={{ color: ACCENT }}>EXPLORATION COMPLETE</p>
            <div className="space-y-4">
              {EXPLORATION_SUMMARY.map((item) => (
                <div key={item.agent} className="flex items-start gap-4">
                  <AgentBadge name={item.agent} />
                  <p className="text-[16px] leading-[24px] text-text-primary pt-[6px] flex-1">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderTop: "0.5px solid #434341" }} />

          {/* ── Deliberation Firing Next ── */}
          <div className="px-10 py-6">
            <p className="font-medium text-[16px] mb-5" style={{ color: ACCENT }}>DELIBERATION - FIRING NEXT</p>
            <div className="space-y-3">
              {NEXT_AGENTS.map((item) => {
                const s = AGENT_STYLE[item.agent] ?? AGENT_STYLE.Cartographer;
                return (
                  <div
                    key={item.agent}
                    className="flex items-center h-[49px] px-5 rounded-[5px]"
                    style={{ background: "#2e2b28", border: "0.5px solid #50504c" }}
                  >
                    <div className="w-[9px] h-[9px] rounded-full shrink-0 mr-4" style={{ background: s.dot }} />
                    <span className="text-[16px] text-text-primary w-[140px] shrink-0">{item.agent}</span>
                    <span className="text-[16px] text-text-secondary">{item.task}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ borderTop: "0.5px solid #434341" }} />

          {/* ── Interject Input ── */}
          <div className="px-10 py-6">
            <p className="text-[16px] leading-[24px] mb-4">
              <span className="font-medium text-text-primary">Optional — contribute context before Deliberation begins. </span>
              <span className="text-text-secondary">The Guardian will evaluate and route any factual domain knowledge, source, or direct observation you have. 280 characters.</span>
            </p>

            <div
              className="relative rounded-[17px] p-5 pb-12"
              style={{ background: "#2e2b28", border: "0.5px solid #50504c" }}
            >
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 280))}
                placeholder="Start typing"
                rows={3}
                className="w-full bg-transparent text-text-primary text-[16px] leading-[24px] resize-none outline-none placeholder-text-disabled"
              />
              <button
                type="button"
                aria-label="Submit"
                className="absolute bottom-3 right-3 w-[31px] h-[31px] rounded-[5px] flex items-center justify-center"
                style={{ background: ACCENT }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 13V3M8 3L4 7M8 3L12 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <p className="text-[14px] text-text-secondary mt-3">
              Providing a source strengthens approval with the Guardian.
            </p>
          </div>

          {/* ── Footer ── */}
          <div className="px-10 pb-8 flex items-center justify-between">
            <button
              type="button"
              className="text-[16px] leading-[24px] transition-opacity hover:opacity-70"
              style={{ color: "#d97858" }}
            >
              Skip and  continue session
            </button>
            <button
              type="button"
              className="h-[52px] px-10 rounded-[8px] text-text-primary text-[16px] font-medium transition-colors"
              style={{ background: ACCENT }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#a8512f"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = ACCENT; }}
            >
              Submit to Guardian
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
