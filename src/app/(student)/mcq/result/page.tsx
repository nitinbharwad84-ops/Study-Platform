"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  LayoutDashboard,
  RotateCcw,
  FileText,
  Trophy,
} from "lucide-react";

interface ResultData {
  attemptId: string;
  subjectName: string;
  totalQuestions: number;
  score: number;
  percentage: number;
  correctCount: number;
  wrongCount: number;
  unansweredCount: number;
  timerMode: string;
  completedAt: string;
  startedAt: string;
  summary: string;
}

function ScoreRing({ percentage }: { percentage: number }) {
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDash = (percentage / 100) * circumference;
  const color =
    percentage >= 75
      ? "#22c55e"
      : percentage >= 50
      ? "#f59e0b"
      : "#ef4444";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-muted/30" />
        <circle
          cx="70" cy="70" r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${strokeDash} ${circumference}`}
          strokeLinecap="round"
          style={{ transition: "stroke-dasharray 1s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <Trophy className="h-5 w-5 mb-1" style={{ color }} />
        <span className="text-3xl font-bold" style={{ color }}>
          {percentage.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

export default function MCQResultPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <MCQResultContent />
    </Suspense>
  );
}

function MCQResultContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  const [result, setResult] = useState<ResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!attemptId) {
      setError("No attempt ID provided.");
      setLoading(false);
      return;
    }

    fetch(`/api/mcq/result/${attemptId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) throw new Error(data.error);
        setResult(data);
      })
      .catch((e) => setError(e.message || "Failed to load result."))
      .finally(() => setLoading(false));
  }, [attemptId]);

  if (loading) return <LoadingSkeleton variant="card-grid" count={4} />;
  if (error || !result) {
    return (
      <ErrorState
        title="Could not load result"
        description={error ?? "Unknown error."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const statCards = [
    {
      label: "Correct",
      value: result.correctCount,
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      label: "Wrong",
      value: result.wrongCount,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bg: "bg-red-500/10 border-red-500/20",
    },
    {
      label: "Skipped",
      value: result.unansweredCount,
      icon: MinusCircle,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <Badge variant="outline" className="mb-2">{result.subjectName}</Badge>
          <h1 className="text-2xl font-bold">Exam Complete</h1>
          <p className="text-sm text-muted-foreground">
            {result.score} / {result.totalQuestions} questions correct
          </p>
        </div>

        {/* Score Ring */}
        <Card>
          <CardContent className="flex flex-col items-center gap-4 pt-6 pb-5">
            <ScoreRing percentage={result.percentage} />
            <p className="text-center text-sm text-muted-foreground leading-relaxed px-4">
              {result.summary}
            </p>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((stat) => (
            <Card key={stat.label} className={`border ${stat.bg}`}>
              <CardContent className="flex flex-col items-center gap-1 py-4">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                <span className="text-xs text-muted-foreground">{stat.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="space-y-2.5">
          <Button
            className="w-full gap-2"
            onClick={() => router.push(`/mcq/review?attemptId=${attemptId}`)}
          >
            <FileText className="h-4 w-4" />
            View Detailed Review
          </Button>
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push("/dashboard")}
            >
              <LayoutDashboard className="h-4 w-4" />Dashboard
            </Button>
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => router.push("/mcq")}
            >
              <RotateCcw className="h-4 w-4" />New Exam
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
