"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import OTPModal from "@/components/OTPModal";

function OTPContent() {
  const params = useSearchParams();
  const router = useRouter();
  const email = params.get("email") ?? "";

  return (
    <>
      <Navbar isLoggedIn={false} />
      <main className="min-h-screen flex items-center justify-center pt-[69px] px-4">
        <OTPModal email={email} onClose={() => router.push("/")} />
      </main>
    </>
  );
}

export default function OTPPage() {
  return (
    <Suspense>
      <OTPContent />
    </Suspense>
  );
}
