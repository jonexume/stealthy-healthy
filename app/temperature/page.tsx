"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Textarea from "../components/ui/Textarea";
import RadioGroup from "../components/ui/RadioGroup";
import Alert from "../components/ui/Alert";
import Badge from "../components/ui/Badge";
import { cToF, categorizeTempF } from "@/lib/fixtures/temperatureHistory";
import type { TempUnit, MeasurementMethod } from "@/lib/types";

const methodOptions = [
  { value: "oral",      label: "Oral",      icon: "👄", description: "Under the tongue" },
  { value: "axillary",  label: "Axillary",  icon: "🦾", description: "Underarm (reads ~1°F lower)" },
  { value: "tympanic",  label: "Tympanic",  icon: "👂", description: "Ear canal" },
  { value: "temporal",  label: "Temporal",  icon: "🤚", description: "Forehead / temporal artery" },
  { value: "rectal",    label: "Rectal",    icon: "🌡️", description: "Most accurate (infants)" },
];

const categoryConfig = {
  hypothermia: { label: "Hypothermia", badge: "blue" as const,  text: "Temperature is dangerously low. Seek emergency care." },
  normal:      { label: "Normal",      badge: "green" as const, text: "Temperature is within the normal range." },
  low_grade:   { label: "Low-grade fever", badge: "amber" as const, text: "Slightly elevated. Rest and monitor." },
  fever:       { label: "Fever",       badge: "red" as const,   text: "Fever detected. Rest, fluids, and monitor closely." },
  high_fever:  { label: "High fever",  badge: "red" as const,   text: "High fever. Consider contacting a healthcare provider." },
};

function toLocalDateTimeString(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function TemperaturePage() {
  const router = useRouter();

  const [unit, setUnit] = useState<TempUnit>("F");
  const [value, setValue] = useState("");
  const [method, setMethod] = useState<MeasurementMethod>("oral");
  const [timestamp, setTimestamp] = useState("");

  // Initialise to current time client-side to avoid SSR mismatch
  useEffect(() => {
    setTimestamp(toLocalDateTimeString(new Date()));
  }, []);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const numericValue = parseFloat(value);
  const valueF = !isNaN(numericValue)
    ? unit === "C" ? cToF(numericValue) : numericValue
    : null;
  const category = valueF !== null ? categorizeTempF(valueF) : null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!value.trim()) { errs.value = "Please enter a temperature."; }
    else if (isNaN(numericValue)) { errs.value = "Must be a number."; }
    else if (unit === "F" && (numericValue < 85 || numericValue > 115)) {
      errs.value = "Enter a value between 85°F and 115°F.";
    } else if (unit === "C" && (numericValue < 29 || numericValue > 46)) {
      errs.value = "Enter a value between 29°C and 46°C.";
    }
    if (!timestamp) errs.timestamp = "Please select a date and time.";
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted && category) {
    const cfg = categoryConfig[category];
    return (
      <PageShell title="Temperature Logged" backHref="/home" backLabel="Back to Home">
        <div className="px-4 py-6 space-y-4">
          <Card className="text-center">
            <div className="text-5xl mb-3" aria-hidden="true">✅</div>
            <h2 className="text-xl font-black text-slate-900 mb-1">Reading saved</h2>
            <p className="text-sm text-slate-500">Your temperature has been recorded.</p>
          </Card>

          <Card>
            <h3 className="font-bold text-slate-900 mb-3">Summary</h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Temperature</dt>
                <dd className="font-bold text-slate-900">{value}°{unit}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">In °F</dt>
                <dd className="font-semibold text-slate-700">{valueF?.toFixed(1)}°F</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Method</dt>
                <dd className="font-semibold text-slate-700 capitalize">{method}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Time</dt>
                <dd className="font-semibold text-slate-700">
                  {new Date(timestamp).toLocaleString("en-US", { month:"short", day:"numeric", hour:"numeric", minute:"2-digit" })}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-slate-500">Category</dt>
                <dd><Badge variant={cfg.badge}>{cfg.label}</Badge></dd>
              </div>
            </dl>
          </Card>

          {/* Safety message — not color-only: badge + text */}
          <Alert
            variant={category === "normal" ? "success" : category === "low_grade" ? "warning" : category === "hypothermia" || category === "high_fever" ? "emergency" : "warning"}
            title={cfg.label}
            statusLabel={cfg.label}
          >
            {cfg.text}
            {(category === "fever" || category === "high_fever") && (
              <p className="mt-1 font-semibold">
                This is not a clinical assessment. If concerned, contact a healthcare provider.
              </p>
            )}
          </Alert>

          {notes && (
            <Card>
              <p className="text-sm font-semibold text-slate-700 mb-1">Notes</p>
              <p className="text-sm text-slate-600">{notes}</p>
            </Card>
          )}

          <div className="flex flex-col gap-3">
            <Button variant="primary" size="lg" fullWidth onClick={() => { setValue(""); setNotes(""); setSubmitted(false); }}>
              Log another reading
            </Button>
            <Button variant="outline" size="lg" fullWidth onClick={() => router.push("/history")}>
              View history
            </Button>
            <Button variant="ghost" size="md" fullWidth onClick={() => router.push("/symptoms")}>
              Check symptoms →
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Log Temperature" backHref="/home" backLabel="Back to Home">
      <form onSubmit={handleSubmit} noValidate>
        <div className="px-4 py-5 space-y-5">
          <Alert variant="info">
            Enter your temperature reading below. All fields except notes are required.
          </Alert>

          {/* Temperature value + unit */}
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">Temperature reading</h2>

            {/* Unit toggle */}
            <div className="flex rounded-xl border border-slate-300 overflow-hidden mb-4" role="group" aria-label="Temperature unit">
              {(["F", "C"] as TempUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => { setUnit(u); setValue(""); }}
                  aria-pressed={unit === u}
                  className={[
                    "flex-1 py-3 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500",
                    unit === u ? "bg-teal-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50",
                  ].join(" ")}
                >
                  °{u}
                </button>
              ))}
            </div>

            <Input
              label={`Temperature (°${unit})`}
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder={unit === "F" ? "e.g. 98.6" : "e.g. 37.0"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={errors.value}
              required
              rightAddon={<span className="font-bold text-slate-500">°{unit}</span>}
            />

            {/* Live preview */}
            {valueF !== null && category && (
              <div className="mt-3 flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3">
                <span className="text-sm text-slate-600">
                  {unit === "C" ? `= ${valueF}°F` : `= ${((numericValue - 32) * 5/9).toFixed(1)}°C`}
                </span>
                <Badge variant={categoryConfig[category].badge}>
                  {categoryConfig[category].label}
                </Badge>
              </div>
            )}
          </Card>

          {/* Method */}
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">Measurement method</h2>
            <RadioGroup
              legend="Measurement method"
              options={methodOptions}
              value={method}
              onChange={(v) => setMethod(v as MeasurementMethod)}
              columns={1}
            />
          </Card>

          {/* Timestamp */}
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">When was this taken?</h2>
            <Input
              label="Date and time"
              type="datetime-local"
              value={timestamp}
              onChange={(e) => setTimestamp(e.target.value)}
              error={errors.timestamp}
              required
            />
          </Card>

          {/* Notes */}
          <Card>
            <Textarea
              label="Notes (optional)"
              placeholder="e.g. Feeling chills, took acetaminophen…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              hint="Add any context about how you're feeling or medications taken."
            />
          </Card>

          <Button type="submit" variant="primary" size="lg" fullWidth isLoading={loading}>
            Save reading
          </Button>
        </div>
      </form>
    </PageShell>
  );
}
