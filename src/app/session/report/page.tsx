"use client";
import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCw, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";

const ACCENT = "#c15f3c";

const BADGE_MAP: Record<string, { color: string; bg: string; border: string }> = {
  Established: { color: "#28c878", bg: "rgba(40,200,120,0.34)",  border: "#28c878"  },
  Probable:    { color: "#7abadc", bg: "rgba(90,154,200,0.35)",  border: "#5a9ac8"  },
  Contested:   { color: "#d4982a", bg: "rgba(212,152,42,0.35)",  border: "#d4982a"  },
  Gap:         { color: "#D97858", bg: "rgba(217,120,88,0.13)",  border: "rgba(217,120,88,0.5)" },
};

function Badge({ type }: { type: string }) {
  const b = BADGE_MAP[type] ?? BADGE_MAP.Probable;
  return (
    <span
      className="inline-block text-[14px] font-semibold px-4 py-1 rounded-[8px]"
      style={{ color: b.color, background: b.bg, border: `1px solid ${b.border}` }}
    >
      {type}
    </span>
  );
}

const SUPPORTING_CLAIMS = [
  {
    badge: "Established",
    text: "NBER recession determinations historically lag 6–18 months behind economic conditions. No NBER call has ever been issued within a Q4 calendar window for conditions emerging in that same quarter.",
    source: "NBER methodology documentation · historical determination timeline analysis",
  },
  {
    badge: "Probable",
    text: "Q4 2025 GDP at 1.2% annualized and labor market softening suggest recessionary conditions are emerging but have not crossed the NBER threshold. Methodologist seasonality correction reduces labor signal strength to ~3.5% trend.",
    source: "BLS · BEA Q4 2025 advance estimate · Fed H.8 data",
  },
  {
    badge: "Probable",
    text: "Contrarian analysis suggests the Polymarket 34% price reflects traders discounting resolution mechanics — true recession probability closer to 48–54%, materially higher than the contract price signals.",
    source: "Contrarian · Deliberation phase",
  },
];

const CONTESTED = [
  {
    badge: "Contested",
    text: "University of Michigan Consumer Sentiment Index carries documented partisan response bias post-2022. Methodologist and Guardian disputed its weight. Retained with reduced weighting — flagged in session log.",
    source: "Agents in dispute  Methodologist vs. Cartographer · Guardian flag raised",
  },
];

const FOLLOW_ONS = [
  {
    priority: "HIGH PRIORITY",
    highlighted: false,
    question: "How do Kalshi and Polymarket differ in calibration accuracy on identical event sets, controlling for liquidity?",
    meta: "Standard • Est. 15 min • 3 credits",
  },
  {
    priority: "MEDIUM PRIORITY",
    highlighted: true,
    question: "Does favorite-longshot bias in prediction markets reflect structural behavioral factors or regulatory constraints?",
    meta: "Deep • Est. 45 min • 6 credits",
  },
];

const TABS = [
  "Supporting Claims",
  "Contested Terrain",
  "Knowledge Gaps",
  "Unresolved Objections",
  "Application Notes",
  "Session Log",
];

function ClaimsSection({
  title,
  number,
  countLabel,
  claims,
}: {
  title: string;
  number: string;
  countLabel: string;
  claims: typeof SUPPORTING_CLAIMS;
}) {
  return (
    <section>
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-6 h-[64px] rounded-tl-[11px] rounded-tr-[11px]"
        style={{ background: "#1e1c1a", border: "0.5px solid #333230" }}
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-[14px] text-white">{number}</span>
          <h2 className="font-serif font-bold text-[20px] text-text-primary">{title}</h2>
        </div>
        <div
          className="flex items-center justify-center px-4 py-1 rounded-[8px]"
          style={{ border: "0.5px solid #434341" }}
        >
          <span className="font-sans italic text-[16px] text-text-primary">{countLabel}</span>
        </div>
      </div>

      {/* Claim rows */}
      {claims.map((c, i) => {
        const isLast = i === claims.length - 1;
        return (
          <div
            key={i}
            className={`px-8 py-6 space-y-3${isLast ? " rounded-bl-[11px] rounded-br-[11px]" : ""}`}
            style={{
              background: "#252220",
              borderLeft: "0.5px solid #333230",
              borderRight: "0.5px solid #333230",
              borderBottom: "0.5px solid #333230",
              ...(i === 0 ? { borderTop: "0.5px solid #333230" } : {}),
            }}
          >
            <Badge type={c.badge} />
            <p className="text-white text-[16px] leading-[27px]">{c.text}</p>
            <p className="text-[16px] text-text-secondary">
              <span className="font-semibold">Source: </span>
              <span className="italic">{c.source}</span>
            </p>
          </div>
        );
      })}
    </section>
  );
}

function ReportContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "Will the US Enter a Recession by Q4 2026?";
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col">
      <Navbar isLoggedIn={true} />

      {/* Top action bar */}
      <div className="w-full max-w-[1016px] mx-auto">   
      <div className="flex items-center justify-between px-8 py-3 shrink-0 mt-[69px]">
        {/* Probability + Confidence pills */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-2 h-[35px] px-4 rounded-[8px]"
            style={{ background: "rgba(193,95,60,0.15)", border: "0.5px solid #c15f3c" }}
          >
            <div className="w-[11px] h-[11px] rounded-full bg-[#C15F3C] shrink-0" />
            <span className="text-[14px] font-medium text-text-primary">Probability</span>
            <span className="text-[14px] font-medium" style={{ color: ACCENT }}>NO</span>
          </div>
          <div
            className="flex items-center gap-2 h-[35px] px-4 rounded-[8px]"
            style={{ background: "rgba(40,200,120,0.15)", border: "0.5px solid #28c878" }}
          >
            <div className="w-[11px] h-[11px] rounded-full bg-[#28c878] shrink-0" />
            <span className="text-[14px] font-medium text-text-primary">Confidence</span>
            <span className="text-[14px] font-medium uppercase text-[#28c878]">High</span>
          </div>
        </div>

        {/* Action buttons — all solid orange */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-2 h-[35px] px-4 rounded-[8px] text-white text-[14px] font-semibold tracking-[-0.14px]"
            style={{ background: ACCENT }}
          >
            <RefreshCw size={14} />
            Re-run
          </button>
          <button
            type="button"
            className="flex items-center h-[35px] px-4 rounded-[8px] text-white text-[14px] font-semibold tracking-[-0.14px]"
            style={{ background: ACCENT }}
          >
            Export PDF
          </button>
          <button
            type="button"
            className="flex items-center h-[35px] px-4 rounded-[8px] text-white text-[14px] font-semibold tracking-[-0.14px]"
            style={{ background: ACCENT }}
          >
            New session
          </button>
        </div>
      </div>
      </div>
      {/* Scrollable content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-[1016px] mx-auto px-6 pb-12 space-y-5">

          {/* Hero card */}
          <div>
            {/* Title bar */}
            <div
              className="px-[39px] flex items-center rounded-tl-[11px] rounded-tr-[11px] h-[81px]"
              style={{ background: "#1e1c1a", border: "0.5px solid #333230" }}
            >
              <h1 className="font-serif font-bold text-[20px] text-text-primary tracking-[-0.2px]">
                {query}
              </h1>
            </div>

            {/* Summary block */}
            <div
              style={{
                background: "#252220",
                borderLeft: "0.5px solid #333230",
                borderRight: "0.5px solid #333230",
                borderBottom: "0.5px solid #333230",
                borderBottomLeftRadius: "11px",
                borderBottomRightRadius: "11px",
              }}
            >
              <div className="px-[54px] pt-[42px] pb-6">
                <p className="font-serif text-[24px] text-text-primary leading-[44px] tracking-[-0.24px]">
                  The Polymarket &ldquo;US recession by Q4 2026&rdquo; contract is likely overpriced at
                  34% YES. Market probability of formal NBER resolution within the contract window is
                  low even under recessionary conditions — true implied recession probability is
                  approximately 48–54%, but contract resolution probability is 18–26%.
                </p>
              </div>

              {/* Meta rows */}
              <div
                className="px-[139px] py-4 flex flex-col gap-1"
                style={{
                  background: "#1e1c1a",
                  borderTop: "0.5px solid #333230",
                  borderBottomLeftRadius: "11px",
                  borderBottomRightRadius: "11px",
                }}
              >
                <div className="flex items-center gap-[35px] text-[16px] text-text-secondary">
                  {[
                    ["Platform", "Polymarket"],
                    ["Agents", "6 • 1 flag raised • resolved"],
                    ["Depth", "Standard • 3 phases"],
                  ].map(([label, value]) => (
                    <span key={label} className="whitespace-nowrap">
                      <span className="font-serif font-bold" style={{ color: ACCENT }}>{label}</span>
                      {" "}
                      <span className="italic">{value}</span>
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-[28px] text-[16px] text-text-secondary">
                  {[
                    ["Runtime", "15m 33s"],
                    ["Evidence sourced", "April 1, 2026 21:02 PST"],
                    ["Credits", "1 used • 0 refunded"],
                  ].map(([label, value]) => (
                    <span key={label} className="whitespace-nowrap">
                      <span className="font-serif font-bold" style={{ color: ACCENT }}>{label}</span>
                      {"  "}
                      <span className="italic">{value}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-[13px]">
            {TABS.map((tab, i) => {
              const active = activeTab === i;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(i)}
                  className="px-4 h-[32px] rounded-[8px] text-[14px] font-semibold tracking-[-0.14px] transition-all"
                  style={
                    active
                      ? { background: ACCENT, color: "#f7f6f2" }
                      : { background: "transparent", color: ACCENT, border: `1px solid ${ACCENT}` }
                  }
                >
                  {tab}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          {activeTab === 0 && (
            <>
              <ClaimsSection
                title="Supporting claims"
                number="1"
                countLabel="3 claims"
                claims={SUPPORTING_CLAIMS}
              />
              <ClaimsSection
                title="Contested Terrain"
                number="2"
                countLabel="2 disputes"
                claims={CONTESTED}
              />
            </>
          )}

          {activeTab > 0 && (
            <div
              className="rounded-[11px] px-8 py-14 text-center"
              style={{ background: "#252220", border: "0.5px solid #333230" }}
            >
              <p className="text-text-disabled text-[14px]">{TABS[activeTab]} will appear here.</p>
            </div>
          )}

          {/* Divider + Suggested follow-on sessions */}
          <div style={{ borderTop: "0.5px solid #333230" }} className="pt-6 space-y-4">
            <p className="font-semibold text-[18px] text-text-secondary">Suggested follow-on sessions</p>
            <div className="grid grid-cols-2 gap-4">
              {FOLLOW_ONS.map((item, i) => (
                <div
                  key={i}
                  className="rounded-[11px] px-[25px] py-5 flex flex-col gap-3"
                  style={{
                    background: "#252220",
                    border: `0.5px solid ${item.highlighted ? ACCENT : "#333230"}`,
                    cursor: "pointer",
                  }}
                >
                  <p className="text-[14px]" style={{ color: ACCENT }}>{item.priority}</p>
                  <p className="text-text-primary text-[16px] leading-[27px] flex-1">{item.question}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-text-secondary text-[14px]">{item.meta}</span>
                    <button
                      type="button"
                      className="flex items-center gap-1 text-[14px]"
                      style={{ color: ACCENT }}
                    >
                      Start session <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function ReportPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-primary flex items-center justify-center">
          <div
            className="w-8 h-8 rounded-full border-2 animate-spin"
            style={{ borderColor: `${ACCENT} transparent transparent transparent` }}
          />
        </div>
      }
    >
      <ReportContent />
    </Suspense>
  );
}
