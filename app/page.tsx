import Link from "next/link";
import Logo from "./components/Logo";
import Button from "./components/ui/Button";

export default function WelcomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#0d4a8c] via-[#1265b8] to-[#1a7de8] px-6 py-10 max-w-md mx-auto">
      {/* Prototype banner */}
      <div
        role="note"
        className="rounded-xl bg-white/15 border border-white/30 px-3 py-2 text-xs text-white/90 text-center font-medium mb-8"
      >
        ⚠ PROTOTYPE — Synthetic data only · Not for clinical use
      </div>

      {/* Logo + branding */}
      <div className="flex flex-col items-center flex-1 justify-center gap-6 pb-6">
        <Logo size={140} />
        <div className="text-center">
          <h1 className="text-4xl font-black text-white tracking-tight leading-none drop-shadow">
            Stealthy Healthy
          </h1>
          <p className="mt-3 text-lg text-blue-100 font-medium leading-snug max-w-xs mx-auto">
            Your quiet guide to understanding your health
          </p>
        </div>

        {/* Feature highlights */}
        <ul className="mt-2 w-full max-w-xs space-y-2.5" aria-label="App features">
          {[
            { icon: "🔍", text: "Search reviewed health topics" },
            { icon: "🌡️", text: "Log and track your temperature" },
            { icon: "📋", text: "Guided symptom check-in" },
            { icon: "🏥", text: "Find nearby care resources" },
          ].map((f) => (
            <li key={f.text} className="flex items-center gap-3 text-white/90">
              <span className="text-xl" aria-hidden="true">{f.icon}</span>
              <span className="text-sm font-medium">{f.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA buttons */}
      <div className="flex flex-col gap-3 w-full pb-safe">
        <Link href="/sign-in" className="w-full">
          <Button variant="primary" size="lg" fullWidth
            className="bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 focus-visible:ring-white">
            Create account
          </Button>
        </Link>
        <Link href="/sign-in" className="w-full">
          <Button variant="outline" size="lg" fullWidth
            className="border-white/60 text-white hover:bg-white/10 focus-visible:ring-white">
            Sign in
          </Button>
        </Link>
        <Link href="/home" className="w-full">
          <Button variant="ghost" size="md" fullWidth
            className="text-white/80 hover:text-white hover:bg-white/10 focus-visible:ring-white">
            Browse as guest →
          </Button>
        </Link>

        <p className="text-center text-xs text-white/50 mt-2 leading-relaxed">
          By continuing you acknowledge this is a prototype and no data is
          stored or transmitted anywhere.
        </p>
      </div>
    </div>
  );
}
