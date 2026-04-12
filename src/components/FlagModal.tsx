"use client";
import { X, Shield, Timer } from "lucide-react";

interface FlagModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FlagModal({ isOpen, onClose }: FlagModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-[rgba(23,22,20,0.92)]" onClick={onClose} />
      <div className="relative bg-bg-card border border-border-primary/50 rounded-[20px] w-[768px] max-w-full max-h-[90vh] overflow-auto shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="px-8 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded bg-accent-bg border border-accent/50">
              <span className="text-accent text-sm">Moderate flag</span>
            </div>
            <div className="flex items-center gap-2 bg-bg-secondary border border-border-primary/50 rounded px-3 h-[30px]">
              <Timer size={14} className="text-text-disabled" />
              <span className="text-text-disabled text-sm">Interject phase</span>
              <span className="text-text-disabled text-sm font-mono tracking-tighter">0:00</span>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full border border-text-muted/50 flex items-center justify-center hover:bg-bg-input transition-colors">
            <X size={16} className="text-text-muted" />
          </button>
        </div>

        {/* Guardian notice */}
        <div className="px-8 py-4">
          <div className="flex items-center gap-2 mb-3">
            <Shield size={18} className="text-accent" />
            <span className="font-serif font-bold text-base text-text-primary">Guardian</span>
          </div>
          <p className="text-text-primary text-sm leading-relaxed mb-4">
            The guardian is responsible for ensuring the deliberation doesn&apos;t derail and raises flags when bias, unverified sources, or other compromises are detected.
          </p>
          <p className="text-text-primary text-sm leading-relaxed mb-4">
            The following was flagged due to a bias conflict between the Methodologist and the Cartographer. You may interject to ask a question or make a supporting claim.
          </p>
        </div>

        {/* Flagged content */}
        <div className="mx-8 bg-bg-secondary border border-border-primary/50 rounded-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center">
              <span className="text-xs">⚙️</span>
            </div>
            <h3 className="font-serif font-bold text-base text-accent">Methodologist</h3>
          </div>
          <p className="text-text-primary text-sm leading-relaxed pl-11">
            This is a sample text I am using to fill the content for this argument. It is only an example of what the content would appear like when actual text is used.
          </p>
          <p className="text-text-primary text-sm leading-relaxed pl-11 mt-3">
            This part will have a scroll, so the user can view the full content.
          </p>
        </div>

        {/* Input */}
        <div className="px-8 pb-4">
          <div className="bg-bg-input border border-border-input/50 rounded-xl p-4">
            <textarea placeholder="Start typing" className="w-full bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none resize-none h-[60px]" />
            <div className="flex justify-end">
              <button className="w-8 h-8 rounded-lg bg-bg-card flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-muted"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
              </button>
            </div>
          </div>
          <p className="text-text-muted text-sm mt-2">Providing a source strengthens approval with the Guardian.</p>
        </div>
      </div>
    </div>
  );
}
