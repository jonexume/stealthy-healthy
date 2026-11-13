"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import StepIndicator from "../components/ui/StepIndicator";
import CheckboxGroup from "../components/ui/CheckboxGroup";
import RadioGroup from "../components/ui/RadioGroup";
import Alert from "../components/ui/Alert";
import Input from "../components/ui/Input";
import Textarea from "../components/ui/Textarea";
import { symptoms, symptomsByCategory, deriveAssessment } from "@/lib/fixtures/symptoms";
import type { SymptomSeverity, MeasurementMethod } from "@/lib/types";
import { cToF } from "@/lib/fixtures/temperatureHistory";

const STEPS = ["Symptoms", "Severity", "Temperature", "Duration", "Review"];

const severityOptions = [
  { value: "mild",     icon: "🟢", label: "Mild",     description: "Noticeable but not interfering with daily activities" },
  { value: "moderate", icon: "🟡", label: "Moderate", description: "Affecting daily activities; uncomfortable" },
  { value: "severe",   icon: "🔴", label: "Severe",   description: "Significantly limiting; difficult to function" },
];

const durationOptions = [
  { value: "less_than_1_day", label: "Less than 1 day" },
  { value: "1_to_2_days",     label: "1–2 days" },
  { value: "3_to_5_days",     label: "3–5 days" },
  { value: "6_to_10_days",    label: "6–10 days" },
  { value: "more_than_10",    label: "More than 10 days" },
];

const methodOptions = [
  { value: "oral",     label: "Oral",     icon: "👄" },
  { value: "tympanic", label: "Ear",      icon: "👂" },
  { value: "temporal", label: "Forehead", icon: "🤚" },
  { value: "axillary", label: "Underarm", icon: "🦾" },
  { value: "rectal",   label: "Rectal",   icon: "🌡️" },
];

export default function SymptomsPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Step 1
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [step1Error, setStep1Error] = useState("");

  // Step 2
  const [severity, setSeverity] = useState<SymptomSeverity | "">("");
  const [step2Error, setStep2Error] = useState("");

  // Step 3
  const [hasTempReading, setHasTempReading] = useState<"yes" | "no" | "">("");
  const [tempValue, setTempValue] = useState("");
  const [tempUnit, setTempUnit] = useState<"F" | "C">("F");
  const [tempMethod, setTempMethod] = useState<MeasurementMethod>("oral");

  // Step 4
  const [duration, setDuration] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [step4Error, setStep4Error] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const categoryMap = symptomsByCategory();

  const goNext = () => {
    if (step === 1) {
      if (selectedSymptoms.length === 0) { setStep1Error("Please select at least one symptom."); return; }
      setStep1Error("");
    }
    if (step === 2) {
      if (!severity) { setStep2Error("Please select a severity level."); return; }
      setStep2Error("");
    }
    if (step === 4) {
      if (!duration) { setStep4Error("Please select how long you've had symptoms."); return; }
      setStep4Error("");
    }
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setSubmitting(true);
    const numTemp = parseFloat(tempValue);
    const tempF = !isNaN(numTemp) ? (tempUnit === "C" ? cToF(numTemp) : numTemp) : undefined;

    const intake = {
      symptoms: selectedSymptoms,
      duration,
      severity: severity as SymptomSeverity,
      temperature: tempF ? { id: "intake-temp", valueF: tempF, unit: tempUnit, method: tempMethod, timestamp: new Date().toISOString() } : undefined,
      additionalNotes,
      submittedAt: new Date().toISOString(),
    };
    const result = deriveAssessment(intake);
    // Store in sessionStorage so results page can read it
    sessionStorage.setItem("sh_assessment", JSON.stringify(result));
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    router.push("/results");
  };

  const symptomLabels = selectedSymptoms.map(
    (id) => symptoms.find((s) => s.id === id)?.label ?? id
  );

  return (
    <PageShell title="Symptom Check-in" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-5 space-y-5">
        {/* Progress indicator */}
        <StepIndicator total={STEPS.length} current={step} labels={STEPS} />

        {/* ── Step 1: Symptoms ── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">What symptoms are you experiencing?</h2>
              <p className="text-sm text-slate-500 mt-1">Select all that apply.</p>
            </div>
            {step1Error && <Alert variant="error">{step1Error}</Alert>}
            {Object.entries(categoryMap).map(([cat, items]) => (
              <Card key={cat}>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">{cat}</h3>
                <CheckboxGroup
                  legend={`${cat} symptoms`}
                  options={items.map((s) => ({ id: s.id, label: s.label }))}
                  selected={selectedSymptoms}
                  onChange={setSelectedSymptoms}
                  columns={cat === "General" || cat === "Serious" ? 1 : 2}
                />
              </Card>
            ))}
            {selectedSymptoms.length > 0 && (
              <Alert variant="info">
                {selectedSymptoms.length} symptom{selectedSymptoms.length !== 1 ? "s" : ""} selected: {symptomLabels.join(", ")}.
              </Alert>
            )}
          </div>
        )}

        {/* ── Step 2: Severity ── */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">How severe are your symptoms overall?</h2>
              <p className="text-sm text-slate-500 mt-1">Choose the level that best describes how you feel right now.</p>
            </div>
            {step2Error && <Alert variant="error">{step2Error}</Alert>}
            <Card>
              <RadioGroup
                legend="Symptom severity"
                options={severityOptions}
                value={severity}
                onChange={(v) => setSeverity(v as SymptomSeverity)}
                columns={1}
              />
            </Card>
          </div>
        )}

        {/* ── Step 3: Temperature (optional) ── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Do you have a temperature reading?</h2>
              <p className="text-sm text-slate-500 mt-1">This is optional — skip if you don&apos;t have one.</p>
            </div>
            <Card>
              <RadioGroup
                legend="Do you have a temperature reading?"
                options={[
                  { value: "yes", label: "Yes, I have a reading", icon: "🌡️" },
                  { value: "no",  label: "Skip — no reading",     icon: "⏭️" },
                ]}
                value={hasTempReading}
                onChange={(v) => setHasTempReading(v as "yes" | "no")}
                columns={1}
              />
            </Card>

            {hasTempReading === "yes" && (
              <Card>
                <div className="space-y-4">
                  <div className="flex rounded-xl border border-slate-300 overflow-hidden" role="group" aria-label="Temperature unit">
                    {(["F", "C"] as const).map((u) => (
                      <button key={u} type="button"
                        onClick={() => { setTempUnit(u); setTempValue(""); }}
                        aria-pressed={tempUnit === u}
                        className={["flex-1 py-3 text-base font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500",
                          tempUnit === u ? "bg-teal-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50"].join(" ")}>
                        °{u}
                      </button>
                    ))}
                  </div>
                  <Input label={`Temperature (°${tempUnit})`} type="number" inputMode="decimal" step="0.1"
                    placeholder={tempUnit === "F" ? "e.g. 101.2" : "e.g. 38.4"}
                    value={tempValue} onChange={(e) => setTempValue(e.target.value)} />
                  <div>
                    <p className="text-sm font-semibold text-slate-700 mb-2">Method</p>
                    <RadioGroup legend="Measurement method" options={methodOptions} value={tempMethod}
                      onChange={(v) => setTempMethod(v as MeasurementMethod)} columns={3} />
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}

        {/* ── Step 4: Duration + Notes ── */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">How long have you had these symptoms?</h2>
            </div>
            {step4Error && <Alert variant="error">{step4Error}</Alert>}
            <Card>
              <RadioGroup legend="Symptom duration" options={durationOptions} value={duration}
                onChange={setDuration} columns={1} />
            </Card>
            <Card>
              <Textarea label="Anything else to add? (optional)"
                placeholder="e.g. Symptoms started after traveling, took ibuprofen this morning…"
                value={additionalNotes} onChange={(e) => setAdditionalNotes(e.target.value)}
                hint="Any extra context that might be helpful." />
            </Card>
          </div>
        )}

        {/* ── Step 5: Review ── */}
        {step === 5 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Review your answers</h2>
              <p className="text-sm text-slate-500 mt-1">Check everything looks right before submitting.</p>
            </div>
            <Alert variant="warning" title="Important">
              This is a prototype. What follows is not a clinical assessment. If you are experiencing a medical emergency, call 911.
            </Alert>
            <Card>
              <dl className="space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-slate-700 mb-1">Symptoms ({selectedSymptoms.length})</dt>
                  <dd className="text-slate-600 leading-relaxed">{symptomLabels.join(", ")}</dd>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <dt className="font-bold text-slate-700">Severity</dt>
                  <dd className="text-slate-600 capitalize">{severity}</dd>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <dt className="font-bold text-slate-700">Temperature</dt>
                  <dd className="text-slate-600">
                    {hasTempReading === "yes" && tempValue ? `${tempValue}°${tempUnit} (${tempMethod})` : "Not provided"}
                  </dd>
                </div>
                <div className="border-t border-slate-100 pt-3">
                  <dt className="font-bold text-slate-700">Duration</dt>
                  <dd className="text-slate-600">{durationOptions.find((d) => d.value === duration)?.label ?? duration}</dd>
                </div>
                {additionalNotes && (
                  <div className="border-t border-slate-100 pt-3">
                    <dt className="font-bold text-slate-700">Notes</dt>
                    <dd className="text-slate-600">{additionalNotes}</dd>
                  </div>
                )}
              </dl>
            </Card>
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex gap-3 pt-2">
          {step > 1 && (
            <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
              ← Back
            </Button>
          )}
          {step < STEPS.length ? (
            <Button variant="primary" size="lg" onClick={goNext}
              className="flex-1"
              rightIcon={<span aria-hidden="true">→</span>}>
              {step === 3 && hasTempReading === "" ? "Skip" : "Continue"}
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleSubmit} isLoading={submitting} className="flex-1">
              See my results
            </Button>
          )}
        </div>
      </div>
    </PageShell>
  );
}
