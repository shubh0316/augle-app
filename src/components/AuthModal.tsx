"use client";
import { useState } from "react";
import { X, Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/");
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-[rgba(23,22,20,0.92)]" onClick={onClose} />
      <div className="relative bg-bg-card border border-[#454543]/50 rounded-[20px] w-[688px] max-w-[95vw] max-h-[90vh] overflow-auto shadow-2xl animate-slide-up">
        {/* Close button */}
        <button onClick={onClose} className="absolute top-5 right-5 w-10 h-10 rounded-full border border-text-muted/50 flex items-center justify-center hover:bg-bg-input transition-colors z-10">
          <X size={16} className="text-text-muted" />
        </button>

        <div className="px-[92px] py-12">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <svg width="200" height="60" viewBox="0 0 200 60" fill="none">
              <text x="55" y="45" fontFamily="Libre Baskerville" fontWeight="700" fontSize="36" fill="#c15f3c">Augle</text>
              <circle cx="25" cy="30" r="20" fill="#c15f3c" opacity="0.9"/>
              <path d="M25 10 L36 24 L25 50 L14 24Z" fill="#171613" opacity="0.3"/>
              <circle cx="25" cy="26" r="8" stroke="#171613" strokeWidth="1.5" fill="none" opacity="0.4"/>
            </svg>
          </div>

          {/* Toggle */}
          <div className="bg-bg-input border border-border-input/50 rounded-xl flex p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2 rounded-[10px] text-base font-semibold text-center transition-all ${mode === "login" ? "bg-accent text-text-primary shadow" : "text-text-muted"}`}
            >Login</button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-[10px] text-base font-semibold text-center transition-all ${mode === "signup" ? "bg-accent text-text-primary shadow" : "text-text-muted"}`}
            >Create account</button>
          </div>

          {/* Google */}
          <button className="w-full h-[52px] rounded-xl border border-border-input/50 flex items-center justify-center gap-4 hover:bg-bg-input transition-colors mb-4">
            <svg width="24" height="24" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            <span className="text-text-primary text-base font-semibold">Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-5 mb-4">
            <div className="flex-1 h-px bg-border-input" />
            <span className="text-border-input text-xs font-medium">OR</span>
            <div className="flex-1 h-px bg-border-input" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {mode === "signup" && (
              <div className="bg-bg-input border border-border-input/50 rounded-xl flex items-center gap-3 px-4 h-[53px]">
                <User size={20} className="text-text-muted shrink-0" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Display name" className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none font-medium" />
              </div>
            )}
            <div className="bg-bg-input border border-border-input/50 rounded-xl flex items-center gap-3 px-4 h-[53px]">
              <Mail size={20} className="text-text-muted shrink-0" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none font-medium" />
            </div>
            <div>
              <div className="bg-bg-input border border-border-input/50 rounded-xl flex items-center gap-3 px-4 h-[53px]">
                <Lock size={20} className="text-text-muted shrink-0" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none font-medium" />
              </div>
              {mode === "login" && (
                <button type="button" className="text-accent text-sm font-medium mt-2 hover:text-accent-hover transition-colors">Forgot password?</button>
              )}
            </div>
            {mode === "signup" && (
              <>
                <div className="bg-bg-input border border-border-input/50 rounded-xl flex items-center gap-3 px-4 h-[53px]">
                  <Lock size={20} className="text-text-muted shrink-0" />
                  <input type="password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} placeholder="Repeat Password" className="flex-1 bg-transparent text-text-primary placeholder:text-text-muted text-base outline-none font-medium" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div className={`w-[22px] h-[22px] rounded border ${agreed ? "bg-accent border-accent" : "border-border-input"} flex items-center justify-center transition-colors`} onClick={() => setAgreed(!agreed)}>
                    {agreed && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="white" strokeWidth="2" fill="none"/></svg>}
                  </div>
                  <span className="text-text-muted text-sm">By signing up you are agreeing to the <span className="text-accent">Terms & Conditions</span> and <span className="text-accent">Privacy Policy</span>.</span>
                </label>
              </>
            )}
            <button type="submit" className="w-full h-[52px] bg-accent rounded-xl text-text-primary text-base font-semibold hover:bg-accent-hover transition-colors mt-2">
              {mode === "login" ? "Login" : "Sign up"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
