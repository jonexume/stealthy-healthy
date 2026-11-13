"use client";
import { useState } from "react";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import TemperatureChart from "../components/ui/TemperatureChart";
import EmptyState from "../components/ui/EmptyState";
import { temperatureHistory, categorizeTempF, fToC } from "@/lib/fixtures/temperatureHistory";
import type { TempUnit } from "@/lib/types";

const categoryBadge: Record<string, "green" | "amber" | "red" | "blue"> = {
  normal:      "green",
  low_grade:   "amber",
  fever:       "red",
  high_fever:  "red",
  hypothermia: "blue",
};

const categoryLabel: Record<string, string> = {
  normal:      "Normal",
  low_grade:   "Low-grade fever",
  fever:       "Fever",
  high_fever:  "High fever",
  hypothermia: "Hypothermia",
};

export default function HistoryPage() {
  const [unit, setUnit] = useState<TempUnit>("F");
  const [showAll, setShowAll] = useState(false);

  const sorted = [...temperatureHistory].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
  const displayed = showAll ? sorted : sorted.slice(0, 7);

  const latestF = sorted[0]?.valueF;
  const latestCategory = latestF ? categorizeTempF(latestF) : null;

  const displayTemp = (f: number) =>
    unit === "F" ? `${f}°F` : `${fToC(f)}°C`;

  return (
    <PageShell title="Temperature History" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-5 space-y-5">

        {/* Unit toggle */}
        <div className="flex rounded-xl border border-slate-300 overflow-hidden" role="group" aria-label="Temperature unit">
          {(["F", "C"] as TempUnit[]).map((u) => (
            <button key={u} type="button"
              onClick={() => setUnit(u)}
              aria-pressed={unit === u}
              className={[
                "flex-1 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-teal-500",
                unit === u ? "bg-teal-600 text-white" : "bg-white text-slate-600 hover:bg-slate-50",
              ].join(" ")}>
              °{u}
            </button>
          ))}
        </div>

        {/* Latest reading summary */}
        {latestF && latestCategory && (
          <Card className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Latest reading</p>
              <p className="text-3xl font-black text-slate-900">{displayTemp(latestF)}</p>
              <p className="text-xs text-slate-500 mt-1">
                {new Date(sorted[0].timestamp).toLocaleString("en-US", {
                  month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
                })}
              </p>
            </div>
            <Badge variant={categoryBadge[latestCategory]} size="md">
              {categoryLabel[latestCategory]}
            </Badge>
          </Card>
        )}

        {/* Chart */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <span aria-hidden="true">📊</span> Temperature trend
          </h2>
          {temperatureHistory.length === 0 ? (
            <EmptyState icon="🌡️" title="No readings yet"
              description="Log your first temperature reading to see a trend chart." />
          ) : (
            <TemperatureChart readings={temperatureHistory} unit={unit} height={200} />
          )}
        </Card>

        {/* Stats */}
        <Card>
          <h2 className="font-bold text-slate-900 mb-3">Summary</h2>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: "Readings", value: temperatureHistory.length },
              { label: "Avg temp", value: displayTemp(parseFloat((temperatureHistory.reduce((a, r) => a + r.valueF, 0) / temperatureHistory.length).toFixed(1))) },
              { label: "High", value: displayTemp(Math.max(...temperatureHistory.map((r) => r.valueF))) },
            ].map((s) => (
              <div key={s.label} className="bg-slate-50 rounded-xl py-3 px-2">
                <p className="text-lg font-black text-slate-900">{s.value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Log list */}
        <section aria-labelledby="log-heading">
          <h2 id="log-heading" className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <span aria-hidden="true">📋</span> Reading log
          </h2>
          <div className="flex flex-col gap-2">
            {displayed.map((r) => {
              const cat = categorizeTempF(r.valueF);
              return (
                <Card key={r.id} padding="sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 text-sm">{displayTemp(r.valueF)}</p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {new Date(r.timestamp).toLocaleString("en-US", {
                          weekday: "short", month: "short", day: "numeric",
                          hour: "numeric", minute: "2-digit",
                        })}
                        {" · "}
                        <span className="capitalize">{r.method}</span>
                      </p>
                      {r.notes && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{r.notes}</p>
                      )}
                    </div>
                    <Badge variant={categoryBadge[cat]} size="sm">{categoryLabel[cat]}</Badge>
                  </div>
                </Card>
              );
            })}
          </div>

          {!showAll && sorted.length > 7 && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-3 w-full py-3 text-sm font-semibold text-teal-700 hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-xl"
            >
              Show all {sorted.length} readings ↓
            </button>
          )}
        </section>

        <p className="text-center text-xs text-slate-400 pb-2">
          Sample data · Not connected to any medical device
        </p>
      </div>
    </PageShell>
  );
}
