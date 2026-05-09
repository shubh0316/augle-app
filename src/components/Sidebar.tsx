"use client";
import { useState } from "react";
import { Search, ChevronDown, X } from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const activeSessions = [
  "Will the US Enter a Recession by Q4 2026?",
  "Will Bitcoin Surpass $200,000 before Dec...",
  "Will the US Enter a Recession by Q4 2026?",
];

const historySessions = Array(12).fill(null).map((_, i) =>
  i % 2 === 0 ? "Will the US Enter a Recession by Q4 2026?" : "Will Bitcoin Surpass $200,000 before Dec..."
);

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />}
      <div className={`fixed top-[69px] right-0 bottom-0 w-[402px] bg-bg-card border-l border-border-primary z-50 transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="h-full overflow-y-auto p-5">
          {/* New session button */}
          <button className="w-full bg-accent hover:bg-accent-hover transition-colors text-text-primary font-medium py-3.5 rounded-lg mb-6">
            New session
          </button>

          {/* Active */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[26px] h-[26px] rounded bg-accent-bg flex items-center justify-center">
              <span className="text-accent text-xs font-semibold">3</span>
            </div>
            <span className="text-text-primary text-base font-semibold">Active</span>
          </div>
          <div className="space-y-1 mb-6">
            {activeSessions.map((s, i) => (
              <div key={i} className="flex items-center gap-2 px-2 py-2 rounded hover:bg-bg-input transition-colors cursor-pointer group">
                {i === 0 && <div className="w-[22px] h-[22px] rounded bg-bg-input flex items-center justify-center shrink-0"><span className="text-text-muted text-xs">📊</span></div>}
                {i > 0 && <div className="w-[22px] h-[22px] rounded bg-bg-input shrink-0" />}
                <span className="text-text-primary text-sm truncate">{s}</span>
              </div>
            ))}
          </div>

          {/* Separator */}
          <div className="border-t border-border-primary mb-4" />

          {/* Session history */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-[26px] h-[26px] rounded bg-bg-input flex items-center justify-center">
              <span className="text-text-muted text-xs font-semibold">9</span>
            </div>
            <span className="text-text-primary text-base font-semibold">Session history</span>
          </div>

          {/* Search */}
          <div className="bg-bg-input border border-border-input/50 rounded-xl flex items-center px-4 h-[43px] mb-3">
            <Search size={16} className="text-text-muted mr-2" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search history" className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-sm outline-none" />
          </div>

          {/* Filters */}
          <div className="space-y-2 mb-4">
            {["Category", "Depth", "Confidence"].map((filter) => (
              <div key={filter} className="bg-bg-input border border-border-input/50 rounded-xl flex items-center justify-between px-4 h-[43px] cursor-pointer hover:border-accent/30 transition-colors">
                <span className="text-text-primary text-sm">{filter}</span>
                <ChevronDown size={16} className="text-text-muted" />
              </div>
            ))}
          </div>

          {/* History list */}
          <div className="space-y-0.5">
            {historySessions.map((s, i) => (
              <div key={i} className="px-2 py-2 rounded hover:bg-bg-input transition-colors cursor-pointer">
                <span className="text-text-primary text-sm truncate block">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
