"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import { X, CreditCard, ArrowUpRight, ReceiptText, Undo2, ChevronRight } from "lucide-react";

const creditPacks = [
  { credits: 10, price: "$2.00", perCredit: "$0.20 / credit" },
  { credits: 30, price: "$5.40", perCredit: "$0.18 / credit", bestValue: true },
  { credits: 50, price: "$8.00", perCredit: "$0.16 / credit" },
];

const transactions = [
  { type: "purchase", desc: "30 credits purchased", amount: "+30", date: "Apr 7, 2026 · 09:14 PST", icon: "credit" },
  { type: "session", desc: "Standard session · Will the US Enter a Recession by Q4 2026?", amount: "-3", date: "Apr 7, 2026 · 08:47 PST", icon: "receipt" },
  { type: "refund", desc: "Refund · Insufficient evidence · Rapid session", amount: "+1", date: "Apr 7, 2026 · 09:14 PST", icon: "refund" },
  { type: "session", desc: "Deep session · Will Bitcoin Surpass $200,000 before Dec 2026?", amount: "-3", date: "Apr 7, 2026 · 08:47 PST", icon: "receipt" },
];

export default function AccountPage() {
  const [password] = useState("••••••••••••••");

  return (
    <>
      <Navbar isLoggedIn={true} />
      <main className="min-h-screen pt-[85px] pb-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-[1016px]">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-text-primary text-xl font-medium">Account</h1>
            <button className="w-10 h-10 rounded-full border border-border-input/50 flex items-center justify-center hover:bg-bg-input transition-colors">
              <X size={16} className="text-text-muted" />
            </button>
          </div>

          {/* PROFILE */}
          <section className="mb-10 animate-fade-in">
            <h2 className="text-text-primary text-sm tracking-widest mb-3">PROFILE</h2>
            <div className="border-t border-border-primary mb-6" />
            <div className="w-[67px] h-[67px] rounded-full bg-bg-card flex items-center justify-center mb-6">
              <span className="text-text-primary text-xl">C</span>
            </div>
            <label className="block text-text-primary text-sm mb-2">Display name</label>
            <input type="text" defaultValue="Cory Kelly" className="w-full bg-bg-input border border-border-input/50 rounded-xl px-4 h-[53px] text-text-primary text-base font-medium outline-none focus:border-accent transition-colors mb-4" />
            <label className="block text-text-primary text-sm mb-2">Email</label>
            <input type="email" defaultValue="cory@augle.ai" className="w-full bg-bg-input border border-border-input/50 rounded-xl px-4 h-[53px] text-text-primary text-base font-medium outline-none focus:border-accent transition-colors mb-1" />
            <p className="text-text-muted text-sm mb-4">Used for sign-in and session notifications.</p>
            <label className="block text-text-primary text-sm mb-2">Password</label>
            <input type="password" defaultValue={password} className="w-full bg-bg-input border border-border-input/50 rounded-xl px-4 h-[53px] text-text-primary text-base font-medium outline-none focus:border-accent transition-colors mb-2" />
            <button className="text-accent text-sm font-medium flex items-center gap-1 hover:text-accent-hover transition-colors mb-6">
              Change password <ChevronRight size={16} />
            </button>
            <button className="bg-accent hover:bg-accent-hover transition-colors text-white font-medium text-base px-8 py-3 rounded-lg">
              Save changes
            </button>
          </section>

          {/* CREDITS */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.1s", opacity: 0 }}>
            <h2 className="text-text-primary text-sm tracking-widest mb-3">CREDITS</h2>
            <div className="border-t border-border-primary mb-6" />
            <div className="bg-bg-card border border-[#49443f] rounded-[14px] p-8 mb-6">
              <p className="text-text-primary text-sm tracking-widest mb-4">CURRENT BALANCE</p>
              <div className="flex items-end justify-between">
                <div>
                  <span className="text-text-primary text-[40px] font-medium leading-none">12</span>
                  <span className="text-text-secondary text-sm ml-2">credits</span>
                </div>
                <div className="text-right">
                  <p className="text-text-secondary text-sm">≈ $2.40 value</p>
                  <p className="text-text-secondary text-sm">4 Standard sessions</p>
                </div>
              </div>
            </div>

            {/* Credit packs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {creditPacks.map((pack, i) => (
                <div key={i} className={`relative bg-bg-card border border-[#49443f] rounded-[14px] p-7 text-center`}>
                  {pack.bestValue && (
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-accent rounded-b-[5px] px-4 py-1">
                      <span className="text-text-primary text-xs font-semibold">Best Value</span>
                    </div>
                  )}
                  <p className="text-text-primary text-[40px] font-medium leading-none mt-4">{pack.credits}</p>
                  <p className="text-text-secondary text-sm mt-1">credits</p>
                  <p className="text-text-primary text-sm mt-6">{pack.price}</p>
                  <p className="text-text-secondary text-sm">{pack.perCredit}</p>
                  <button className="w-full bg-accent hover:bg-accent-hover transition-colors text-white font-medium py-3 rounded-lg mt-6">Buy</button>
                </div>
              ))}
            </div>
            <p className="text-text-muted text-xs text-right">Credits never expire. Unused credits carry over indefinitely.</p>
          </section>

          {/* TRANSACTION HISTORY */}
          <section className="mb-10 animate-fade-in" style={{ animationDelay: "0.2s", opacity: 0 }}>
            <h2 className="text-text-primary text-sm tracking-widest mb-3">TRANSACTION HISTORY</h2>
            <div className="border-t border-border-primary mb-4" />
            <div className="bg-bg-card border border-[#49443f] rounded-[14px] overflow-hidden">
              {transactions.map((tx, i) => (
                <div key={i} className={`flex items-center gap-4 px-6 py-4 ${i > 0 ? "border-t border-border-primary" : ""}`}>
                  <div className="w-[49px] h-[49px] rounded-[8px] bg-bg-input flex items-center justify-center shrink-0">
                    {tx.icon === "credit" && <CreditCard size={20} className="text-text-muted" />}
                    {tx.icon === "receipt" && <ReceiptText size={20} className="text-text-muted" />}
                    {tx.icon === "refund" && <Undo2 size={20} className="text-text-muted" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-text-primary text-sm truncate">{tx.desc}</p>
                    <p className="text-text-muted text-sm">{tx.date}</p>
                  </div>
                  <span className={`text-sm font-medium shrink-0 ${tx.amount.startsWith("+") ? "text-success" : "text-accent"}`}>{tx.amount}</span>
                </div>
              ))}
            </div>
          </section>

          {/* DELETE ACCOUNT */}
          <section className="animate-fade-in" style={{ animationDelay: "0.3s", opacity: 0 }}>
            <h2 className="text-text-primary text-sm tracking-widest mb-3">ACCOUNT</h2>
            <div className="border-t border-border-primary mb-6" />
            <div className="bg-bg-card border border-[#49443f] rounded-[14px] p-8">
              <p className="text-text-primary text-sm font-medium mb-1">Delete account</p>
              <p className="text-text-secondary text-sm mb-6">Permanently deletes your account, all session history, and any unused credits. This action cannot be undone.</p>
              <button className="bg-red-900/30 border border-red-800/50 text-red-400 font-medium text-sm px-6 py-3 rounded-lg hover:bg-red-900/50 transition-colors">
                Delete my account
              </button>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
