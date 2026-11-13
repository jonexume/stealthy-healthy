"use client";
import { useState } from "react";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Textarea from "../components/ui/Textarea";
import { contentReviewQueue } from "@/lib/fixtures/profile";
import type { ContentReviewItem, AdminReviewStatus } from "@/lib/types";

const statusBadge: Record<AdminReviewStatus, "amber" | "green" | "red" | "blue"> = {
  pending:        "amber",
  approved:       "green",
  rejected:       "red",
  needs_revision: "blue",
};

const statusLabel: Record<AdminReviewStatus, string> = {
  pending:        "Pending",
  approved:       "Approved",
  rejected:       "Rejected",
  needs_revision: "Needs revision",
};

const filterOptions: { value: AdminReviewStatus | "all"; label: string }[] = [
  { value: "all",           label: "All" },
  { value: "pending",       label: "Pending" },
  { value: "needs_revision",label: "Needs revision" },
  { value: "approved",      label: "Approved" },
  { value: "rejected",      label: "Rejected" },
];

export default function AdminPage() {
  const [items, setItems] = useState<ContentReviewItem[]>(contentReviewQueue);
  const [filter, setFilter] = useState<AdminReviewStatus | "all">("all");
  const [selected, setSelected] = useState<ContentReviewItem | null>(null);
  const [reviewNote, setReviewNote] = useState("");
  const [toast, setToast] = useState("");

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const updateStatus = (id: string, status: AdminReviewStatus) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status, reviewerNotes: reviewNote || item.reviewerNotes } : item
      )
    );
    showToast(`Status updated to "${statusLabel[status]}"`);
    setSelected(null);
    setReviewNote("");
  };

  const filtered = filter === "all" ? items : items.filter((i) => i.status === filter);

  const counts = {
    pending: items.filter((i) => i.status === "pending").length,
    needs_revision: items.filter((i) => i.status === "needs_revision").length,
    approved: items.filter((i) => i.status === "approved").length,
    rejected: items.filter((i) => i.status === "rejected").length,
  };

  return (
    <PageShell title="Content Review" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-5 space-y-5">

        <Alert variant="warning" title="Admin area">
          This is a prototype admin interface. No authentication is enforced. In production
          this area would require verified reviewer credentials.
        </Alert>

        {toast && <Alert variant="success">{toast}</Alert>}

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2">
          {Object.entries(counts).map(([k, v]) => (
            <div key={k} className="bg-white border border-slate-200 rounded-xl py-2 px-2 text-center">
              <p className="text-xl font-black text-slate-900">{v}</p>
              <p className="text-xs text-slate-500 leading-tight capitalize mt-0.5">
                {k.replace("_", " ")}
              </p>
            </div>
          ))}
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4">
          {filterOptions.map((f) => (
            <button key={f.value} onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={[
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                filter === f.value
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-300 hover:border-teal-400",
              ].join(" ")}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Item list */}
        {selected ? (
          /* ── Detail / review panel ── */
          <div className="space-y-4">
            <button onClick={() => { setSelected(null); setReviewNote(""); }}
              className="text-sm font-semibold text-teal-700 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded">
              ← Back to list
            </button>
            <Card>
              <div className="flex items-start justify-between gap-2 mb-4">
                <h2 className="font-bold text-slate-900 text-base">{selected.title}</h2>
                <Badge variant={statusBadge[selected.status]}>{statusLabel[selected.status]}</Badge>
              </div>
              <dl className="text-sm space-y-2 mb-4">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Topic ID</dt>
                  <dd className="font-mono text-xs text-slate-700">{selected.topicId}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Submitted by</dt>
                  <dd className="text-slate-700">{selected.submittedBy}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Submitted</dt>
                  <dd className="text-slate-700">
                    {new Date(selected.submittedAt).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </dd>
                </div>
              </dl>

              {selected.reviewerNotes && (
                <div className="bg-slate-50 rounded-xl p-3 mb-4">
                  <p className="text-xs font-bold text-slate-500 mb-1">Previous reviewer notes</p>
                  <p className="text-sm text-slate-700">{selected.reviewerNotes}</p>
                </div>
              )}

              <Textarea
                label="Reviewer notes"
                placeholder="Add notes for the content author…"
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                hint="Optional. Notes will be visible to the submitter."
              />
            </Card>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" size="md" fullWidth
                onClick={() => updateStatus(selected.id, "approved")}
                className="bg-green-600 hover:bg-green-700 focus-visible:ring-green-500">
                ✓ Approve
              </Button>
              <Button variant="outline" size="md" fullWidth
                onClick={() => updateStatus(selected.id, "needs_revision")}
                className="border-blue-400 text-blue-700 hover:bg-blue-50">
                ↩ Needs revision
              </Button>
              <Button variant="danger" size="md" fullWidth
                onClick={() => updateStatus(selected.id, "rejected")}>
                ✕ Reject
              </Button>
              <Button variant="outline" size="md" fullWidth
                onClick={() => updateStatus(selected.id, "pending")}>
                ↺ Reset to pending
              </Button>
            </div>
          </div>
        ) : (
          /* ── Item list ── */
          <div className="flex flex-col gap-3">
            {filtered.length === 0 && (
              <Card className="text-center py-10">
                <p className="text-slate-500 text-sm">No items match this filter.</p>
              </Card>
            )}
            {filtered.map((item) => (
              <Card
                key={item.id}
                className="cursor-pointer hover:border-teal-300 active:scale-[0.98] transition-transform"
                onClick={() => { setSelected(item); setReviewNote(""); }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm leading-snug">{item.title}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {item.submittedBy} ·{" "}
                      {new Date(item.submittedAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                    {item.reviewerNotes && (
                      <p className="text-xs text-slate-400 mt-1 truncate italic">{item.reviewerNotes}</p>
                    )}
                  </div>
                  <Badge variant={statusBadge[item.status]} size="sm">
                    {statusLabel[item.status]}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </PageShell>
  );
}
