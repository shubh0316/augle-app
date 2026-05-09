"use client";
import dynamic from "next/dynamic";
import animationData from "../../public/loading-animation.json";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

export default function LoadingScreen() {
  return (
    <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-6">
      {/* Lottie animation */}
      <div className="w-[120px] h-[120px]">
        <Lottie
          animationData={animationData}
          loop
          autoplay
          style={{ width: "100%", height: "100%" }}
        />
      </div>

      {/* Caption */}
      <p className="text-text-primary text-[17px] font-serif font-semibold tracking-tight">
        Hang tight. We&apos;re building your report.
      </p>

      {/* Did you know card */}
      <div className="border border-border-primary rounded-2xl px-6 py-5 w-[340px] mt-1">
        <p className="text-accent text-[13px] font-bold mb-2">Did you know?</p>
        <p className="text-text-primary text-[14px] leading-relaxed mb-4">
          70% of Polymarket Traders Lost Money as Top 0.04% Captured Most Profit.
        </p>
        {/* Yahoo Finance source chip */}
        <div className="flex justify-end">
          <div className="flex items-center gap-2 bg-[#6001D2] rounded-lg px-3 py-1.5">
            {/* Yahoo Finance "Y!" icon approximation */}
            <div className="w-[18px] h-[18px] rounded-sm flex items-center justify-center shrink-0">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect width="18" height="18" rx="3" fill="#6001D2"/>
                <text x="2" y="14" fontSize="11" fontWeight="bold" fill="white" fontFamily="serif">Y!</text>
              </svg>
            </div>
            <span className="text-text-primary text-[12px] font-semibold">Yahoo Finance</span>
          </div>
        </div>
      </div>
    </main>
  );
}
