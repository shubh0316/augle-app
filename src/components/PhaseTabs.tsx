"use client";

const phases = ["Exploration", "Deliberation", "Synthesis", "Conclusion"];

export default function PhaseTabs({ activePhase = 0 }: { activePhase?: number }) {
  return (
    <div className="flex w-full rounded-b-[10px] overflow-hidden">
      {phases.map((phase, i) => (
        <div
          key={phase}
          className={`flex-1 h-[40px] flex items-center justify-center text-sm tracking-tight transition-all
            ${i === activePhase
              ? "bg-accent text-white font-bold"
              : "bg-bg-secondary border-b border-l border-border-secondary/50 text-text-disabled font-medium"
            }
            ${i === 0 ? "rounded-bl-[10px]" : ""}
            ${i === phases.length - 1 ? "rounded-br-[10px] border-r border-border-secondary/50" : ""}`}
        >
          {phase}
        </div>
      ))}
    </div>
  );
}
