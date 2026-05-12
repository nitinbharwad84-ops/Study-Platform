"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { BookOpen, Clock, Timer, Zap, AlertCircle, PlayCircle } from "lucide-react";

type Subject = {
  id: string;
  name: string;
  description: string;
  question_count: number;
};

const QUESTION_COUNTS = [5, 10, 20, 30, 50];
const TIMER_MODES = [
  { value: "full_exam", label: "Full Exam Timer", description: "One countdown for the entire exam" },
  { value: "per_question", label: "Per Question Timer", description: "Separate timer resets each question" },
  { value: "none", label: "No Timer", description: "Practice at your own pace" },
] as const;

type TimerMode = "full_exam" | "per_question" | "none";

const FULL_EXAM_DURATIONS = [
  { label: "15 min", value: 15 * 60 },
  { label: "20 min", value: 20 * 60 },
  { label: "30 min", value: 30 * 60 },
  { label: "45 min", value: 45 * 60 },
  { label: "60 min", value: 60 * 60 },
];

const PER_Q_DURATIONS = [
  { label: "30 sec", value: 30 },
  { label: "60 sec", value: 60 },
  { label: "90 sec", value: 90 },
  { label: "2 min", value: 120 },
];

export default function MCQPage() {
  const router = useRouter();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // Config state
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [timerMode, setTimerMode] = useState<TimerMode>("full_exam");
  const [timerValue, setTimerValue] = useState<number>(30 * 60);

  // Load subjects
  useEffect(() => {
    fetch("/api/mcq/subjects")
      .then((r) => r.json())
      .then((data) => {
        setSubjects(data.subjects || []);
        if (data.subjects?.length > 0) setSelectedSubject(data.subjects[0].id);
      })
      .catch(() => setError("Failed to load subjects. Please refresh."))
      .finally(() => setLoading(false));
  }, []);

  // Reset timer value when mode changes
  useEffect(() => {
    if (timerMode === "full_exam") setTimerValue(30 * 60);
    else if (timerMode === "per_question") setTimerValue(90);
    else setTimerValue(0);
  }, [timerMode]);

  const selectedSubjectData = subjects.find((s) => s.id === selectedSubject);
  const hasEnoughQuestions = selectedSubjectData
    ? selectedSubjectData.question_count >= questionCount
    : false;

  const handleStart = async () => {
    if (!selectedSubject || !hasEnoughQuestions) return;
    setStarting(true);
    setStartError(null);

    try {
      const res = await fetch("/api/mcq/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId: selectedSubject,
          count: questionCount,
          timerMode,
          timerValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStartError(data.error || "Failed to start exam. Please try again.");
        return;
      }

      router.push(`/mcq/exam?attemptId=${data.attemptId}`);
    } catch {
      setStartError("Network error. Please check your connection.");
    } finally {
      setStarting(false);
    }
  };

  if (loading) return <LoadingSkeleton variant="card-grid" count={4} />;
  if (error) return <ErrorState title="Could not load subjects" description={error} onRetry={() => window.location.reload()} />;

  return (
    <div className="space-y-6 max-w-2xl">
      <PageHeader
        title="MCQ Exam"
        description="Configure your exam settings and start when ready"
      />

      {/* Subject Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <BookOpen className="h-4 w-4" />Subject
          </CardTitle>
          <CardDescription>Choose the subject for this exam</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {subjects.map((subject) => (
              <button
                key={subject.id}
                onClick={() => setSelectedSubject(subject.id)}
                className={`flex items-center justify-between rounded-lg border p-3 text-left transition-all hover:bg-accent ${
                  selectedSubject === subject.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border"
                }`}
              >
                <div>
                  <p className="font-medium text-sm">{subject.name}</p>
                  <p className="text-xs text-muted-foreground">{subject.description}</p>
                </div>
                <Badge variant="outline" className="ml-3 shrink-0 text-xs">
                  {subject.question_count} Qs
                </Badge>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Question Count */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Zap className="h-4 w-4" />Question Count
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {QUESTION_COUNTS.map((count) => {
              const available = selectedSubjectData?.question_count ?? 0;
              const disabled = count > available;
              return (
                <button
                  key={count}
                  disabled={disabled}
                  onClick={() => setQuestionCount(count)}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
                    questionCount === count
                      ? "border-primary bg-primary text-primary-foreground"
                      : disabled
                      ? "cursor-not-allowed border-border text-muted-foreground opacity-40"
                      : "border-border hover:bg-accent"
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
          {selectedSubjectData && (
            <p className="text-xs text-muted-foreground mt-2">
              {selectedSubjectData.question_count} questions available in {selectedSubjectData.name}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Timer Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" />Timer Mode
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid gap-2">
            {TIMER_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setTimerMode(mode.value)}
                className={`flex items-start gap-3 rounded-lg border p-3 text-left transition-all hover:bg-accent ${
                  timerMode === mode.value
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border"
                }`}
              >
                <Timer className={`mt-0.5 h-4 w-4 shrink-0 ${timerMode === mode.value ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <p className="font-medium text-sm">{mode.label}</p>
                  <p className="text-xs text-muted-foreground">{mode.description}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Timer Duration */}
          {timerMode !== "none" && (
            <div className="mt-3">
              <p className="text-xs font-medium text-muted-foreground mb-1.5">
                {timerMode === "full_exam" ? "Exam Duration" : "Time Per Question"}
              </p>
              <div className="flex flex-wrap gap-2">
                {(timerMode === "full_exam" ? FULL_EXAM_DURATIONS : PER_Q_DURATIONS).map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setTimerValue(d.value)}
                    className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                      timerValue === d.value
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Insufficient Questions Warning */}
      {selectedSubjectData && !hasEnoughQuestions && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-700 dark:text-amber-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Only {selectedSubjectData.question_count} questions available in {selectedSubjectData.name}. Please select a lower count.
          </span>
        </div>
      )}

      {/* Start Error */}
      {startError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{startError}</span>
        </div>
      )}

      {/* Start Button */}
      <Button
        className="w-full gap-2"
        size="lg"
        onClick={handleStart}
        disabled={!selectedSubject || !hasEnoughQuestions || starting}
      >
        <PlayCircle className="h-5 w-5" />
        {starting ? "Starting Exam..." : "Start Exam"}
      </Button>
    </div>
  );
}
