"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import Card from "../components/ui/Card";
import PageShell from "../components/ui/PageShell";

const actions = [
  {
    href: "/search",
    icon: "🔍",
    title: "Search Health Topics",
    description: "Browse reviewed articles on symptoms, conditions, and care",
    color: "from-teal-50 to-teal-100 border-teal-200",
    iconBg: "bg-teal-500",
  },
  {
    href: "/temperature",
    icon: "🌡️",
    title: "Log Temperature",
    description: "Record a reading with method, timestamp, and notes",
    color: "from-blue-50 to-blue-100 border-blue-200",
    iconBg: "bg-blue-500",
  },
  {
    href: "/symptoms",
    icon: "📋",
    title: "Check Symptoms",
    description: "Step-by-step symptom intake with supportive guidance",
    color: "from-purple-50 to-purple-100 border-purple-200",
    iconBg: "bg-purple-500",
  },
];

const quickLinks = [
  { href: "/care", icon: "🏥", label: "Find Care" },
  { href: "/history", icon: "📊", label: "History" },
  { href: "/profile", icon: "👤", label: "Profile" },
  { href: "/admin", icon: "🛡️", label: "Admin" },
];

export default function HomePage() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <PageShell noHeader noNav={false}>
      {/* ── Custom header ── */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" aria-label="Stealthy Healthy home">
            <Logo size={40} />
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/profile"
              aria-label="Profile"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors"
            >
              <span className="text-xl" aria-hidden="true">👤</span>
            </Link>
            <Link
              href="/privacy"
              aria-label="Privacy settings"
              className="w-10 h-10 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors"
            >
              <span className="text-xl" aria-hidden="true">🔒</span>
            </Link>
          </div>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="px-4 pb-3" role="search">
          <label htmlFor="main-search" className="sr-only">
            Search health topics
          </label>
          <div className="relative">
            <span
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              aria-hidden="true"
            >
              🔍
            </span>
            <input
              id="main-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search health topics…"
              autoComplete="off"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-slate-50 text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
            {query && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>
        </form>
      </header>

      <div className="px-4 py-6 space-y-6">
        {/* Greeting */}
        <div>
          <h2 className="text-xl font-black text-slate-900">Hello 👋</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            What would you like to do today?
          </p>
        </div>

        {/* Three primary action cards */}
        <section aria-labelledby="actions-heading">
          <h3 id="actions-heading" className="sr-only">Main actions</h3>
          <div className="flex flex-col gap-3">
            {actions.map((a) => (
              <Link key={a.href} href={a.href} className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl">
                <Card
                  padding="none"
                  className={`bg-gradient-to-r ${a.color} border active:scale-[0.98] transition-transform cursor-pointer`}
                >
                  <div className="flex items-center gap-4 p-4">
                    <div className={`w-14 h-14 rounded-2xl ${a.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <span className="text-2xl" aria-hidden="true">{a.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-base">{a.title}</p>
                      <p className="text-sm text-slate-600 mt-0.5 leading-snug">{a.description}</p>
                    </div>
                    <span className="text-slate-400 text-lg" aria-hidden="true">›</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        {/* Quick-links row */}
        <section aria-labelledby="quick-links-heading">
          <h3 id="quick-links-heading" className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">
            Quick links
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {quickLinks.map((q) => (
              <Link
                key={q.href}
                href={q.href}
                className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-2xl bg-white border border-slate-200 hover:border-teal-300 hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors active:scale-95"
              >
                <span className="text-2xl" aria-hidden="true">{q.icon}</span>
                <span className="text-xs font-semibold text-slate-600">{q.label}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Prototype disclaimer */}
        <div
          role="note"
          className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 text-center font-medium"
        >
          ⚠ Prototype · Synthetic data only · Not for clinical use
        </div>
      </div>
    </PageShell>
  );
}
