"use client";
import { Search, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar({ placeholder = "Find a Polymarket or Kalshi contract", compact = false }: { placeholder?: string; compact?: boolean }) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/session/setup?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className={`flex w-full ${compact ? "max-w-[932px]" : "max-w-[726px]"}`}>
      <div className="flex-1 bg-bg-input border border-border-input/50 rounded-l-lg flex items-center gap-3 px-4 h-[53px]">
        <Search size={20} className="text-text-dim shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-text-primary text-base placeholder:text-text-dim outline-none font-normal"
        />
      </div>
      <button type="submit" className="w-[53px] h-[53px] bg-accent rounded-r-lg flex items-center justify-center hover:bg-accent-hover transition-colors shrink-0">
        <ArrowUp size={20} className="text-white" />
      </button>
    </form>
  );
}
