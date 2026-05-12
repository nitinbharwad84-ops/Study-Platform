"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StatsCard } from "@/components/shared/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  Target,
  Play,
  ArrowRight,
  BookOpen,
  Clock,
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalAttempts: number;
  totalQuestions: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  subjectStats: { subjectName: string; attempts: number; accuracy: number; lastAttemptAt: string | null }[];
  resumable: {
    attemptId: string;
    subjectName: string;
    currentIndex: number;
    totalQuestions: number;
    timerMode: string;
  } | null;
  recentActivity: {
    attemptId: string;
    subjectName: string;
    score: number | null;
    totalQuestions: number;
    percentage: number | null;
    startedAt: string;
  }[];
}

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/mcq/dashboard-stats")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {/* show empty state */})
      .finally(() => setLoading(false));
  }, []);

  const stats = data
    ? [
        { title: "Total Exams", value: data.totalAttempts, icon: FileQuestion, description: "Exams attempted" },
        { title: "Questions Answered", value: data.totalQuestions, icon: CheckCircle2, description: "Total questions done" },
        { title: "Correct Answers", value: data.totalCorrect, icon: Target, description: `${data.accuracy}% accuracy` },
        { title: "Incorrect Answers", value: data.totalWrong, icon: XCircle, description: "Keep improving!" },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back 👋</h2>
          <p className="text-sm text-muted-foreground">
            {data?.totalAttempts
              ? `You have completed ${data.totalAttempts} exam${data.totalAttempts !== 1 ? "s" : ""} with ${data.accuracy}% accuracy`
              : "Here's an overview of your learning progress"}
          </p>
        </div>
        <Link href="/mcq">
          <Button>
            <Play className="mr-2 h-4 w-4" />
            Start New Exam
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      )}

      {/* Resume Exam CTA (only if active attempt) */}
      {data?.resumable && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold">Resume Exam</h3>
              <p className="text-sm text-muted-foreground">
                {data.resumable.subjectName} — Question {data.resumable.currentIndex + 1} of {data.resumable.totalQuestions}
              </p>
            </div>
            <Button
              size="sm"
              onClick={() => router.push(`/mcq/exam?attemptId=${data.resumable!.attemptId}`)}
            >
              Resume
              <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest exam attempts</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg bg-muted/30 animate-pulse" />
                ))}
              </div>
            ) : data?.recentActivity.length ? (
              <div className="space-y-3">
                {data.recentActivity.map((activity) => (
                  <button
                    key={activity.attemptId}
                    onClick={() => router.push(`/mcq/result?attemptId=${activity.attemptId}`)}
                    className="flex w-full items-center justify-between rounded-lg border p-3 text-left hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium">{activity.subjectName}</p>
                        <p className="text-xs text-muted-foreground">{formatRelative(activity.startedAt)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${
                        (activity.percentage ?? 0) >= 75 ? "text-emerald-600 dark:text-emerald-400"
                        : (activity.percentage ?? 0) >= 50 ? "text-amber-600 dark:text-amber-400"
                        : "text-red-600 dark:text-red-400"
                      }`}>
                        {activity.score}/{activity.totalQuestions}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.percentage?.toFixed(0)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <FileQuestion className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No exam activity yet.</p>
                <Link href="/mcq">
                  <Button size="sm" variant="outline" className="mt-1">
                    <Play className="mr-1.5 h-3.5 w-3.5" />Start your first exam
                  </Button>
                </Link>
              </div>
            )}
            {data?.recentActivity && data.recentActivity.length > 0 && (
              <Link href="/mcq/history">
                <Button variant="ghost" className="mt-3 w-full" size="sm">
                  View all history
                  <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject Performance</CardTitle>
            <CardDescription>Your accuracy across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1.5">
                    <div className="h-4 rounded bg-muted/40 animate-pulse w-2/3" />
                    <div className="h-2 rounded-full bg-muted/40 animate-pulse" />
                  </div>
                ))}
              </div>
            ) : data?.subjectStats.length ? (
              <div className="space-y-4">
                {data.subjectStats.map((perf) => (
                  <div key={perf.subjectName} className="space-y-1.5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{perf.subjectName}</span>
                      <span className="text-muted-foreground">
                        {perf.accuracy.toFixed(0)}% ({perf.attempts} exam{perf.attempts !== 1 ? "s" : ""})
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          perf.accuracy >= 75 ? "bg-emerald-500"
                          : perf.accuracy >= 50 ? "bg-amber-500"
                          : "bg-red-500"
                        }`}
                        style={{ width: `${perf.accuracy}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center gap-2">
                <Target className="h-8 w-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Complete exams to see subject performance.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/mcq">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Play className="h-3.5 w-3.5" />New Exam
            </Button>
          </Link>
          <Link href="/mcq/history">
            <Button variant="outline" size="sm" className="gap-1.5">
              <FileQuestion className="h-3.5 w-3.5" />View History
            </Button>
          </Link>
          {data?.resumable && (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => router.push(`/mcq/exam?attemptId=${data.resumable!.attemptId}`)}
            >
              <Clock className="h-3.5 w-3.5" />Resume Exam
            </Button>
          )}
          <Badge variant="outline" className="flex items-center gap-1 opacity-60 text-xs">
            <BookOpen className="h-3 w-3" />AI Chat — Coming Soon
          </Badge>
        </CardContent>
      </Card>
    </div>
  );
}
