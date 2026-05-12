"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Clock,
  FileText,
  PlayCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface Attempt {
  id: string;
  subjectName: string;
  totalQuestions: number;
  timerMode: string;
  status: string;
  score: number | null;
  percentage: number | null;
  correctCount: number | null;
  wrongCount: number | null;
  unansweredCount: number | null;
  startedAt: string;
  completedAt: string | null;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusBadgeLocal({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    completed: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    in_progress: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    expired: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    abandoned: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-400",
  };
  return (
    <Badge variant="outline" className={`text-xs capitalize ${cfg[status] ?? ""}`}>
      {status.replace("_", " ")}
    </Badge>
  );
}

export default function MCQHistoryPage() {
  const router = useRouter();
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadHistory = useCallback(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "8" });
    if (subjectFilter !== "all") params.set("subjectId", subjectFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);

    fetch(`/api/mcq/history?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setAttempts(data.attempts || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch(() => setError("Failed to load exam history."))
      .finally(() => setLoading(false));
  }, [page, subjectFilter, statusFilter]);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // Reset page when filter changes
  const handleFilterChange = (type: "subject" | "status", val: string) => {
    setPage(1);
    if (type === "subject") setSubjectFilter(val);
    else setStatusFilter(val);
  };

  if (error) return <ErrorState title="Could not load history" description={error} onRetry={loadHistory} />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam History"
        description={`${total} total attempts`}
      />

      {/* Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        <Select value={statusFilter} onValueChange={(v) => handleFilterChange("status", v)}>
          <SelectTrigger className="w-36 h-8 text-xs">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Attempt List */}
      {loading ? (
        <LoadingSkeleton variant="card-grid" count={4} />
      ) : attempts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 gap-3">
          <FileText className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No exam attempts yet.</p>
          <Button size="sm" onClick={() => router.push("/mcq")}>
            <PlayCircle className="mr-1.5 h-4 w-4" />Start Your First Exam
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {attempts.map((attempt) => {
            const isResumable = attempt.status === "in_progress";

            return (
              <Card key={attempt.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Subject + Status */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-medium text-sm">{attempt.subjectName}</p>
                        <StatusBadgeLocal status={attempt.status} />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {attempt.totalQuestions} questions · {attempt.timerMode.replace("_", " ")} · {formatDate(attempt.startedAt)}
                      </p>
                    </div>

                    {/* Score */}
                    {attempt.status === "completed" && attempt.percentage !== null && (
                      <div className="text-center">
                        <p className={`text-xl font-bold ${
                          attempt.percentage >= 75 ? "text-emerald-600 dark:text-emerald-400"
                          : attempt.percentage >= 50 ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                        }`}>
                          {attempt.percentage.toFixed(0)}%
                        </p>
                        <p className="text-xs text-muted-foreground">{attempt.score}/{attempt.totalQuestions}</p>
                      </div>
                    )}

                    {/* Mini stats */}
                    {attempt.status === "completed" && (
                      <div className="flex gap-3 text-xs">
                        <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="h-3.5 w-3.5" />{attempt.correctCount}
                        </div>
                        <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                          <XCircle className="h-3.5 w-3.5" />{attempt.wrongCount}
                        </div>
                        <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                          <MinusCircle className="h-3.5 w-3.5" />{attempt.unansweredCount}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      {isResumable ? (
                        <Button size="sm" onClick={() => router.push(`/mcq/exam?attemptId=${attempt.id}`)}>
                          <Clock className="mr-1.5 h-3.5 w-3.5" />Resume
                        </Button>
                      ) : attempt.status === "completed" ? (
                        <>
                          <Button size="sm" variant="outline" onClick={() => router.push(`/mcq/result?attemptId=${attempt.id}`)}>
                            Result
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => router.push(`/mcq/review?attemptId=${attempt.id}`)}>
                            <FileText className="mr-1.5 h-3.5 w-3.5" />Review
                          </Button>
                        </>
                      ) : null}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
