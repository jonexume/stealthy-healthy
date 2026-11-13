"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import PageShell from "../components/ui/PageShell";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import SampleContentBanner from "../components/ui/SampleContentBanner";
import { healthTopics, searchTopics } from "@/lib/fixtures/healthTopics";
import type { HealthTopic, ContentCategory } from "@/lib/types";

const CATEGORIES: { value: ContentCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "fever", label: "Fever" },
  { value: "cold_flu", label: "Cold & Flu" },
  { value: "nutrition", label: "Nutrition" },
  { value: "mental_health", label: "Mental Health" },
  { value: "first_aid", label: "First Aid" },
  { value: "preventive_care", label: "Preventive" },
  { value: "medications", label: "Medications" },
];

const categoryBadgeVariant: Record<ContentCategory, "teal" | "blue" | "green" | "amber" | "red" | "slate" | "purple"> = {
  fever: "red",
  cold_flu: "blue",
  nutrition: "green",
  mental_health: "purple",
  first_aid: "amber",
  preventive_care: "teal",
  medications: "slate",
};

function TopicCard({ topic }: { topic: HealthTopic }) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 rounded-2xl"
    >
      <Card className="active:scale-[0.98] transition-transform cursor-pointer hover:border-teal-300">
        <div className="flex flex-col gap-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-slate-900 text-base leading-snug flex-1">
              {topic.title}
            </h3>
            <Badge variant={categoryBadgeVariant[topic.category]} size="sm">
              {CATEGORIES.find((c) => c.value === topic.category)?.label ?? topic.category}
            </Badge>
          </div>
          <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
            {topic.summary}
          </p>
          <div className="flex items-center justify-between mt-1">
            <div className="flex flex-wrap gap-1">
              {topic.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <span className="text-xs text-teal-600 font-semibold flex items-center gap-1">
              ✓ Reviewed
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}

function SearchContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initialQuery = params.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState<ContentCategory | "all">("all");
  const [results, setResults] = useState<HealthTopic[]>([]);
  const [loading, setLoading] = useState(false);

  const runSearch = useCallback(
    (q: string, cat: ContentCategory | "all") => {
      setLoading(true);
      // Simulate async fetch
      setTimeout(() => {
        let res = q.trim() ? searchTopics(q) : [...healthTopics];
        if (cat !== "all") res = res.filter((t) => t.category === cat);
        setResults(res);
        setLoading(false);
      }, 300);
    },
    []
  );

  useEffect(() => {
    runSearch(initialQuery, activeCategory);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.replace(`/search?q=${encodeURIComponent(query.trim())}`);
    runSearch(query, activeCategory);
  };

  const handleCategory = (cat: ContentCategory | "all") => {
    setActiveCategory(cat);
    runSearch(query, cat);
  };

  return (
    <PageShell title="Health Topics" backHref="/home" backLabel="Back to Home">
      <div className="px-4 py-4 space-y-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} role="search">
          <label htmlFor="search-input" className="sr-only">Search health topics</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" aria-hidden="true">🔍</span>
            <input
              id="search-input"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search topics, symptoms, conditions…"
              autoComplete="off"
              className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-300 bg-white text-slate-900 text-base placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-colors"
            />
          </div>
        </form>

        {/* Category filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-hide">
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => handleCategory(c.value as ContentCategory | "all")}
              className={[
                "flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500",
                activeCategory === c.value
                  ? "bg-teal-600 text-white border-teal-600"
                  : "bg-white text-slate-600 border-slate-300 hover:border-teal-400",
              ].join(" ")}
              aria-pressed={activeCategory === c.value}
            >
              {c.label}
            </button>
          ))}
        </div>

        <SampleContentBanner type="content" />

        {/* Results */}
        {loading ? (
          <div className="py-12 flex justify-center">
            <Spinner label="Searching…" />
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            icon="🔍"
            title="No results found"
            description={`No health topics match "${query}". Try a different search term or browse all topics.`}
            action={{ label: "Show all topics", onClick: () => { setQuery(""); handleCategory("all"); } }}
          />
        ) : (
          <section aria-label={`${results.length} search result${results.length !== 1 ? "s" : ""}`}>
            <p className="text-sm text-slate-500 mb-3">
              {results.length} topic{results.length !== 1 ? "s" : ""}{query ? ` for "${query}"` : ""}
            </p>
            <div className="flex flex-col gap-3">
              {results.map((topic) => (
                <TopicCard key={topic.id} topic={topic} />
              ))}
            </div>
          </section>
        )}
      </div>
    </PageShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex justify-center py-20"><Spinner /></div>}>
      <SearchContent />
    </Suspense>
  );
}
