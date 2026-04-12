"use client";
import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Timer, Send } from "lucide-react";

const explorationSummary = [
  { agent: "Cartographer", text: "Mapped 8 evidence nodes. NBER lag pattern confirmed as primary scope constraint. Settled, Contested, and Unknown terrain defined." },
  { agent: "Methodologist", text: "4 nodes Probable · 2 Contested · 2 Gap. Ceiling locked at Probable. No Established claims supported." },
  { agent: "Contrarian", text: '1 Strong objection — comparison class framing. Accepted. "Outperforms polls" → Settled. "Outperforms calibrated models" → Contested.' },
  { agent: "Synthesizer", text: "Question confirmed well-formed. Contrarian amendment accepted. Confidence ceiling Probable. Evidence base developing." },
];

const nextActions = [
  { label: "Landscape amendment · responds to Contrarian R1", color: "#c15f3c" },
  { label: "New evidence assessment · applies downgrade rule", color: "#ca8f32" },
  { label: "Evidence base challenge · targets validity bounds", color: "#22a86f" },
];

function InterjectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [input, setInput] = useState("");

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[85px] pb-6 px-4 flex items-center justify-center">
        <div className="w-full max-w-[768px] bg-bg-card border border-border-primary/50 rounded-[20px] shadow-2xl overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="px-10 py-5 border-b border-border-primary/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-bg-secondary border border-border-primary/50 rounded-full px-3 h-[36px]">
                <Timer size={14} className="text-text-disabled" />
                <span className="text-text-disabled text-sm font-mono tracking-tighter">0:00</span>
                <span className="text-text-disabled text-sm">left to interject</span>
              </div>
              <span className="text-text-primary text-sm font-semibold">Exploration</span>
            </div>
          </div>

          {/* Exploration summary */}
          <div className="px-10 py-6">
            <p className="text-text-muted text-sm font-semibold tracking-wide mb-4">EXPLORATION COMPLETE</p>
            <div className="space-y-4">
              {explorationSummary.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="shrink-0 px-3 py-1.5 rounded bg-bg-input border border-border-input/50 h-fit">
                    <span className="text-text-primary text-sm font-medium">{item.agent}</span>
                  </div>
                  <p className="text-text-primary text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border-primary/50" />

          {/* Deliberation preview */}
          <div className="px-10 py-6">
            <p className="text-text-muted text-sm font-semibold tracking-wide mb-4">DELIBERATION - FIRING NEXT</p>
            <div className="space-y-3 mb-6">
              {["Cartographer", "Methodologist", "Contrarian"].map((agent) => (
                <p key={agent} className="text-text-primary text-sm font-medium">{agent}</p>
              ))}
            </div>
            <div className="space-y-2 mb-6">
              {nextActions.map((action, i) => (
                <div key={i} className="bg-bg-input border border-border-input/50 rounded px-6 py-3 flex items-center gap-3">
                  <div className="w-[9px] h-[9px] rounded-full shrink-0" style={{ backgroundColor: action.color }} />
                  <span className="text-text-primary text-sm">{action.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-border-primary/50" />

          {/* Input area */}
          <div className="px-10 py-6">
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              Optional — contribute context before Deliberation begins. The Guardian will evaluate and route any factual domain knowledge, source, or direct observation you have. 280 characters.
            </p>
            <div className="bg-bg-input border border-border-input/50 rounded-xl p-4 mb-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value.slice(0, 280))}
                placeholder="Start typing"
                className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none resize-none h-[60px] font-medium"
              />
              <div className="flex justify-end">
                <button className="w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center">
                  <Send size={14} className="text-text-muted" />
                </button>
              </div>
            </div>
            <p className="text-text-muted text-sm">Providing a source strengthens approval with the Guardian.</p>
          </div>

          {/* Actions */}
          <div className="px-10 py-6 flex items-center justify-between border-t border-border-primary/50">
            <button onClick={() => router.push("/session/running")} className="text-text-muted text-sm hover:text-text-primary transition-colors">
              Skip and continue session
            </button>
            <button className="bg-accent hover:bg-accent-hover transition-colors text-white font-medium text-base px-8 py-3 rounded-lg">
              Submit to Guardian
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

export default function InterjectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>}>
      <InterjectContent />
    </Suspense>
  );
}
