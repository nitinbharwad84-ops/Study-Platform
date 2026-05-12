"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { CheckCircle2, XCircle, MinusCircle, ArrowLeft, Filter } from "lucide-react";

interface ReviewItem {
  index: number;
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctOption: string;
  selectedOption: string | null;
  isCorrect: boolean | null;
  isFlagged: boolean;
  explanations: { A: string; B: string; C: string; D: string };
}

interface ReviewData {
  attemptId: string;
  subjectName: string;
  totalQuestions: number;
  status: string;
  items: ReviewItem[];
}

type FilterType = "all" | "correct" | "wrong" | "skipped";

const OPTIONS = ["A", "B", "C", "D"] as const;

export default function MCQReviewPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <MCQReviewContent />
    </Suspense>
  );
}

function MCQReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [data, setData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterType>("all");

  useEffect(() => {
    if (!attemptId) {
      setError("No attempt ID.");
      setLoading(false);
      return;
    }

    fetch(`/api/mcq/review/${attemptId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message || "Failed to load review."))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <LoadingSkeleton variant="page" />;
  if (error || !data) {
    return (
      <ErrorState
        title="Could not load review"
        description={error ?? "Unknown error."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const filteredItems = data.items.filter((item) => {
    if (filter === "correct") return item.isCorrect === true;
    if (filter === "wrong") return item.isCorrect === false && item.selectedOption !== null;
    if (filter === "skipped") return item.selectedOption === null;
    return true;
  });

  const FILTERS: { label: string; value: FilterType; count: number }[] = [
    { label: "All", value: "all", count: data.totalQuestions },
    { label: "Correct", value: "correct", count: data.items.filter((i) => i.isCorrect).length },
    { label: "Wrong", value: "wrong", count: data.items.filter((i) => i.isCorrect === false && i.selectedOption).length },
    { label: "Skipped", value: "skipped", count: data.items.filter((i) => !i.selectedOption).length },
  ];

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />Back
        </Button>
        <PageHeader
          title="Detailed Review"
          description={`${data.subjectName} — ${data.totalQuestions} questions`}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-all border ${
              filter === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border hover:bg-accent"
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Review Items */}
      <div className="space-y-4">
        {filteredItems.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-8">No questions match this filter.</p>
        )}
        {filteredItems.map((item) => {
          const statusIcon =
            item.isCorrect === true ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            ) : item.selectedOption === null ? (
              <MinusCircle className="h-5 w-5 text-amber-500 shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500 shrink-0" />
            );

          return (
            <div
              key={item.index}
              className={`rounded-xl border p-4 space-y-4 ${
                item.isCorrect
                  ? "border-emerald-500/20 bg-emerald-500/5"
                  : item.selectedOption === null
                  ? "border-amber-500/20 bg-amber-500/5"
                  : "border-red-500/20 bg-red-500/5"
              }`}
            >
              {/* Question header */}
              <div className="flex items-start gap-2">
                {statusIcon}
                <div className="flex-1">
                  <span className="text-xs font-medium text-muted-foreground">Question {item.index + 1}</span>
                  <p className="font-medium text-sm leading-relaxed mt-0.5">{item.question}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-1.5 ml-7">
                {OPTIONS.map((opt) => {
                  const isCorrect = item.correctOption === opt;
                  const isSelected = item.selectedOption === opt;
                  const isWrong = isSelected && !isCorrect;

                  return (
                    <div
                      key={opt}
                      className={`flex items-start gap-2.5 rounded-lg p-2.5 text-sm ${
                        isCorrect
                          ? "bg-emerald-500/10 border border-emerald-500/30"
                          : isWrong
                          ? "bg-red-500/10 border border-red-500/30"
                          : "border border-transparent"
                      }`}
                    >
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                        isCorrect ? "bg-emerald-500 text-white"
                        : isWrong ? "bg-red-500 text-white"
                        : "bg-muted text-muted-foreground"
                      }`}>
                        {opt}
                      </span>
                      <div className="flex-1">
                        <p>{item.options[opt]}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.explanations[opt]}</p>
                      </div>
                      <div className="shrink-0">
                        {isCorrect && <Badge variant="outline" className="text-xs border-emerald-500/40 text-emerald-600 dark:text-emerald-400">Correct</Badge>}
                        {isWrong && <Badge variant="outline" className="text-xs border-red-500/40 text-red-600 dark:text-red-400">Your Answer</Badge>}
                      </div>
                    </div>
                  );
                })}

                {item.selectedOption === null && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-1">
                    <MinusCircle className="h-3 w-3" />Not answered
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
