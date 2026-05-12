"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, MinusCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const REVIEW_QUESTIONS = [
  {
    id: 1,
    question: "A body is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached? (g = 10 m/s²)",
    options: { A: "10 m", B: "20 m", C: "40 m", D: "5 m" },
    correct: "B",
    selected: "B",
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
    selected: "A",
    explanations: {
      A: "Incorrect — Joule IS a unit of energy (SI unit).",
      B: "Correct! Watt is a unit of POWER (Joules per second), not energy.",
      C: "Incorrect — Calorie is a unit of energy used in thermodynamics and nutrition.",
      D: "Incorrect — Electron-volt is a unit of energy used in atomic and nuclear physics.",
    },
  },
  {
    id: 3,
    question: "The wavelength of visible light ranges approximately from:",
    options: { A: "400–700 nm", B: "100–400 nm", C: "700–1000 nm", D: "10–100 nm" },
    correct: "A",
    selected: "A",
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
    selected: "C",
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
    selected: "B",
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
    selected: "C",
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
    selected: "B",
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
    selected: "A",
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
    selected: null,
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
    selected: "B",
    explanations: {
      A: "Incorrect — Convex lenses are used to correct hyperopia (long-sightedness).",
      B: "Correct! Concave (diverging) lenses correct myopia by moving the focal point back onto the retina.",
      C: "Incorrect — Cylindrical lenses are used to correct astigmatism.",
      D: "Incorrect — Plano-convex lenses are used in optical instruments, not for myopia correction.",
    },
  },
];

export default function MCQReviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const q = REVIEW_QUESTIONS[currentIndex];

  const getOptionStyle = (key: string) => {
    if (key === q.correct) return "border-emerald-500 bg-emerald-500/10";
    if (key === q.selected && key !== q.correct) return "border-red-500 bg-red-500/10";
    return "border-border opacity-50";
  };

  const getPaletteStyle = (idx: number) => {
    const item = REVIEW_QUESTIONS[idx];
    if (idx === currentIndex) return "bg-primary text-primary-foreground";
    if (item.selected === null) return "bg-muted text-muted-foreground";
    if (item.selected === item.correct) return "bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 border-emerald-500/30";
    return "bg-red-500/20 text-red-700 dark:text-red-400 border-red-500/30";
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center justify-between px-4 py-3 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Badge variant="outline">Physics — Review Mode</Badge>
            <span className="text-sm text-muted-foreground hidden sm:block">Read-only — no changes allowed</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            <span>7 Correct</span>
            <XCircle className="h-4 w-4 text-red-500 ml-2" />
            <span>2 Wrong</span>
            <MinusCircle className="h-4 w-4 ml-2" />
            <span>1 Skipped</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 max-w-6xl mx-auto w-full gap-6 p-4 sm:p-6">
        {/* Main area */}
        <div className="flex-1 space-y-5">
          {/* Status banner */}
          <div className={cn(
            "flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm font-medium",
            q.selected === null
              ? "border-border bg-muted text-muted-foreground"
              : q.selected === q.correct
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              : "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400"
          )}>
            {q.selected === null
              ? <><MinusCircle className="h-4 w-4" /> Not Answered</>
              : q.selected === q.correct
              ? <><CheckCircle2 className="h-4 w-4" /> Correct Answer</>
              : <><XCircle className="h-4 w-4" /> Incorrect — Correct answer is <strong className="ml-1">{q.correct}: {q.options[q.correct as keyof typeof q.options]}</strong></>}
          </div>

          {/* Question */}
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="outline">Q{q.id}</Badge>
            </div>
            <p className="text-base font-medium leading-relaxed">{q.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {(Object.entries(q.options) as [string, string][]).map(([key, value]) => (
              <div
                key={key}
                className={cn("rounded-xl border p-4 transition-all", getOptionStyle(key))}
              >
                <div className="flex items-start gap-3">
                  <span className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-sm font-semibold",
                    key === q.correct ? "border-emerald-500 bg-emerald-500 text-white"
                    : key === q.selected && key !== q.correct ? "border-red-500 bg-red-500 text-white"
                    : "border-current opacity-60"
                  )}>
                    {key}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm">{value}</p>
                    <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                      {q.explanations[key as keyof typeof q.explanations]}
                    </p>
                  </div>
                  {key === q.correct && <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />}
                  {key === q.selected && key !== q.correct && <XCircle className="h-5 w-5 shrink-0 text-red-500" />}
                </div>
              </div>
            ))}
          </div>

          {/* Nav */}
          <div className="flex items-center justify-between pt-2">
            <Button variant="outline" onClick={() => setCurrentIndex((i) => i - 1)} disabled={currentIndex === 0}>
              <ChevronLeft className="mr-1 h-4 w-4" /> Previous
            </Button>
            <span className="text-sm text-muted-foreground">{currentIndex + 1} / {REVIEW_QUESTIONS.length}</span>
            {currentIndex < REVIEW_QUESTIONS.length - 1 ? (
              <Button onClick={() => setCurrentIndex((i) => i + 1)}>
                Next <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Link href="/mcq/result">
                <Button variant="outline">Back to Result</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Palette */}
        <div className="hidden lg:block w-48 shrink-0">
          <div className="sticky top-20 rounded-xl border bg-card p-4 shadow-sm space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Questions</p>
            <div className="grid grid-cols-5 gap-1.5">
              {REVIEW_QUESTIONS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-all",
                    getPaletteStyle(idx)
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <div className="space-y-1.5 border-t pt-3">
              {[
                { color: "bg-emerald-500/20 border-emerald-500/30", label: "Correct" },
                { color: "bg-red-500/20 border-red-500/30", label: "Wrong" },
                { color: "bg-muted", label: "Skipped" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-2">
                  <div className={cn("h-4 w-4 rounded border", item.color)} />
                  <span className="text-xs text-muted-foreground">{item.label}</span>
                </div>
              ))}
            </div>
            <Link href="/mcq/result">
              <Button variant="outline" size="sm" className="w-full">Back to Result</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
