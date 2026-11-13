"use client";
import { useState } from "react";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Toggle from "../components/ui/Toggle";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Select from "../components/ui/Select";
import { defaultPrivacySettings } from "@/lib/fixtures/profile";
import type { PrivacySettings, PrivacyChoice } from "@/lib/types";

const privacyItems: {
  id: PrivacyChoice;
  label: string;
  description: string;
}[] = [
  {
    id: "crashReports",
    label: "Crash reports",
    description: "Send anonymous crash data to help fix bugs. No health data is included.",
  },
  {
    id: "analytics",
    label: "Usage analytics",
    description: "Share anonymous feature-usage statistics to improve the app.",
  },
  {
    id: "locationServices",
    label: "Location services",
    description:
      "Allow approximate location to show nearby care resources. Never used for other purposes.",
  },
  {
    id: "personalization",
    label: "Personalisation",
    description:
      "Use your health profile to personalise content suggestions. All processing happens on-device (prototype).",
  },
];

const retentionOptions = [
  { value: "30",  label: "30 days" },
  { value: "60",  label: "60 days" },
  { value: "90",  label: "90 days (default)" },
  { value: "180", label: "180 days" },
  { value: "365", label: "1 year" },
];

export default function PrivacyPage() {
  const [settings, setSettings] = useState<PrivacySettings>({ ...defaultPrivacySettings });
  const [saved, setSaved] = useState(false);
  const [exportRequested, setExportRequested] = useState(false);
  const [deleteRequested, setDeleteRequested] = useState(false);

  const setChoice = (id: PrivacyChoice, val: boolean) =>
    setSettings((s) => ({ ...s, choices: { ...s.choices, [id]: val } }));

  const handleSave = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PageShell title="Privacy Settings" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-5 space-y-5">

        <Alert variant="info" title="Prototype privacy notice">
          This is a prototype. No data is actually collected, stored, or transmitted.
          These controls demonstrate the intended privacy UI.
        </Alert>

        {saved && (
          <Alert variant="success">Settings saved for this session.</Alert>
        )}

        {/* Data collection toggles */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-1">Data collection</h2>
          <p className="text-sm text-slate-500 mb-4">
            Control what data the app may collect. All are off by default except crash reports.
          </p>
          <div className="divide-y divide-slate-100">
            {privacyItems.map((item) => (
              <Toggle
                key={item.id}
                id={item.id}
                label={item.label}
                description={item.description}
                checked={settings.choices[item.id]}
                onChange={(v) => setChoice(item.id, v)}
              />
            ))}
          </div>
        </Card>

        {/* Data retention */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-3">Data retention</h2>
          <p className="text-sm text-slate-500 mb-4">
            Choose how long to keep your health log data before automatic deletion.
          </p>
          <Select
            label="Keep my data for"
            options={retentionOptions}
            value={String(settings.dataRetentionDays)}
            onChange={(e) =>
              setSettings((s) => ({ ...s, dataRetentionDays: parseInt(e.target.value) }))
            }
          />
        </Card>

        {/* Data rights */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-3">Your data rights</h2>
          <p className="text-sm text-slate-500 mb-4 leading-relaxed">
            You can request an export of your data or request deletion at any time.
            In this prototype, these buttons are simulated.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => setExportRequested(true)}
              disabled={exportRequested}
            >
              {exportRequested ? "✓ Export requested" : "📤 Request data export"}
            </Button>
            {exportRequested && (
              <p className="text-xs text-teal-700 text-center">
                Prototype: an export would be sent to your registered email within 48 hours.
              </p>
            )}

            <Button
              variant="danger"
              size="md"
              fullWidth
              onClick={() => {
                if (window.confirm("Prototype: This would permanently delete all your data. Proceed?")) {
                  setDeleteRequested(true);
                }
              }}
              disabled={deleteRequested}
            >
              {deleteRequested ? "✓ Deletion requested" : "🗑️ Request data deletion"}
            </Button>
            {deleteRequested && (
              <Alert variant="warning">
                Prototype: In a real app, all your data would be permanently deleted within 30 days.
              </Alert>
            )}
          </div>
        </Card>

        {/* Links */}
        <Card className="bg-slate-50">
          <h2 className="font-bold text-slate-900 mb-3">Legal</h2>
          <ul className="space-y-3">
            {[
              { label: "Privacy Policy", icon: "📄" },
              { label: "Terms of Service", icon: "📃" },
              { label: "Cookie Policy", icon: "🍪" },
            ].map((l) => (
              <li key={l.label}>
                <button
                  onClick={() => alert("Prototype: This document is not yet available.")}
                  className="flex items-center justify-between w-full text-sm font-semibold text-slate-700 py-1 hover:text-teal-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded"
                >
                  <span className="flex items-center gap-2">
                    <span aria-hidden="true">{l.icon}</span>
                    {l.label}
                  </span>
                  <span className="text-slate-400" aria-hidden="true">›</span>
                </button>
              </li>
            ))}
          </ul>
        </Card>

        <Button variant="primary" size="lg" fullWidth onClick={handleSave}>
          Save settings
        </Button>

        <p className="text-center text-xs text-slate-400 pb-2">
          App version 0.1.0-prototype · Settings are session-only
        </p>
      </div>
    </PageShell>
  );
}
