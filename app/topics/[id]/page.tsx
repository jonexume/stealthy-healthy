import { notFound } from "next/navigation";
import Link from "next/link";
import PageShell from "../../components/ui/PageShell";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SampleContentBanner from "../../components/ui/SampleContentBanner";
import { getTopicById, healthTopics } from "@/lib/fixtures/healthTopics";

export function generateStaticParams() {
  return healthTopics.map((t) => ({ id: t.id }));
}

const categoryLabels: Record<string, string> = {
  fever: "Fever",
  cold_flu: "Cold & Flu",
  nutrition: "Nutrition",
  mental_health: "Mental Health",
  first_aid: "First Aid",
  preventive_care: "Preventive Care",
  medications: "Medications",
};

const badgeVariant: Record<string, "teal" | "blue" | "green" | "amber" | "red" | "slate" | "purple"> = {
  fever: "red",
  cold_flu: "blue",
  nutrition: "green",
  mental_health: "purple",
  first_aid: "amber",
  preventive_care: "teal",
  medications: "slate",
};

/** Renders a simple markdown-lite body — bold (**text**) and line breaks */
function RichBody({ text }: { text: string }) {
  return (
    <div className="text-sm text-slate-700 leading-relaxed space-y-3">
      {text.split(/\n\n+/).map((para, i) => {
        // Handle **bold** inline
        const parts = para.split(/(\*\*[^*]+\*\*)/g);
        return (
          <p key={i}>
            {parts.map((part, j) =>
              part.startsWith("**") ? (
                <strong key={j} className="font-bold text-slate-900">
                  {part.replace(/\*\*/g, "")}
                </strong>
              ) : (
                <span key={j}>{part}</span>
              )
            )}
          </p>
        );
      })}
    </div>
  );
}

export default async function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const topic = getTopicById(id);
  if (!topic) notFound();

  return (
    <PageShell title={topic.title} backHref="/search" backLabel="Back to Search">
      <div className="px-4 py-5 space-y-5">
        <SampleContentBanner type="content" />

        {/* Header card */}
        <Card>
          <div className="flex flex-col gap-3">
            <Badge variant={badgeVariant[topic.category] ?? "slate"} size="md">
              {categoryLabels[topic.category] ?? topic.category}
            </Badge>
            <h2 className="text-xl font-black text-slate-900 leading-snug">
              {topic.title}
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed italic">
              {topic.summary}
            </p>
            <div className="flex items-center gap-2 text-xs text-teal-700 font-semibold bg-teal-50 rounded-lg px-3 py-2">
              <span aria-hidden="true">✓</span>
              Reviewed by {topic.reviewedBy} on{" "}
              {new Date(topic.reviewedAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
          </div>
        </Card>

        {/* Body content */}
        <Card>
          <RichBody text={topic.body} />
        </Card>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {topic.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Sources */}
        {topic.sources.length > 0 && (
          <Card>
            <h3 className="font-bold text-slate-900 text-sm mb-3">Sources</h3>
            <ul className="space-y-2">
              {topic.sources.map((s) => (
                <li key={s.label} className="text-xs text-slate-600 flex items-start gap-2">
                  <span className="mt-0.5 text-slate-400" aria-hidden="true">•</span>
                  {s.url === "#" ? (
                    <span className="italic">{s.label}</span>
                  ) : (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-600 underline"
                    >
                      {s.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-700 bg-amber-50 rounded-lg px-3 py-2 font-medium">
              ⚠ Sources listed are sample references only. No real citations have been verified.
            </p>
          </Card>
        )}

        {/* CTA */}
        <Card className="bg-teal-50 border-teal-200">
          <p className="text-sm font-semibold text-teal-900 mb-3">
            Concerned about your symptoms?
          </p>
          <div className="flex flex-col gap-2">
            <Link
              href="/symptoms"
              className="block text-center bg-teal-600 text-white font-semibold py-3 rounded-xl hover:bg-teal-700 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors"
            >
              Check Symptoms →
            </Link>
            <Link
              href="/care"
              className="block text-center bg-white text-teal-700 font-semibold py-3 rounded-xl border border-teal-300 hover:bg-teal-50 focus-visible:ring-2 focus-visible:ring-teal-500 focus-visible:outline-none transition-colors"
            >
              Find Care Near You →
            </Link>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
