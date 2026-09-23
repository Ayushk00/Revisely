"use client";

import { History, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const appLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history", label: "History", icon: History },
];

export default function Navbar() {
  const router = useRouter();
  const path = usePathname();

  const [manualLoggedIn, setManualLoggedIn] = useState(false);
  const [hasMcqs, setHasMcqs] = useState(false);

  useEffect(() => {
    setManualLoggedIn(Boolean(localStorage.getItem("email")));
    setHasMcqs(Boolean(localStorage.getItem("mcqs")));
  }, [path]);

  const handleLogout = async () => {
    await fetch("/api/logout", { method: "POST" });
    localStorage.removeItem("email");
    localStorage.removeItem("mcqs");
    setManualLoggedIn(false);
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={manualLoggedIn ? "/dashboard" : "/"}
          className="flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
          aria-label="Revisely home"
        >
          <Logo className="h-8 w-8" />
          <span className="text-lg font-bold tracking-tight text-slate-900">Revisely</span>
        </Link>

        {manualLoggedIn ? (
          // hide navigation while a quiz is in progress (mcqs in localStorage)
          hasMcqs ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-brand-500" />
              Quiz in progress
            </span>
          ) : (
            <div className="flex items-center gap-1">
              {appLinks.map(({ href, label, icon: Icon }) => {
                const active = path === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                      active
                        ? "bg-brand-50 text-brand-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </Link>
                );
              })}
              <span className="mx-1 h-6 w-px bg-slate-200" aria-hidden="true" />
              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </div>
          )
        ) : (
          <div className="flex items-center gap-2">
            {path !== "/login" && (
              <Link href="/login" className="btn-ghost">
                Sign in
              </Link>
            )}
            {path !== "/signup" && (
              <Link href="/signup" className="btn-primary px-4 py-2 text-sm">
                Get started
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
