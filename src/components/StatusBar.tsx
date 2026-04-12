"use client";
import { Timer } from "lucide-react";

export default function StatusBar() {
  return (
    <div className="flex items-center gap-4">
      <div className="bg-accent-bg border border-accent/50 rounded px-4 h-[30px] flex items-center">
        <span className="text-accent text-sm">Confidence •••</span>
      </div>
      <div className="border border-border-secondary/50 rounded px-4 h-[30px] flex items-center">
        <span className="text-text-disabled text-sm">0 Flags</span>
      </div>
      <div className="bg-bg-secondary border border-border-primary/50 rounded px-4 h-[30px] flex items-center">
        <span className="text-text-disabled text-sm">Session paused</span>
      </div>
      <div className="bg-bg-secondary border border-border-primary/50 rounded px-3 h-[30px] flex items-center gap-2">
        <Timer size={14} className="text-text-disabled" />
        <span className="text-text-disabled text-sm">Interject phase</span>
        <span className="text-text-disabled text-sm font-mono tracking-tighter">0:00</span>
      </div>
    </div>
  );
}
