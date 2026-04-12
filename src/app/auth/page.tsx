"use client";
import { useState } from "react";
import Navbar from "@/components/Navbar";
import AuthModal from "@/components/AuthModal";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  return (
    <>
      <Navbar isLoggedIn={false} />
      <main className="min-h-screen flex items-center justify-center pt-[69px] px-4">
        <AuthModal onClose={() => router.push("/")} />
      </main>
    </>
  );
}
