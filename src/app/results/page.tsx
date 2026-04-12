"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { Share2, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const supportingClaims = [
  { agent: "Cartographer", content: "NBER recession determinations historically lag 6–18 months behind economic conditions. No NBER call has ever been issued within a Q4 calendar window for conditions emerging in that same quarter.", source: "NBER methodology documentation · historical determination timeline analysis" },
  { agent: "Methodologist", content: "Q4 2025 GDP at 1.2% annualized and labor market softening suggest recessionary conditions are emerging but have not crossed the NBER threshold. Methodologist seasonality correction reduces labor signal strength to ~3.5% trend.", source: "BLS · BEA Q4 2025 advance estimate · Fed H.8 data" },
  { agent: "Contrarian", content: "Contrarian analysis suggests the Polymarket 34% price reflects traders discounting resolution mechanics — true recession probability closer to 48–54%, materially higher than the contract price signals.", source: "Contrarian · Deliberation phase" },
];

const contestedClaims = [
  { agent: "Methodologist", content: "University of Michigan Consumer Sentiment Index carries documented partisan response bias post-2022. Methodologist and Guardian disputed its weight. Retained with reduced weighting — flagged in session log.", source: "Agents in dispute Methodologist vs. Cartographer · Guardian flag raised" },
];

const agentTabs = ["Cartographer", "Methodologist", "Contrarian", "Synthesizer", "Pragmatist", "Guardian"];

const suggestedSessions = [
  { priority: "HIGH PRIORITY", question: "How do Kalshi and Polymarket differ in calibration accuracy on identical event sets, controlling for liquidity?", depth: "Standard • Est. 15 min • 3 credits" },
  { priority: "MEDIUM PRIORITY", question: "Does favorite-longshot bias in prediction markets reflect structural behavioral factors or regulatory constraints?", depth: "Deep • Est. 45 min • 6 credits" },
];

function ResultsContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [expandedClaim, setExpandedClaim] = useState<number | null>(0);

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[85px] pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-[1016px]">
          {/* Header badges */}
          <div className="flex flex-wrap items-center gap-3 mb-4 animate-fade-in">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-text-primary text-base font-medium">Probability NO</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success" />
              <span className="text-text-primary text-base font-medium">Confidence High</span>
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button className="text-text-muted text-sm flex items-center gap-1.5 hover:text-text-primary transition-colors">
                <Share2 size={16} /> Share
              </button>
              <button className="text-text-muted text-sm hover:text-text-primary transition-colors">Export</button>
              <button className="text-text-muted text-sm hover:text-text-primary transition-colors">Permalink</button>
            </div>
          </div>

          {/* Title card */}
          <div className="bg-[#262321] border border-border-primary rounded-t-[14px] px-10 py-5 animate-fade-in">
            <h1 className="font-serif font-bold text-xl text-text-primary">{query}</h1>
          </div>

          {/* Main verdict */}
          <div className="bg-bg-card border-x border-border-primary px-10 py-8 animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <p className="text-text-primary text-lg leading-relaxed">
              The Polymarket &quot;US recession by Q4 2026&quot; contract is likely overpriced at 34% YES. Market probability of formal NBER resolution within the contract window is low even under recessionary conditions — true implied recession probability is approximately 48–54%, but contract resolution probability is 18–26%.
            </p>
          </div>

          {/* Meta info */}
          <div className="bg-bg-card border-x border-b border-border-primary rounded-b-[14px] px-10 py-4 space-y-2 animate-fade-in" style={{ animationDelay: "0.15s", opacity: 0 }}>
            <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
              <span>Platform <span className="text-text-primary">Polymarket</span></span>
              <span>Agents <span className="text-text-primary">6</span> • 1 flag raised • resolved</span>
              <span>Depth <span className="text-text-primary">Standard</span> • 3 phases</span>
            </div>
            <div className="flex flex-wrap gap-6 text-sm text-text-secondary">
              <span>Runtime <span className="text-text-primary">15m 33s</span></span>
              <span>Evidence sourced <span className="text-text-primary">April 1, 2026 21:02 PST</span></span>
              <span>Credits <span className="text-text-primary">1 used</span> • 0 refunded</span>
            </div>
          </div>

          {/* Agent tabs */}
          <div className="flex flex-wrap gap-2 mt-6 mb-4 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            {agentTabs.map((tab) => (
              <button key={tab} className="px-4 py-1.5 rounded-full bg-bg-input border border-border-input/50 text-text-primary text-sm font-semibold hover:border-accent transition-colors">
                {tab}
              </button>
            ))}
          </div>

          {/* Supporting claims */}
          <div className="animate-fade-in" style={{ animationDelay: "0.25s", opacity: 0 }}>
            <div className="bg-bg-card border border-border-primary rounded-t-[11px] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-text-primary text-lg font-semibold">1</span>
                <span className="text-text-primary text-base font-medium">Supporting claims</span>
              </div>
              <button className="px-4 py-1 rounded-full bg-bg-input border border-border-input/50 text-text-primary text-sm">Expand all</button>
            </div>
            <div className="space-y-0">
              {supportingClaims.map((claim, i) => (
                <div key={i} className={`border-x border-b border-border-primary px-6 py-5 ${i === 0 ? "" : "bg-bg-card"}`}>
                  <button className="px-3 py-1 rounded-full bg-bg-input border border-border-input/50 text-text-primary text-sm font-semibold mb-3">
                    {claim.agent}
                  </button>
                  <p className="text-text-primary text-base leading-relaxed mb-3">{claim.content}</p>
                  <p className="text-text-muted text-sm">Source: {claim.source}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contested terrain */}
          <div className="mt-6 animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <div className="bg-bg-card border border-border-primary rounded-t-[11px] px-6 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-text-primary text-lg font-semibold">2</span>
                <span className="text-text-primary text-base font-medium">Contested Terrain</span>
              </div>
              <button className="px-4 py-1 rounded-full bg-bg-input border border-border-input/50 text-text-primary text-sm">Expand all</button>
            </div>
            {contestedClaims.map((claim, i) => (
              <div key={i} className="border-x border-b border-border-primary rounded-b-[11px] px-6 py-5 bg-bg-card">
                <button className="px-3 py-1 rounded-full bg-bg-input border border-border-input/50 text-text-primary text-sm font-semibold mb-3">
                  {claim.agent}
                </button>
                <p className="text-text-primary text-base leading-relaxed mb-3">{claim.content}</p>
                <p className="text-text-muted text-sm">Source: {claim.source}</p>
              </div>
            ))}
          </div>

          {/* Suggested follow-on */}
          <div className="border-t border-border-primary mt-10 pt-6 animate-fade-in" style={{ animationDelay: "0.35s", opacity: 0 }}>
            <h2 className="text-text-primary text-lg font-semibold mb-4">Suggested follow-on sessions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestedSessions.map((s, i) => (
                <div key={i} className={`${i === 0 ? "bg-bg-card" : "bg-[#262321]"} border border-border-primary rounded-[14px] p-6 flex flex-col justify-between min-h-[184px]`}>
                  <div>
                    <p className={`text-xs font-semibold tracking-wide mb-3 ${i === 0 ? "text-accent" : "text-text-muted"}`}>{s.priority}</p>
                    <p className="text-text-primary text-base leading-relaxed">{s.question}</p>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-text-secondary text-sm">{s.depth}</span>
                    <button className="text-text-muted text-sm flex items-center gap-1 hover:text-accent transition-colors">
                      Start session <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bg-primary flex items-center justify-center"><div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" /></div>}>
      <ResultsContent />
    </Suspense>
  );
}
