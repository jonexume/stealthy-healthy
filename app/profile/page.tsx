"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import Alert from "../components/ui/Alert";
import StepIndicator from "../components/ui/StepIndicator";
import Badge from "../components/ui/Badge";
import { defaultProfile } from "@/lib/fixtures/profile";
import type { HealthProfile, AgeGroup, BiologicalSex } from "@/lib/types";

const STEPS = ["Basic Info", "Health Info", "Medications", "Emergency"];

const ageGroupOptions = [
  { value: "infant", label: "Infant (0–1 yr)" },
  { value: "child",  label: "Child (2–11 yrs)" },
  { value: "teen",   label: "Teen (12–17 yrs)" },
  { value: "adult",  label: "Adult (18–64 yrs)" },
  { value: "senior", label: "Senior (65+)" },
];

const sexOptions = [
  { value: "male",              label: "Male" },
  { value: "female",            label: "Female" },
  { value: "intersex",          label: "Intersex" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
];

function TagInput({
  label, hint, tags, onChange,
}: { label: string; hint?: string; tags: string[]; onChange: (t: string[]) => void }) {
  const [input, setInput] = useState("");
  const add = () => {
    const v = input.trim();
    if (v && !tags.includes(v)) onChange([...tags, v]);
    setInput("");
  };
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-semibold text-slate-700">{label}</label>
      {hint && <p className="text-xs text-slate-500">{hint}</p>}
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          placeholder="Type and press Enter or Add"
          className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
        />
        <Button type="button" variant="outline" size="sm" onClick={add}>Add</Button>
      </div>
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((t) => (
            <span key={t} className="inline-flex items-center gap-1 bg-teal-50 border border-teal-200 text-teal-800 text-xs font-medium px-3 py-1 rounded-full">
              {t}
              <button type="button" onClick={() => onChange(tags.filter((x) => x !== t))}
                aria-label={`Remove ${t}`}
                className="hover:text-red-600 ml-0.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-red-400 rounded-full">
                ✕
              </button>
            </span>
          ))}
        </div>
      )}
      {tags.length === 0 && (
        <p className="text-xs text-slate-400 italic">None added — will show as Unknown</p>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<HealthProfile>({ ...defaultProfile });
  const [saved, setSaved] = useState(false);

  const update = (patch: Partial<HealthProfile>) =>
    setProfile((p) => ({ ...p, ...patch }));

  const goNext = () => setStep((s) => Math.min(s + 1, STEPS.length));
  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSave = async () => {
    setSaved(true);
    // Prototype: would persist to store
    await new Promise((r) => setTimeout(r, 600));
  };

  if (saved) {
    return (
      <PageShell title="Profile" backHref="/home" backLabel="Back to Home">
        <div className="px-4 py-10 space-y-5 text-center">
          <div className="text-6xl" aria-hidden="true">👤</div>
          <h2 className="text-xl font-black text-slate-900">Profile saved</h2>
          <p className="text-sm text-slate-500">
            Your health profile has been recorded in this session.<br />
            No data is stored or transmitted (prototype).
          </p>
          <Card>
            <dl className="text-sm space-y-2 text-left">
              <div className="flex justify-between">
                <dt className="text-slate-500">Name</dt>
                <dd className="font-semibold text-slate-900">{profile.displayName || <span className="italic text-slate-400">Unknown</span>}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Age group</dt>
                <dd className="font-semibold text-slate-900 capitalize">{profile.ageGroup || <span className="italic text-slate-400">Unknown</span>}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Conditions</dt>
                <dd className="font-semibold text-slate-900">
                  {profile.conditions.length ? profile.conditions.join(", ") : <span className="italic text-slate-400">None / Unknown</span>}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Allergies</dt>
                <dd className="font-semibold text-slate-900">
                  {profile.allergies.length ? profile.allergies.join(", ") : <span className="italic text-slate-400">None / Unknown</span>}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Medications</dt>
                <dd className="font-semibold text-slate-900">
                  {profile.medications.length ? profile.medications.join(", ") : <span className="italic text-slate-400">None / Unknown</span>}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Emergency contact</dt>
                <dd className="font-semibold text-slate-900">
                  {profile.emergencyContact?.name || <span className="italic text-slate-400">Not set</span>}
                </dd>
              </div>
            </dl>
          </Card>
          <div className="flex flex-col gap-3">
            <Button variant="outline" size="md" fullWidth onClick={() => { setSaved(false); setStep(1); }}>
              Edit profile
            </Button>
            <Button variant="primary" size="md" fullWidth onClick={() => router.push("/home")}>
              Back to Home
            </Button>
          </div>
          <Button variant="ghost" size="sm" onClick={() => router.push("/privacy")}>
            Privacy settings →
          </Button>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell title="Health Profile" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-5 space-y-5">
        <StepIndicator total={STEPS.length} current={step} labels={STEPS} />

        <Alert variant="info">
          All fields are optional. Skipped fields will show as <strong>Unknown</strong>.
          No data is stored outside this session.
        </Alert>

        {/* ── Step 1: Basic Info ── */}
        {step === 1 && (
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">Basic information</h2>
            <div className="space-y-4">
              <Input label="Display name" placeholder="e.g. Alex (optional)"
                value={profile.displayName ?? ""} hint="Used only to personalise greetings."
                onChange={(e) => update({ displayName: e.target.value || undefined })} />
              <Input label="Date of birth" type="date"
                value={profile.dateOfBirth ?? ""}
                hint="Optional — helps contextualise health information."
                onChange={(e) => update({ dateOfBirth: e.target.value || undefined })} />
              <Select label="Age group" placeholder="Select (optional)"
                options={ageGroupOptions} value={profile.ageGroup ?? ""}
                onChange={(e) => update({ ageGroup: (e.target.value || undefined) as AgeGroup })} />
              <Select label="Biological sex" placeholder="Select (optional)"
                hint="Used to contextualise health information — not for profiling."
                options={sexOptions} value={profile.biologicalSex ?? ""}
                onChange={(e) => update({ biologicalSex: (e.target.value || undefined) as BiologicalSex })} />
            </div>
          </Card>
        )}

        {/* ── Step 2: Health conditions + allergies ── */}
        {step === 2 && (
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">Health information</h2>
            <div className="space-y-5">
              <TagInput label="Known conditions"
                hint="e.g. Asthma, Type 2 diabetes, Hypertension"
                tags={profile.conditions} onChange={(t) => update({ conditions: t })} />
              <div className="border-t border-slate-100 pt-5">
                <TagInput label="Allergies"
                  hint="e.g. Penicillin, Peanuts, Latex"
                  tags={profile.allergies} onChange={(t) => update({ allergies: t })} />
              </div>
            </div>
          </Card>
        )}

        {/* ── Step 3: Medications ── */}
        {step === 3 && (
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">Current medications</h2>
            <TagInput label="Medications"
              hint="e.g. Metformin 500mg, Lisinopril 10mg, Albuterol inhaler"
              tags={profile.medications} onChange={(t) => update({ medications: t })} />
            <Alert variant="info" className="mt-4">
              Include dosage if known. This information is not verified or used clinically.
            </Alert>
          </Card>
        )}

        {/* ── Step 4: Emergency contact ── */}
        {step === 4 && (
          <Card>
            <h2 className="font-bold text-slate-900 mb-4">Emergency contact</h2>
            <p className="text-sm text-slate-500 mb-4">Optional — skipping will leave this as Not set.</p>
            <div className="space-y-4">
              <Input label="Contact name" placeholder="e.g. Jordan Smith (optional)"
                value={profile.emergencyContact?.name ?? ""}
                onChange={(e) => update({ emergencyContact: { ...profile.emergencyContact ?? { phone: "", relationship: "" }, name: e.target.value } })} />
              <Input label="Phone number" type="tel" placeholder="e.g. 555-000-0000 (optional)"
                value={profile.emergencyContact?.phone ?? ""}
                onChange={(e) => update({ emergencyContact: { ...profile.emergencyContact ?? { name: "", relationship: "" }, phone: e.target.value } })} />
              <Input label="Relationship" placeholder="e.g. Partner, Parent, Sibling (optional)"
                value={profile.emergencyContact?.relationship ?? ""}
                onChange={(e) => update({ emergencyContact: { ...profile.emergencyContact ?? { name: "", phone: "" }, relationship: e.target.value } })} />
            </div>
          </Card>
        )}

        {/* Navigation */}
        <div className="flex gap-3">
          {step > 1 && (
            <Button variant="outline" size="lg" onClick={goBack} className="flex-1">
              ← Back
            </Button>
          )}
          {step < STEPS.length ? (
            <Button variant="primary" size="lg" onClick={goNext} className="flex-1">
              Continue →
            </Button>
          ) : (
            <Button variant="primary" size="lg" onClick={handleSave} className="flex-1">
              Save profile
            </Button>
          )}
        </div>

        {step < STEPS.length && (
          <button onClick={goNext}
            className="w-full text-center text-sm text-slate-400 hover:text-slate-600 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl">
            Skip this step →
          </button>
        )}
      </div>
    </PageShell>
  );
}
