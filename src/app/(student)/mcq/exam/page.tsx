"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { LoadingSkeleton } from "@/components/shared/loading-skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { formatTime } from "@/lib/mcq/timer";
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  BookOpen,
  AlertCircle,
} from "lucide-react";

// -------------- Types --------------
interface QuestionSnapshot {
  question_index: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation_a: string;
  explanation_b: string;
  explanation_c: string;
  explanation_d: string;
}

interface AnswerState {
  question_index: number;
  selected_option: string | null;
  is_correct: boolean | null;
  is_locked: boolean;
  is_flagged: boolean;
}

interface AttemptMeta {
  id: string;
  subjectName: string;
  totalQuestions: number;
  timerMode: "per_question" | "full_exam" | "none";
  timerValue: number;
  currentIndex: number;
  status: string;
  expiresAt: string | null;
}

const OPTIONS = ["A", "B", "C", "D"] as const;

// Option text accessor
function getOption(q: QuestionSnapshot, opt: string): string {
  if (opt === "A") return q.option_a;
  if (opt === "B") return q.option_b;
  if (opt === "C") return q.option_c;
  return q.option_d;
}

// Explanation accessor
function getExplanation(q: QuestionSnapshot, opt: string): string {
  if (opt === "A") return q.explanation_a;
  if (opt === "B") return q.explanation_b;
  if (opt === "C") return q.explanation_c;
  return q.explanation_d;
}

function MCQExamContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const attemptId = searchParams.get("attemptId");

  // Attempt state
  const [meta, setMeta] = useState<AttemptMeta | null>(null);
  const [questions, setQuestions] = useState<QuestionSnapshot[]>([]);
  const [answers, setAnswers] = useState<AnswerState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [perQTimeLeft, setPerQTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [locking, setLocking] = useState(false);

  // ----- Load attempt on mount -----
  useEffect(() => {
    if (!attemptId) {
      setLoadError("No attempt ID provided.");
      setLoading(false);
      return;
    }

    fetch(`/api/mcq/${attemptId}/resume`)
      .then((r) => r.json())
      .then((data) => {
        // Redirect if already completed/expired
        if (data.status === "completed" || data.status === "expired") {
          router.replace(`/mcq/result?attemptId=${attemptId}`);
          return;
        }

        setMeta(data.attempt);
        setQuestions(data.questions);
        setAnswers(data.answers);
        setCurrentIndex(data.attempt.currentIndex ?? 0);

        // Set timer
        if (data.attempt.timerMode === "full_exam" && data.timerState) {
          setTimeLeft(data.timerState.secondsRemaining);
        } else if (data.attempt.timerMode === "per_question") {
          setPerQTimeLeft(data.attempt.timerValue);
        }
      })
      .catch(() => setLoadError("Failed to load exam. Please refresh."))
      .finally(() => setLoading(false));
  }, [attemptId, router]);

  // ----- Full Exam Timer -----
  useEffect(() => {
    if (!meta || meta.timerMode !== "full_exam" || timeLeft <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta?.timerMode, timeLeft > 0]);

  // ----- Per Question Timer -----
  useEffect(() => {
    if (!meta || meta.timerMode !== "per_question") return;

    setPerQTimeLeft(meta.timerValue);

    timerRef.current = setInterval(() => {
      setPerQTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          // Auto-advance if unanswered
          const curAnswer = answers[currentIndex];
          if (!curAnswer?.is_locked) {
            handleNavigate(Math.min(currentIndex + 1, (meta?.totalQuestions ?? 1) - 1));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, meta?.timerMode]);

  // ----- Lock Answer -----
  const handleSelectOption = useCallback(async (option: string) => {
    if (!meta || locking) return;
    const current = answers[currentIndex];
    if (current?.is_locked) return; // Already locked

    setLocking(true);

    // Optimistic UI update
    const correct = questions[currentIndex]?.correct_option;
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        selected_option: option,
        is_correct: option === correct,
        is_locked: true,
      };
      return updated;
    });

    try {
      await fetch(`/api/mcq/${attemptId}/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ questionIndex: currentIndex, selectedOption: option }),
      });
    } catch (e) {
      console.error("Failed to persist answer", e);
    } finally {
      setLocking(false);
    }
  }, [meta, locking, answers, currentIndex, questions, attemptId]);

  // ----- Navigation -----
  const handleNavigate = useCallback(async (newIndex: number) => {
    if (!meta) return;
    const clamped = Math.max(0, Math.min(newIndex, meta.totalQuestions - 1));
    setCurrentIndex(clamped);

    // Persist position for resume
    try {
      await fetch(`/api/mcq/${attemptId}/navigate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index: clamped }),
      });
    } catch { /* non-critical */ }
  }, [meta, attemptId]);

  // ----- Toggle Flag -----
  const handleToggleFlag = () => {
    setAnswers((prev) => {
      const updated = [...prev];
      updated[currentIndex] = {
        ...updated[currentIndex],
        is_flagged: !updated[currentIndex]?.is_flagged,
      };
      return updated;
    });
  };

  // ----- Auto Submit (timer expired) -----
  const handleAutoSubmit = useCallback(async () => {
    if (!attemptId) return;
    try {
      await fetch(`/api/mcq/${attemptId}/complete`, { method: "POST" });
      router.push(`/mcq/result?attemptId=${attemptId}`);
    } catch { /* redirect anyway */ }
  }, [attemptId, router]);

  // ----- Manual Submit -----
  const handleSubmit = async () => {
    if (!attemptId || submitting) return;
    setSubmitting(true);
    try {
      await fetch(`/api/mcq/${attemptId}/complete`, { method: "POST" });
      router.push(`/mcq/result?attemptId=${attemptId}`);
    } catch {
      setSubmitting(false);
    }
  };

  // ----- Loading / Error -----
  if (loading) return <LoadingSkeleton variant="page" />;
  if (loadError || !meta) {
    return (
      <ErrorState
        title="Could not load exam"
        description={loadError ?? "Unknown error occurred."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const currentAnswer = answers[currentIndex];
  const isLocked = currentAnswer?.is_locked ?? false;
  const isFlagged = currentAnswer?.is_flagged ?? false;

  const answeredCount = answers.filter((a) => a?.is_locked).length;
  const unansweredCount = meta.totalQuestions - answeredCount;
  const progressPct = (answeredCount / meta.totalQuestions) * 100;

  // Timer urgency (red when <20% time left)
  const timerUrgent =
    meta.timerMode === "full_exam"
      ? timeLeft < meta.timerValue * 0.2
      : meta.timerMode === "per_question"
      ? perQTimeLeft < meta.timerValue * 0.2
      : false;

  return (
    <div className="min-h-screen bg-background">
      {/* ---- Top Bar ---- */}
      <div className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur px-4 py-2">
        <div className="mx-auto max-w-3xl flex items-center justify-between gap-4">
          {/* Subject + Progress */}
          <div className="flex items-center gap-3 min-w-0">
            <Badge variant="outline" className="shrink-0 text-xs">{meta.subjectName}</Badge>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Q {currentIndex + 1} / {meta.totalQuestions}
            </span>
          </div>

          {/* Timer */}
          {meta.timerMode !== "none" && (
            <div className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-mono font-semibold ${
              timerUrgent
                ? "bg-red-500/10 text-red-600 dark:text-red-400 animate-pulse"
                : "bg-muted text-foreground"
            }`}>
              <Clock className="h-3.5 w-3.5" />
              {meta.timerMode === "full_exam"
                ? formatTime(timeLeft)
                : formatTime(perQTimeLeft)}
            </div>
          )}

          {/* Submit */}
          <Button size="sm" variant="outline" onClick={() => setShowSubmitDialog(true)} className="shrink-0">
            <Send className="mr-1.5 h-3.5 w-3.5" />Submit
          </Button>
        </div>

        {/* Progress bar */}
        <div className="mx-auto max-w-3xl mt-2">
          <Progress value={progressPct} className="h-1" />
        </div>
      </div>

      {/* ---- Question ---- */}
      <div className="mx-auto max-w-3xl px-4 py-6 space-y-6">
        {/* Question Card */}
        <div className="rounded-xl border bg-card p-5 shadow-sm space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Question {currentIndex + 1}</span>
            </div>
            <button
              onClick={handleToggleFlag}
              className={`rounded-full p-1 transition-colors ${
                isFlagged ? "text-amber-500" : "text-muted-foreground hover:text-amber-500"
              }`}
            >
              <Flag className="h-4 w-4" />
            </button>
          </div>
          <p className="text-base font-medium leading-relaxed">{currentQuestion?.question_text}</p>
        </div>

        <div className="space-y-3">
          {OPTIONS.map((opt) => {
            const text = currentQuestion ? getOption(currentQuestion, opt) : "";
            const explanation = currentQuestion ? getExplanation(currentQuestion, opt) : "";
            const selected = currentAnswer?.selected_option === opt;
            const correct = currentQuestion?.correct_option === opt;
            const wrong = isLocked && selected && !correct;
            const showCorrect = isLocked && correct;

            let style =
              "flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-all";

            if (!isLocked) {
              style += " border-border hover:border-primary hover:bg-primary/5 cursor-pointer";
            } else if (showCorrect) {
              style += " border-emerald-500 bg-emerald-500/10";
            } else if (wrong) {
              style += " border-red-500 bg-red-500/10";
            } else {
              style += " border-border opacity-60";
            }

            return (
              <button
                key={opt}
                disabled={isLocked || locking}
                onClick={() => handleSelectOption(opt)}
                className={style}
              >
                {/* Option letter circle */}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold mt-0.5 ${
                  showCorrect ? "bg-emerald-500 text-white"
                  : wrong ? "bg-red-500 text-white"
                  : selected ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}>
                  {opt}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm font-medium">{text}</p>
                  {isLocked && explanation && (
                    <p className="text-xs text-muted-foreground bg-background/50 rounded-lg p-2 leading-relaxed">
                      {explanation}
                    </p>
                  )}
                </div>
                {isLocked && showCorrect && <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />}
                {isLocked && wrong && <XCircle className="h-4 w-4 text-red-500 shrink-0 mt-1" />}
              </button>
            );
          })}
        </div>


        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => handleNavigate(currentIndex - 1)}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />Previous
          </Button>

          {/* Question Palette */}
          <div className="flex flex-wrap gap-1.5 max-w-xs justify-center">
            {answers.map((a, i) => (
              <button
                key={i}
                onClick={() => handleNavigate(i)}
                title={`Question ${i + 1}`}
                className={`h-7 w-7 rounded text-xs font-medium transition-all ${
                  i === currentIndex
                    ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-1"
                    : a?.is_locked
                    ? a.is_correct
                      ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400"
                      : "bg-red-500/20 text-red-700 dark:text-red-400"
                    : a?.is_flagged
                    ? "bg-amber-500/20 text-amber-700 dark:text-amber-400"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            onClick={() => {
              if (currentIndex === meta.totalQuestions - 1) {
                setShowSubmitDialog(true);
              } else {
                handleNavigate(currentIndex + 1);
              }
            }}
          >
            {currentIndex === meta.totalQuestions - 1 ? (
              <><Send className="mr-1.5 h-4 w-4" />Submit</>
            ) : (
              <>Next<ChevronRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>

      {/* ---- Submit Confirmation Dialog ---- */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm">
                <p>You are about to submit your exam. This action cannot be undone.</p>
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{answeredCount} answered</span>
                  </div>
                  {unansweredCount > 0 && (
                    <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                      <AlertCircle className="h-4 w-4" />
                      <span>{unansweredCount} unanswered</span>
                    </div>
                  )}
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Exam</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} disabled={submitting}>
              {submitting ? "Submitting..." : "Submit Exam"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function MCQExamPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <MCQExamContent />
    </Suspense>
  );
}
