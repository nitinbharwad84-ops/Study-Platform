"use client";

import React, { useState, useEffect } from "react";
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
import {
  ChevronLeft,
  ChevronRight,
  Timer,
  Flag,
  CheckCircle2,
  XCircle,
  Circle,
  Send,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

// Dummy question data
const DUMMY_QUESTIONS = [
  {
    id: 1,
    question: "A body is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
    options: {
      A: "10 m",
      B: "20 m",
      C: "40 m",
      D: "5 m",
    },
    correct: "B",
    explanations: {
      A: "Incorrect. Using h = v²/2g gives h = (20)²/(2×10) = 20 m, not 10 m.",
      B: "Correct! Using h = v²/2g → h = (20)²/(2×10) = 400/20 = 20 m.",
      C: "Incorrect. This would imply v²/2g = 40, meaning v = 28.3 m/s, not 20 m/s.",
      D: "Incorrect. This is too small. Check your formula — h = v²/2g.",
    },
  },
  {
    id: 2,
    question: "Which of the following is NOT a unit of energy?",
    options: { A: "Joule", B: "Watt", C: "Calorie", D: "Electron-volt" },
    correct: "B",
    explanations: {
      A: "Incorrect — Joule IS a unit of energy (SI unit).",
      B: "Correct! Watt is a unit of POWER (Joules per second), not energy.",
      C: "Incorrect — Calorie is a unit of energy (used in thermodynamics and nutrition).",
      D: "Incorrect — Electron-volt is a unit of energy used in atomic and nuclear physics.",
    },
  },
  {
    id: 3,
    question: "The wavelength of visible light ranges approximately from:",
    options: { A: "400–700 nm", B: "100–400 nm", C: "700–1000 nm", D: "10–100 nm" },
    correct: "A",
    explanations: {
      A: "Correct! Visible light spans from approximately 400 nm (violet) to 700 nm (red).",
      B: "Incorrect — this is the ultraviolet range, invisible to human eyes.",
      C: "Incorrect — this is the near-infrared range, beyond visible spectrum.",
      D: "Incorrect — this is the X-ray / deep UV range, far below visible light.",
    },
  },
  {
    id: 4,
    question: "Ohm's law states that the current through a conductor is:",
    options: {
      A: "Inversely proportional to voltage",
      B: "Directly proportional to resistance",
      C: "Directly proportional to the voltage across it",
      D: "Independent of temperature",
    },
    correct: "C",
    explanations: {
      A: "Incorrect — Current INCREASES with voltage (I = V/R).",
      B: "Incorrect — Current DECREASES with resistance (I = V/R).",
      C: "Correct! I = V/R — current is directly proportional to voltage at constant resistance.",
      D: "Incorrect — Ohm's law holds for constant temperature; resistance changes with temperature.",
    },
  },
  {
    id: 5,
    question: "What is the SI unit of electric charge?",
    options: { A: "Ampere", B: "Coulomb", C: "Volt", D: "Farad" },
    correct: "B",
    explanations: {
      A: "Incorrect — Ampere is the SI unit of electric CURRENT, not charge.",
      B: "Correct! The Coulomb (C) is the SI unit of electric charge.",
      C: "Incorrect — Volt is the SI unit of electric potential difference.",
      D: "Incorrect — Farad is the SI unit of capacitance.",
    },
  },
  {
    id: 6,
    question: "Newton's second law of motion states that F = ma. If mass doubles and acceleration halves, the force:",
    options: { A: "Doubles", B: "Halves", C: "Remains the same", D: "Quadruples" },
    correct: "C",
    explanations: {
      A: "Incorrect — F = (2m)(a/2) = ma, same as original force.",
      B: "Incorrect — recalculate: F = (2m)(a/2) = ma. Force is unchanged.",
      C: "Correct! F = (2m)(a/2) = ma — the force remains the same.",
      D: "Incorrect — quadrupling would require both mass and acceleration to double.",
    },
  },
  {
    id: 7,
    question: "Which phenomenon explains the bending of light around obstacles?",
    options: { A: "Reflection", B: "Refraction", C: "Diffraction", D: "Dispersion" },
    correct: "C",
    explanations: {
      A: "Incorrect — Reflection is the bouncing of light off surfaces.",
      B: "Incorrect — Refraction is the bending of light at an interface between two media.",
      C: "Correct! Diffraction is the bending of light around corners or through small openings.",
      D: "Incorrect — Dispersion is the splitting of light into its spectrum (e.g., in a prism).",
    },
  },
  {
    id: 8,
    question: "The speed of light in vacuum is approximately:",
    options: { A: "3 × 10⁸ m/s", B: "3 × 10⁶ m/s", C: "3 × 10¹⁰ m/s", D: "3 × 10⁴ m/s" },
    correct: "A",
    explanations: {
      A: "Correct! c ≈ 3 × 10⁸ m/s (exactly 299,792,458 m/s).",
      B: "Incorrect — this is 100 times smaller than the correct value.",
      C: "Incorrect — this is 100 times larger than the correct value.",
      D: "Incorrect — this is far too small; that's only 30 km/s.",
    },
  },
  {
    id: 9,
    question: "A force of 50 N acts on an object moving 10 m in the direction of the force. The work done is:",
    options: { A: "5 J", B: "500 J", C: "60 J", D: "0.2 J" },
    correct: "B",
    explanations: {
      A: "Incorrect — W = F × d = 50 × 10 = 500 J, not 5 J.",
      B: "Correct! W = F × d = 50 N × 10 m = 500 J.",
      C: "Incorrect — 60 J would mean F × d = 60, which doesn't match 50 × 10.",
      D: "Incorrect — this would come from dividing instead of multiplying.",
    },
  },
  {
    id: 10,
    question: "Which type of lens is used to correct myopia (short-sightedness)?",
    options: { A: "Convex lens", B: "Concave lens", C: "Cylindrical lens", D: "Plano-convex lens" },
    correct: "B",
    explanations: {
      A: "Incorrect — Convex lenses are used to correct hyperopia (long-sightedness).",
      B: "Correct! Concave (diverging) lenses correct myopia by moving the focal point back onto the retina.",
      C: "Incorrect — Cylindrical lenses are used to correct astigmatism.",
      D: "Incorrect — Plano-convex lenses are used in optical instruments, not for myopia correction.",
    },
  },
];

const TOTAL_TIME = 30 * 60; // 30 minutes in seconds


interface QuestionState {
  selected: string | null;
  locked: boolean;
  flagged: boolean;
}

export default function MCQExamPage() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionStates, setQuestionStates] = useState<QuestionState[]>(
    DUMMY_QUESTIONS.map(() => ({ selected: null, locked: false, flagged: false }))
  );
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showPalette] = useState(true);

  const currentQuestion = DUMMY_QUESTIONS[currentIndex];
  const currentState = questionStates[currentIndex];

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleOptionSelect = (option: string) => {
    if (currentState.locked) return;
    setQuestionStates((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], selected: option, locked: true };
      return next;
    });
    setShowExplanation(true);
  };

  const handleFlag = () => {
    setQuestionStates((prev) => {
      const next = [...prev];
      next[currentIndex] = { ...next[currentIndex], flagged: !next[currentIndex].flagged };
      return next;
    });
  };

  const answeredCount = questionStates.filter((q) => q.locked).length;
  const unansweredCount = DUMMY_QUESTIONS.length - answeredCount;

  const getOptionStyle = (option: string) => {
    if (!currentState.locked) {
      return currentState.selected === option
        ? "border-primary bg-primary/5"
        : "hover:border-muted-foreground/40 hover:bg-accent";
    }
    if (option === currentQuestion.correct) return "border-emerald-500 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400";
    if (option === currentState.selected && option !== currentQuestion.correct)
      return "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400";
    return "border-border opacity-60";
  };

  const getPaletteStyle = (idx: number) => {
    const state = questionStates[idx];
    if (idx === currentIndex) return "bg-primary text-primary-foreground";
    if (state.locked && state.selected === DUMMY_QUESTIONS[idx].correct)
      return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    if (state.locked) return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
    if (state.flagged) return "bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30";
    return "bg-muted text-muted-foreground hover:bg-accent";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Exam Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold">Physics Exam</p>
              <p className="text-xs text-muted-foreground">
                Question {currentIndex + 1} of {DUMMY_QUESTIONS.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Progress */}
            <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              <span>{answeredCount} answered</span>
              <span>·</span>
              <Circle className="h-3.5 w-3.5" />
              <span>{unansweredCount} remaining</span>
            </div>

            {/* Timer */}
            <div className={cn(
              "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-mono font-semibold",
              timeLeft < 300 ? "border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400" : "bg-muted"
            )}>
              <Timer className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>

            <Button size="sm" onClick={() => setShowSubmitDialog(true)}>
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Submit
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        <Progress
          value={(answeredCount / DUMMY_QUESTIONS.length) * 100}
          className="h-1 rounded-none"
        />
      </header>

      {/* Body */}
      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-6 p-4 sm:p-6">
        {/* Main question area */}
        <div className="flex-1 space-y-5">
          {/* Question */}
          <div className="rounded-xl border bg-card p-5 sm:p-6 shadow-sm">
            <div className="flex items-start justify-between gap-3 mb-5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">Q{currentIndex + 1}</Badge>
                {currentState.flagged && (
                  <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30 text-xs">
                    Flagged
                  </Badge>
                )}
              </div>
              <button
                onClick={handleFlag}
                className={cn(
                  "flex items-center gap-1 text-xs rounded-md px-2 py-1 border transition-colors",
                  currentState.flagged
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Flag className="h-3 w-3" />
                {currentState.flagged ? "Unflag" : "Flag"}
              </button>
            </div>

            <p className="text-base font-medium leading-relaxed">
              {currentQuestion.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(Object.entries(currentQuestion.options) as [string, string][]).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleOptionSelect(key)}
                disabled={currentState.locked}
                className={cn(
                  "w-full text-left rounded-xl border p-4 transition-all",
                  getOptionStyle(key),
                  !currentState.locked && "cursor-pointer"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    currentState.locked && key === currentQuestion.correct
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : currentState.locked && key === currentState.selected && key !== currentQuestion.correct
                      ? "border-red-500 bg-red-500 text-white"
                      : "border-current"
                  )}>
                    {key}
                  </span>
                  <span className="mt-0.5 text-sm">{value}</span>
                  {currentState.locked && key === currentQuestion.correct && (
                    <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-emerald-500" />
                  )}
                  {currentState.locked && key === currentState.selected && key !== currentQuestion.correct && (
                    <XCircle className="ml-auto h-5 w-5 shrink-0 text-red-500" />
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Explanation */}
          {showExplanation && currentState.locked && (
            <div className={cn(
              "rounded-xl border p-4 text-sm",
              currentState.selected === currentQuestion.correct
                ? "border-emerald-500/20 bg-emerald-500/5"
                : "border-red-500/20 bg-red-500/5"
            )}>
              <p className="font-semibold mb-2">
                {currentState.selected === currentQuestion.correct
                  ? "✅ Correct!"
                  : `❌ Incorrect — Correct answer: ${currentQuestion.correct}`}
              </p>
              <p className="text-muted-foreground">
                {currentQuestion.explanations[currentState.selected as keyof typeof currentQuestion.explanations]}
              </p>
              {currentState.selected !== currentQuestion.correct && (
                <p className="mt-2 text-muted-foreground border-t pt-2">
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Why {currentQuestion.correct} is correct: </span>
                  {currentQuestion.explanations[currentQuestion.correct as keyof typeof currentQuestion.explanations]}
                </p>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-2">
            <Button
              variant="outline"
              onClick={() => { setCurrentIndex((i) => i - 1); setShowExplanation(false); }}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Previous
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentIndex + 1} / {DUMMY_QUESTIONS.length}
            </span>

            {currentIndex < DUMMY_QUESTIONS.length - 1 ? (
              <Button
                onClick={() => { setCurrentIndex((i) => i + 1); setShowExplanation(false); }}
              >
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={() => setShowSubmitDialog(true)}>
                <Send className="mr-1 h-4 w-4" />
                Submit Exam
              </Button>
            )}
          </div>
        </div>

        {/* Question Palette */}
        {showPalette && (
          <div className="hidden lg:block w-52 shrink-0">
            <div className="sticky top-24 rounded-xl border bg-card p-4 shadow-sm space-y-4">
              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Question Palette
                </p>
                <div className="grid grid-cols-5 gap-1.5">
                  {DUMMY_QUESTIONS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => { setCurrentIndex(idx); setShowExplanation(questionStates[idx].locked); }}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-all",
                        getPaletteStyle(idx)
                      )}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-1.5 border-t pt-3">
                {[
                  { color: "bg-emerald-500/20 border-emerald-500/30", label: "Correct" },
                  { color: "bg-red-500/20 border-red-500/30", label: "Incorrect" },
                  { color: "bg-amber-500/20 border-amber-500/30", label: "Flagged" },
                  { color: "bg-muted", label: "Not answered" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={cn("h-4 w-4 rounded border", item.color)} />
                    <span className="text-xs text-muted-foreground">{item.label}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setShowSubmitDialog(true)}
              >
                <Send className="mr-1.5 h-3.5 w-3.5" />
                Submit Exam
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Submit Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Submit Exam?</AlertDialogTitle>
            <AlertDialogDescription>
              You have answered {answeredCount} of {DUMMY_QUESTIONS.length} questions.
              {unansweredCount > 0 && (
                <span className="block mt-1 text-amber-600 dark:text-amber-400">
                  ⚠ {unansweredCount} question{unansweredCount > 1 ? "s" : ""} left unanswered.
                </span>
              )}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => router.push("/mcq/result")}>
              Submit Exam
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
