"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import AgentCard from "@/components/AgentCard";
import PhaseTabs from "@/components/PhaseTabs";
import StatusBar from "@/components/StatusBar";
import Toggle from "@/components/Toggle";
import { Shield, MoreHorizontal } from "lucide-react";

const agentsList = [
  { name: "Cartographer", initial: "C", task: "Evidence Clusters", model: "Gemini 2.5 Pro" },
  { name: "Methodologist", initial: "M", task: "Validity Assessment", model: "GPT-4o" },
  { name: "Contrarian", initial: "CT", task: "Challenge · Steelman", model: "Claude Sonnet 4.6" },
  { name: "Synthesizer", initial: "S", task: "Finding Assembly", model: "Mistral Large" },
  { name: "Pragmatist", initial: "P", task: "Application notes", model: "Grok 4.1 Fast" },
  { name: "Ledger", initial: "L", task: "Evidence Nodes", model: "Augle 1.1" },
];

const sampleMessages = [
  { agent: "Cartographer", content: "All captured. The doc covers three sections:\nProduct Decisions — model swaps, version upgrades, model attribution, Guardian branding and naming, confidence signal, phase naming, membership model, sidebar, color palette, regulatory.\n\nScreen 6 Layout — feed centering, Guardian sticky bar, Topic Architect fade interaction with exact timing (1.5–2 second pause), bottom legend strip, phase tabs, Interject bar, logo placement rules.\n\nNotes for Shub — step-by-step Topic Architect fade sequence, phase naming implementation, Guardian branding in code, legend strip spec, Interject bar render conditions, and what's still outstanding." },
  { agent: "Methodologist", content: "Research question confirmed. Depth: Standard, 3 phases. Evidence threshold: Moderate. No ambiguity flags on intake." },
];

function SessionRunningContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [viewMode, setViewMode] = useState(0);
  const [agentStatuses, setAgentStatuses] = useState<Array<"waiting" | "streaming" | "completed" | "active">>([
    "completed", "waiting", "waiting", "waiting", "waiting", "active"
  ]);
  const [messages, setMessages] = useState(sampleMessages.slice(0, 1));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer1 = setTimeout(() => { setLoading(false); }, 1500);
    const timer2 = setTimeout(() => {
      setMessages(sampleMessages);
      setAgentStatuses(["completed", "streaming", "waiting", "waiting", "waiting", "active"]);
    }, 3000);
    const timer3 = setTimeout(() => {
      setAgentStatuses(["completed", "completed", "streaming", "streaming", "waiting", "active"]);
    }, 6000);
    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
  }, []);

  if (loading) {
    return (
      <>
        <Navbar isLoggedIn={true} />
        <main className="min-h-screen flex flex-col items-center justify-center">
          <div className="flex flex-col items-center gap-6">
            <svg width="105" height="107" viewBox="0 0 105 107" fill="none"><circle cx="52" cy="53" r="42" fill="#c15f3c" opacity="0.9" className="animate-pulse"/><path d="M52 11L80 46L52 107L24 46Z" fill="#171613" opacity="0.3"/></svg>
            <p className="text-text-secondary text-lg font-serif">Hang tight. We're building your report.</p>
            <div className="bg-bg-card border border-border-primary rounded-lg px-6 py-4 max-w-[371px] mt-4">
              <p className="text-text-secondary text-sm font-medium mb-2">Did you know?</p>
              <p className="text-text-primary text-sm leading-relaxed">70% of Polymarket Traders Lost Money as Top 0.04% Captured Most Profit.</p>
              <p className="text-text-muted text-xs mt-3">Yahoo Finance</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[85px] pb-6 px-4 flex flex-col items-center">
        <div className="w-full max-w-[1155px]">
          {/* Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-2 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <svg width="97" height="23" viewBox="0 0 97 23" fill="none"><text x="0" y="18" fontFamily="Libre Baskerville" fontWeight="700" fontSize="14" fill="#c15f3c">Augle</text></svg>
              </div>
              <h1 className="font-serif font-bold text-xl text-text-primary tracking-tight">{query}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-[288px]">
                <Toggle options={["Conversation", "Signals"]} active={viewMode} onChange={setViewMode} variant="pill" />
              </div>
              <button className="w-10 h-10 rounded-full bg-bg-secondary border border-border-secondary/50 flex items-center justify-center">
                <MoreHorizontal size={16} className="text-text-primary" />
              </button>
            </div>
          </div>

          {/* Status bar */}
          <div className="flex justify-end mb-3">
            <StatusBar />
          </div>

          {/* Main content */}
          <div className="bg-bg-card border-x border-t border-border-primary/50 rounded-t-[11px]">
            {/* Guardian bar */}
            <div className="bg-bg-secondary border-b border-border-primary/50 rounded-t-[11px] px-8 py-3 flex items-center gap-3">
              <Shield size={20} className="text-accent" />
              <div>
                <p className="font-serif font-bold text-base text-text-primary">Guardian</p>
                <p className="text-accent text-[11px] font-medium">Integrity • Bias check</p>
              </div>
            </div>

            {/* Messages */}
            <div className="px-8 py-6 space-y-8 min-h-[500px]">
              {messages.map((msg, i) => (
                <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 0.2}s`, opacity: 0 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${msg.agent === "Cartographer" ? "bg-white" : "bg-black"}`}>
                      <span className="text-xs font-bold">{msg.agent === "Cartographer" ? "🗺️" : "⚙️"}</span>
                    </div>
                    <h3 className="font-serif font-bold text-base text-accent">{msg.agent}</h3>
                  </div>
                  <div className="pl-11">
                    <p className="text-text-primary text-base leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Phase tabs */}
          <PhaseTabs activePhase={0} />

          {/* Agent strip */}
          <div className="bg-bg-card border border-border-secondary/50 rounded-[11px] mt-4 p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {agentsList.map((agent, i) => (
                <AgentCard
                  key={agent.name}
                  name={agent.name}
                  initial={agent.initial}
                  task={agent.task}
                  model={agent.model}
                  status={agentStatuses[i]}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function SessionRunningPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>}>
      <SessionRunningContent />
    </Suspense>
  );
}
