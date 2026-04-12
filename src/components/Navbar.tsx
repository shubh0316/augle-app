"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

const AugleLogo = () => (
  <svg width="107" height="30" viewBox="0 0 107 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    <text x="28" y="24" fontFamily="Libre Baskerville" fontWeight="700" fontSize="20" fill="#f7f6f2" letterSpacing="-0.2">Augle</text>
    <circle cx="12" cy="15" r="10" fill="#c15f3c" opacity="0.9"/>
    <path d="M12 5 L18 12 L12 25 L6 12Z" fill="#171613" opacity="0.3"/>
    <circle cx="12" cy="13" r="4" stroke="#171613" strokeWidth="1" fill="none" opacity="0.4"/>
  </svg>
);

export default function Navbar({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-[69px] bg-[#171614] border-b border-border-muted/50 flex items-center justify-between px-[29px]">
      <Link href="/" className="flex items-center gap-2">
        <AugleLogo />
      </Link>
      <div className="flex items-center gap-3">
        {isLoggedIn ? (
          <>
            <div className="flex items-center h-[39px] rounded-lg overflow-hidden">
              <div className="bg-bg-secondary border border-border-input/50 rounded-l-lg px-4 h-full flex items-center">
                <span className="text-text-primary text-sm font-normal">Credits</span>
              </div>
              <div className="bg-accent border border-border-input/50 rounded-r-lg px-3 h-full flex items-center">
                <span className="text-text-primary text-sm font-semibold">12</span>
              </div>
            </div>
            <Link href="/account" className="w-[39px] h-[39px] rounded-full bg-accent flex items-center justify-center">
              <span className="text-text-primary text-sm font-semibold">C</span>
            </Link>
            <button className="w-[39px] h-[39px] rounded-lg bg-bg-secondary border border-border-input/50 flex items-center justify-center">
              <Menu size={20} className="text-text-primary" />
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
