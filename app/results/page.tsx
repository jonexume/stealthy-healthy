"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import SampleContentBanner from "../components/ui/SampleContentBanner";
import Button from "../components/ui/Button";
import type { AssessmentResult, SafetyLevel } from "@/lib/types";
import { deriveAssessment } from "@/lib/fixtures/symptoms";

// Fallback demo result when no session data exists
const DEMO_RESULT: AssessmentResult = deriveAssessment({
  symptoms: ["s-001", "s-003", "s-011", "s-006"],
  duration: "1_to_2_days",
  severity: "moderate",
  temperature: { id: "demo", valueF: 101.4, unit: "F", method: "oral", timestamp: new Date().toISOString() },
  submittedAt: new Date().toISOString(),
});

const safetyAlertVariant: Record<SafetyLevel, "success" | "warning" | "error" | "emergency"> = {
  routine:    "success",
  monitor:    "warning",
  seek_care:  "error",
  emergency:  "emergency",
};

const safetyBadgeVariant: Record<SafetyLevel, "green" | "amber" | "red" | "red"> = {
  routine:   "green",
  monitor:   "amber",
  seek_care: "red",
  emergency: "red",
};

const safetyLabel: Record<SafetyLevel, string> = {
  routine:   "Routine",
  monitor:   "Monitor",
  seek_care: "Seek Care",
  emergency: "Emergency",
};

/** Strips markdown bold markers for plain-text rendering */
function PlainText({ text }: { text: string }) {
  return <span>{text.replace(/\*\*/g, "")}</span>;
}

export default function ResultsPage() {
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const raw = sessionStorage.getItem("sh_assessment");
    if (raw) {
      try {
        setResult(JSON.parse(raw));
      } catch {
        setResult(DEMO_RESULT);
      }
    } else {
      setResult(DEMO_RESULT);
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <PageShell title="Your Results" backHref="/symptoms" backLabel="Back">
        <div className="flex justify-center py-24">
          <Spinner label="Loading your results…" />
        </div>
      </PageShell>
    );
  }

  if (!result) return null;

  return (
    <PageShell title="Your Results" backHref="/symptoms" backLabel="Back">
      <div className="px-4 py-5 space-y-5">

        {/* ── Prototype disclaimer ── */}
        <Alert variant="warning" title="Prototype — not a clinical assessment">
          This app uses synthetic data and rule-based logic only. This output is <strong>not medical advice</strong> and has not been reviewed by a clinician. If you are experiencing a medical emergency, call 911 immediately.
        </Alert>

        {/* ── Safety message area ── */}
        <Card className="overflow-hidden" padding="none">
          <div className={[
            "px-5 py-4 flex items-center justify-between gap-3",
            result.safetyLevel === "routine"   ? "bg-green-50 border-b border-green-100" :
            result.safetyLevel === "monitor"   ? "bg-amber-50 border-b border-amber-100" :
            result.safetyLevel === "seek_care" ? "bg-red-50 border-b border-red-100" :
            "bg-red-100 border-b border-red-200",
          ].join(" ")}>
            <div>
              <p className="font-black text-slate-900 text-lg leading-tight">
                {result.safetyMessage}
              </p>
              <Badge
                variant={safetyBadgeVariant[result.safetyLevel]}
                className="mt-2"
                icon={
                  result.safetyLevel === "routine"   ? "✓" :
                  result.safetyLevel === "monitor"   ? "⚠" :
                  result.safetyLevel === "seek_care" ? "!" : "🚨"
                }
              >
                {safetyLabel[result.safetyLevel]}
              </Badge>
            </div>
            <span className="text-4xl select-none" aria-hidden="true">
              {result.safetyLevel === "routine"   ? "😌" :
               result.safetyLevel === "monitor"   ? "👀" :
               result.safetyLevel === "seek_care" ? "🏥" : "🚨"}
            </span>
          </div>
          <div className="px-5 py-4">
            <Alert
              variant={safetyAlertVariant[result.safetyLevel]}
              statusLabel={safetyLabel[result.safetyLevel]}
            >
              {result.safetyDetail}
            </Alert>
          </div>
        </Card>

        {/* ── Input summary ── */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span aria-hidden="true">📋</span> What you reported
          </h2>
          <ul className="space-y-2">
            {result.inputSummary.map((line, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-teal-500 mt-0.5 font-bold" aria-hidden="true">•</span>
                <PlainText text={line} />
              </li>
            ))}
          </ul>
        </Card>

        {/* ── Supportive-care cards ── */}
        <section aria-labelledby="care-tips-heading">
          <h2 id="care-tips-heading" className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span aria-hidden="true">💡</span> Supportive care tips
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {result.supportiveCareCards.map((c) => (
              <Card key={c.title} padding="sm" className="flex flex-col gap-2">
                <span className="text-2xl" aria-hidden="true">{c.icon}</span>
                <p className="font-bold text-slate-900 text-sm">{c.title}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{c.body}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* ── Educational content ── */}
        {result.educationalTopics.length > 0 && (
          <section aria-labelledby="edu-heading">
            <h2 id="edu-heading" className="font-bold text-slate-900 mb-3 flex items-center gap-2">
              <span aria-hidden="true">📚</span> Related health topics
            </h2>
            <SampleContentBanner type="content" />
            <div className="mt-3 flex flex-col gap-3">
              {result.educationalTopics.map((topic) => (
                <Link
                  key={topic.id}
                  href={`/topics/${topic.id}`}
                  className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl"
                >
                  <Card className="hover:border-teal-300 active:scale-[0.98] transition-transform cursor-pointer">
                    <p className="font-bold text-slate-900 text-sm">{topic.title}</p>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{topic.summary}</p>
                    <p className="text-xs text-teal-600 font-semibold mt-2">Read more →</p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Sources ── */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span aria-hidden="true">🔗</span> Sources
          </h2>
          <ul className="space-y-1.5">
            {result.sources.map((s) => (
              <li key={s.label} className="text-xs text-slate-600 flex items-start gap-1.5">
                <span className="text-slate-400 mt-0.5" aria-hidden="true">•</span>
                <span className="italic">{s.label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 font-medium">
            ⚠ Sample references only — no real citations have been verified for this prototype.
          </p>
        </Card>

        {/* ── Actions ── */}
        <div className="flex flex-col gap-3 pb-4">
          <Link href="/care" className="w-full">
            <Button variant="primary" size="lg" fullWidth>
              🏥 Find care near you
            </Button>
          </Link>
          <Link href="/temperature" className="w-full">
            <Button variant="outline" size="lg" fullWidth>
              🌡️ Log a temperature reading
            </Button>
          </Link>
          <Link href="/symptoms" className="w-full">
            <Button variant="ghost" size="md" fullWidth>
              Start over →
            </Button>
          </Link>
        </div>

        {/* Footer disclaimer */}
        <p className="text-center text-xs text-slate-400 leading-relaxed pb-2">
          Generated at {new Date(result.generatedAt).toLocaleString()} · Prototype only · Not for clinical use
        </p>
      </div>
    </PageShell>
  );
}
