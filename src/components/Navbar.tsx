"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

function HamburgerIcon() {
  return (
    <div className="flex flex-col gap-[5px] items-start w-[18px]">
      <span className="block h-[2px] w-[18px] rounded-full bg-[#8B8078]" />
      <span className="block h-[2px] w-[13px] rounded-full bg-[#8B8078]" />
      <span className="block h-[2px] w-[9px] rounded-full bg-[#8B8078]" />
    </div>
  );
}

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const isProfile = pathname === "/account";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[69px] bg-[#171614] border-b border-border-muted/50 flex items-center justify-between px-[29px]">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/auth-logo.png" alt="Augle" width={107} height={30} priority />
      </Link>
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
<Link
              href="/account"
              className={`w-[39px] h-[39px] rounded-full flex items-center justify-center ${isProfile ? "bg-accent" : "bg-[#434341]"}`}
            >
              <span className={`text-sm font-semibold ${isProfile ? "text-text-primary" : "text-[#8B8078]"}`}>C</span>
            </Link>
            <button type="button" aria-label="Menu" className="w-[39px] h-[39px] rounded-lg bg-[#434341] flex items-center justify-center cursor-pointer">
              <HamburgerIcon />
            </button>
          </>
        ) : (
          <Link href="/auth" className="text-accent text-sm font-medium tracking-tight hover:text-accent-hover transition-colors">
            Create account / Login
          </Link>
        )}
      </div>
    </nav>
  );
}
