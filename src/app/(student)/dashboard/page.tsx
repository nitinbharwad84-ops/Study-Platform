import React from "react";
import { StatsCard } from "@/components/shared/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileQuestion,
  CheckCircle2,
  XCircle,
  Target,
  TrendingUp,
  Clock,
  Play,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import Link from "next/link";

// Dummy data for the dashboard
const stats = [
  { title: "Total Exams", value: 24, icon: FileQuestion, description: "Exams completed", trend: { value: 12, isPositive: true } },
  { title: "Questions Answered", value: 480, icon: CheckCircle2, description: "Across all exams" },
  { title: "Correct Answers", value: 384, icon: Target, description: "80% accuracy", trend: { value: 5, isPositive: true } },
  { title: "Incorrect Answers", value: 96, icon: XCircle, description: "Keep improving!" },
  { title: "Average Score", value: "80%", icon: TrendingUp, description: "Last 10 exams", trend: { value: 3, isPositive: true } },
  { title: "Time Spent", value: "12h", icon: Clock, description: "Total study time" },
];

const recentActivity = [
  { subject: "Physics", score: 85, total: 20, date: "2 hours ago", status: "completed" },
  { subject: "Chemistry", score: 72, total: 20, date: "Yesterday", status: "completed" },
  { subject: "Mathematics", score: 90, total: 30, date: "2 days ago", status: "completed" },
  { subject: "Biology", score: 0, total: 20, date: "3 days ago", status: "in_progress" },
];

const subjectPerformance = [
  { subject: "Physics", exams: 8, accuracy: 82, avgScore: 82 },
  { subject: "Chemistry", exams: 6, accuracy: 75, avgScore: 75 },
  { subject: "Mathematics", exams: 7, accuracy: 88, avgScore: 88 },
  { subject: "Biology", exams: 3, accuracy: 70, avgScore: 70 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, John 👋
          </h2>
          <p className="text-sm text-muted-foreground">
            Here&apos;s an overview of your learning progress
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
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Resume Exam CTA */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="flex items-center gap-4 p-4 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <Play className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Resume Exam</h3>
            <p className="text-sm text-muted-foreground">
              You have an in-progress Biology exam (12/20 questions answered)
            </p>
          </div>
          <Button variant="outline" size="sm">
            Resume
            <ArrowRight className="ml-1 h-3 w-3" />
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Your latest exam attempts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{activity.subject}</p>
                      <p className="text-xs text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {activity.status === "completed" ? (
                      <>
                        <p className="text-sm font-semibold">
                          {activity.score}/{activity.total}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {Math.round((activity.score / activity.total) * 100)}%
                        </p>
                      </>
                    ) : (
                      <Badge variant="outline" className="border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400">
                        In Progress
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Link href="/mcq/history">
              <Button variant="ghost" className="mt-3 w-full" size="sm">
                View all history
                <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Subject Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Subject Performance</CardTitle>
            <CardDescription>Your accuracy across subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {subjectPerformance.map((perf) => (
                <div key={perf.subject} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{perf.subject}</span>
                    <span className="text-muted-foreground">
                      {perf.accuracy}% ({perf.exams} exams)
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${perf.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
