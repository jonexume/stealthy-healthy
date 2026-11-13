"use client";
import { useState, useMemo } from "react";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import EmptyState from "../components/ui/EmptyState";
import SampleContentBanner from "../components/ui/SampleContentBanner";
import { careResources, filterResources } from "@/lib/fixtures/careResources";
import type { CareResource, InsuranceType, CareType } from "@/lib/types";

const insuranceOptions = [
  { value: "any",      label: "Any insurance" },
  { value: "none",     label: "No insurance / Self-pay" },
  { value: "medicaid", label: "Medicaid" },
  { value: "medicare", label: "Medicare" },
  { value: "chip",     label: "CHIP" },
  { value: "private",  label: "Private insurance" },
];

const typeOptions: { value: CareType | "all"; label: string; icon: string }[] = [
  { value: "all",             label: "All types",       icon: "🏥" },
  { value: "urgent_care",     label: "Urgent Care",     icon: "⚡" },
  { value: "primary_care",    label: "Primary Care",    icon: "🩺" },
  { value: "telehealth",      label: "Telehealth",      icon: "💻" },
  { value: "pharmacy",        label: "Pharmacy",        icon: "💊" },
  { value: "community_clinic",label: "Community Clinic",icon: "🤝" },
  { value: "er",              label: "Emergency Room",  icon: "🚨" },
];

const budgetOptions = [
  { value: "",    label: "Any cost" },
  { value: "0",   label: "Free / $0" },
  { value: "50",  label: "Up to $50" },
  { value: "100", label: "Up to $100" },
  { value: "200", label: "Up to $200" },
];

const typeBadge: Record<CareType, "teal" | "blue" | "green" | "amber" | "red" | "slate" | "purple"> = {
  urgent_care:      "amber",
  primary_care:     "blue",
  telehealth:       "purple",
  pharmacy:         "green",
  community_clinic: "teal",
  er:               "red",
};

function ResourceCard({ resource }: { resource: CareResource }) {
  const typeInfo = typeOptions.find((t) => t.value === resource.type);
  const costText = resource.estimatedCostUSD
    ? resource.estimatedCostUSD.low === 0 && resource.estimatedCostUSD.high === 0
      ? "Free"
      : `$${resource.estimatedCostUSD.low}–$${resource.estimatedCostUSD.high}`
    : "Cost varies";

  return (
    <Card className="flex flex-col gap-3">
      {/* Fictional listing label — required by PRD */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="font-bold text-slate-900 text-base leading-snug">{resource.name}</p>
          <span className="inline-block text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5 mt-1 font-medium">
            ⚠ FICTIONAL LISTING
          </span>
        </div>
        <Badge variant={typeBadge[resource.type]} size="sm">
          {typeInfo?.icon} {typeInfo?.label ?? resource.type}
        </Badge>
      </div>

      {/* Address */}
      {resource.type !== "telehealth" && (
        <p className="text-sm text-slate-600 flex items-start gap-1.5">
          <span aria-hidden="true">📍</span>
          {resource.address}, {resource.city}, {resource.state} {resource.zip}
        </p>
      )}

      {/* Distance */}
      {resource.distanceMiles !== undefined && resource.type !== "telehealth" && (
        <p className="text-sm text-slate-500 flex items-center gap-1.5">
          <span aria-hidden="true">🗺️</span>
          {resource.distanceMiles} mi away (fictional)
        </p>
      )}

      {/* Hours */}
      <p className="text-sm text-slate-600 flex items-center gap-1.5">
        <span aria-hidden="true">🕐</span> {resource.hours}
      </p>

      {/* Cost + sliding scale */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-bold text-slate-900">{costText}</span>
        {resource.slidingScale && (
          <Badge variant="green" size="sm">Sliding scale</Badge>
        )}
        {resource.estimatedCostUSD?.low === 0 && (
          <Badge variant="teal" size="sm">Free / low-cost</Badge>
        )}
      </div>

      {/* Insurance accepted */}
      <div>
        <p className="text-xs font-semibold text-slate-500 mb-1">Accepts:</p>
        <div className="flex flex-wrap gap-1">
          {resource.acceptsInsurance.map((ins) => (
            <span key={ins} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
              {ins === "none" ? "Self-pay / no insurance" : ins}
            </span>
          ))}
        </div>
      </div>

      {/* Phone */}
      <div className="flex gap-2 mt-1">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={() => alert(`Prototype: would call ${resource.phone}`)}
        >
          📞 {resource.phone}
        </Button>
        {resource.website && resource.website !== "#" && (
          <Button variant="ghost" size="sm" className="flex-1">
            🌐 Website
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function CarePage() {
  const [insurance, setInsurance] = useState("any");
  const [budget, setBudget] = useState("");
  const [careType, setCareType] = useState<CareType | "all">("all");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filtered = useMemo(() => {
    return filterResources({
      insurance: insurance === "any" ? undefined : insurance as InsuranceType,
      maxCost: budget ? parseInt(budget) : undefined,
      types: careType === "all" ? [] : [careType],
    });
  }, [insurance, budget, careType]);

  const activeFilterCount = [
    insurance !== "any",
    budget !== "",
    careType !== "all",
  ].filter(Boolean).length;

  return (
    <PageShell title="Find Care" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-4 space-y-4">
        <SampleContentBanner type="listing" />

        {/* Filter toggle */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-600">
            Showing <strong>{filtered.length}</strong> of {careResources.length} resources
          </p>
          <Button
            variant={filtersOpen ? "primary" : "outline"}
            size="sm"
            onClick={() => setFiltersOpen((o) => !o)}
            rightIcon={activeFilterCount > 0
              ? <span className="ml-1 bg-white text-teal-700 rounded-full px-1.5 text-xs font-bold">{activeFilterCount}</span>
              : undefined}
          >
            Filters {filtersOpen ? "▲" : "▼"}
          </Button>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <Card className="bg-slate-50">
            <div className="space-y-4">
              <Select
                label="Insurance / payment"
                options={insuranceOptions}
                value={insurance}
                onChange={(e) => setInsurance(e.target.value)}
              />
              <Select
                label="Budget (starting cost)"
                options={budgetOptions}
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
              <div>
                <p className="text-sm font-semibold text-slate-700 mb-2">Care type</p>
                <div className="flex flex-wrap gap-2">
                  {typeOptions.map((t) => (
                    <button
                      key={t.value}
                      onClick={() => setCareType(t.value)}
                      aria-pressed={careType === t.value}
                      className={[
                        "px-3 py-2 rounded-xl text-sm font-semibold border transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                        careType === t.value
                          ? "bg-teal-600 text-white border-teal-600"
                          : "bg-white text-slate-600 border-slate-300 hover:border-teal-400",
                      ].join(" ")}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {activeFilterCount > 0 && (
                <Button variant="ghost" size="sm"
                  onClick={() => { setInsurance("any"); setBudget(""); setCareType("all"); }}>
                  Clear all filters
                </Button>
              )}
            </div>
          </Card>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            icon="🏥"
            title="No resources match your filters"
            description="Try adjusting your insurance type, budget, or care type filters."
            action={{ label: "Clear filters", onClick: () => { setInsurance("any"); setBudget(""); setCareType("all"); } }}
          />
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        )}

        {/* Emergency callout */}
        <Card className="bg-red-50 border-red-200">
          <p className="font-bold text-red-900 text-sm flex items-center gap-2">
            <span aria-hidden="true">🚨</span> In an emergency?
          </p>
          <p className="text-sm text-red-700 mt-1">
            If you are experiencing a life-threatening emergency, call <strong>911</strong> immediately.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
