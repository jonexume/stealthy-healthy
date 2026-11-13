"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageShellProps {
  title?: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
  headerRight?: React.ReactNode;
  /** Hides the header entirely */
  noHeader?: boolean;
  /** Hides the bottom nav */
  noNav?: boolean;
}

const navItems = [
  { href: "/home",    label: "Home",    icon: "🏠" },
  { href: "/history", label: "History", icon: "📊" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function PageShell({
  title,
  backHref,
  backLabel = "Back",
  children,
  headerRight,
  noHeader = false,
  noNav = false,
}: PageShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 max-w-md mx-auto relative">
      {/* ── Header ── */}
      {!noHeader && (
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          {backHref && (
            <Link
              href={backHref}
              aria-label={backLabel}
              className="flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          )}
          {title && (
            <h1 className="flex-1 text-lg font-bold text-slate-900 truncate">{title}</h1>
          )}
          {headerRight && <div className="ml-auto">{headerRight}</div>}
        </header>
      )}

      {/* ── Main content ── */}
      <main className={["flex-1 overflow-y-auto", !noNav ? "pb-24" : ""].join(" ")}>
        {children}
      </main>

      {/* ── Bottom navigation ── */}
      {!noNav && (
        <nav
          aria-label="Main navigation"
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t border-slate-200 z-30"
        >
          <ul className="flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <li key={item.href} className="flex-1">
                  <Link
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "flex flex-col items-center justify-center gap-0.5 py-3",
                      "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500 focus-visible:outline-none",
                      "transition-colors",
                      isActive ? "text-teal-600" : "text-slate-500 hover:text-teal-600",
                    ].join(" ")}
                  >
                    <span className="text-xl" aria-hidden="true">{item.icon}</span>
                    <span className={["text-xs font-medium", isActive ? "font-bold" : ""].join(" ")}>
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 w-6 h-0.5 bg-teal-600 rounded-full" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </div>
  );
}
