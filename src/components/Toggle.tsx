"use client";

interface ToggleProps {
  options: string[];
  active: number;
  onChange: (index: number) => void;
  size?: "sm" | "md";
  variant?: "pill" | "rounded";
}

export default function Toggle({ options, active, onChange, size = "md", variant = "pill" }: ToggleProps) {
  return (
    <div className={`bg-bg-input border border-border-input/50 flex items-center p-1 ${variant === "pill" ? "rounded-full" : "rounded-xl"}`}>
      {options.map((opt, i) => (
        <button
          key={opt}
          onClick={() => onChange(i)}
          className={`flex-1 flex items-center justify-center transition-all font-sans tracking-tight whitespace-nowrap
            ${size === "sm" ? "h-8 px-4 text-sm" : "h-8 px-4 text-sm"}
            ${i === active
              ? `bg-accent text-text-primary font-semibold shadow-lg ${variant === "pill" ? "rounded-full" : "rounded-lg"}`
              : "text-text-muted font-medium"
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
