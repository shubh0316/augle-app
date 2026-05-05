"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const RESEND_SECONDS = 60;

export default function OTPModal({ email, onClose }: { email: string; onClose: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) { setCanResend(true); return; }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const handleResend = () => {
    setDigits(Array(6).fill(""));
    setSecondsLeft(RESEND_SECONDS);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 0);
  };

  const handleChange = useCallback((index: number, value: string) => {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 5) inputRefs.current[index + 1]?.focus();
    if (next.every((d) => d !== "") && next.join("").length === 6) {
      router.push("/");
    }
  }, [digits, router]);

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...digits];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIdx = Math.min(pasted.length, 5);
    inputRefs.current[focusIdx]?.focus();
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_m, a, _b, c) => `${a}****${c}`)
    : "[email]";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-[rgba(23,22,20,0.92)]" onClick={onClose} />
      <div className="relative bg-bg-card border border-[#454543]/50 rounded-[20px] w-[490px] max-w-[95vw] shadow-2xl animate-slide-up">
        {/* Close */}
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full border border-text-muted/50 flex items-center justify-center hover:bg-bg-input transition-colors z-10"
        >
          <X size={16} className="text-text-muted" />
        </button>

        <div className="px-16 py-12">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image src="/auth-logo.png" alt="Augle" width={160} height={48} priority />
          </div>

          {/* Description */}
          <p className="text-text-primary text-sm text-center mb-7 leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-semibold">{maskedEmail}</span>. Enter it below to continue.
          </p>

          {/* OTP inputs */}
          <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
            {digits.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-[52px] h-[52px] rounded-xl text-center text-xl font-semibold text-text-primary bg-bg-input outline-none transition-all
                  ${digit
                    ? "border-2 border-accent"
                    : "border border-border-input/60 focus:border-accent focus:border-2"
                  }`}
              />
            ))}
          </div>

          {/* Resend */}
          <div className="text-center">
            {canResend ? (
              <button
                type="button"
                onClick={handleResend}
                className="text-accent text-sm font-medium hover:text-accent-hover transition-colors"
              >
                Resend code
              </button>
            ) : (
              <span className="text-accent text-sm font-medium">
                Resending code in {String(secondsLeft).padStart(2, "0")}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
