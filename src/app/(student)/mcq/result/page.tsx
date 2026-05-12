import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  MinusCircle,
  Timer,
  RotateCcw,
  Eye,
  Home,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// Dummy result data
const RESULT = {
  subject: "Physics",
  total: 10,
  correct: 7,
  wrong: 2,
  unanswered: 1,
  timeTaken: "18:42",
  avgTimePerQuestion: "1:52",
  score: 70,
};

const subjectBreakdown = [
  { topic: "Mechanics", correct: 3, total: 4 },
  { topic: "Electricity", correct: 2, total: 3 },
  { topic: "Optics", correct: 2, total: 3 },
];

function ScoreRing({ score }: { score: number }) {
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? "#10b981" : score >= 60 ? "#3b82f6" : score >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative flex items-center justify-center w-36 h-36">
      <svg className="absolute -rotate-90 w-36 h-36">
        <circle cx="72" cy="72" r="54" fill="none" stroke="currentColor" strokeWidth="12" className="text-muted/30" />
        <circle
          cx="72" cy="72" r="54" fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="text-center">
        <p className="text-3xl font-bold" style={{ color }}>{score}%</p>
        <p className="text-xs text-muted-foreground">Score</p>
      </div>
    </div>
  );
}

export default function MCQResultPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-2">
            <Badge variant="outline">{RESULT.subject}</Badge>
            <span>·</span>
            <span>{RESULT.total} Questions</span>
          </div>
          <h1 className="text-2xl font-bold">Exam Complete!</h1>
          <p className="text-sm text-muted-foreground">
            {RESULT.score >= 80 ? "🎉 Excellent performance! Keep it up." :
             RESULT.score >= 60 ? "👍 Good effort. Review the incorrect answers." :
             "📚 Keep practicing — review the concepts below."}
          </p>
        </div>

        {/* Score Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center">
              {/* Ring */}
              <ScoreRing score={RESULT.score} />

              {/* Breakdown */}
              <div className="flex-1 grid grid-cols-3 gap-4 text-center sm:text-left sm:grid-cols-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-2xl font-bold">{RESULT.correct}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Correct</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-red-600 dark:text-red-400">
                    <XCircle className="h-4 w-4" />
                    <span className="text-2xl font-bold">{RESULT.wrong}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Wrong</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-center sm:justify-start gap-1.5 text-muted-foreground">
                    <MinusCircle className="h-4 w-4" />
                    <span className="text-2xl font-bold">{RESULT.unanswered}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Skipped</p>
                </div>
              </div>
            </div>

            {/* Time stats */}
            <div className="mt-5 grid grid-cols-2 gap-3 border-t pt-4">
              <div className="flex items-center gap-2 text-sm">
                <Timer className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Time Taken:</span>
                <span className="font-medium">{RESULT.timeTaken}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Avg/Question:</span>
                <span className="font-medium">{RESULT.avgTimePerQuestion}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Topic Breakdown */}
        <Card>
          <CardContent className="p-5">
            <p className="text-sm font-semibold mb-4">Topic Breakdown</p>
            <div className="space-y-3">
              {subjectBreakdown.map((topic) => {
                const pct = Math.round((topic.correct / topic.total) * 100);
                return (
                  <div key={topic.topic} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span>{topic.topic}</span>
                      <span className="text-muted-foreground">
                        {topic.correct}/{topic.total} ({pct}%)
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/mcq/review" className="flex-1">
            <Button variant="outline" className="w-full">
              <Eye className="mr-2 h-4 w-4" />
              Review Answers
            </Button>
          </Link>
          <Link href="/mcq" className="flex-1">
            <Button variant="outline" className="w-full">
              <RotateCcw className="mr-2 h-4 w-4" />
              New Exam
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button className="w-full">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
