"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCard } from "@/components/shared/stats-card";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import { Users, Target, BookOpen, TrendingUp } from "lucide-react";

const statsCards = [
  { title: "Total Exams", value: 1248, icon: BookOpen, description: "All time", trend: { value: 18, isPositive: true } },
  { title: "Average Score", value: "76%", icon: Target, description: "Last 30 days", trend: { value: 3, isPositive: true } },
  { title: "Active Users", value: 42, icon: Users, description: "Today", trend: { value: 12, isPositive: true } },
  { title: "Questions Served", value: "24.9K", icon: TrendingUp, description: "All time" },
];

const examsByDay = [
  { day: "Mon", exams: 38 },
  { day: "Tue", exams: 52 },
  { day: "Wed", exams: 45 },
  { day: "Thu", exams: 61 },
  { day: "Fri", exams: 74 },
  { day: "Sat", exams: 29 },
  { day: "Sun", exams: 18 },
];

const scoreDistribution = [
  { range: "0–40%", count: 28 },
  { range: "41–60%", count: 95 },
  { range: "61–75%", count: 186 },
  { range: "76–90%", count: 203 },
  { range: "91–100%", count: 88 },
];

const subjectBreakdown = [
  { name: "Physics", value: 380 },
  { name: "Chemistry", value: 290 },
  { name: "Mathematics", value: 420 },
  { name: "Biology", value: 158 },
];

const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b"];

const topStudents = [
  { name: "David Kim", exams: 31, accuracy: "88%" },
  { name: "Alice Johnson", exams: 24, accuracy: "82%" },
  { name: "Grace Thompson", exams: 9, accuracy: "79%" },
  { name: "Frank Liu", exams: 12, accuracy: "75%" },
  { name: "Bob Sharma", exams: 18, accuracy: "71%" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Analytics" description="Platform usage statistics and student performance insights" />

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Exams per day */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Exams Per Day (This Week)</CardTitle>
            <CardDescription>Daily exam volume</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={examsByDay} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="exams" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Score distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Score Distribution</CardTitle>
            <CardDescription>Number of exams per score range</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={scoreDistribution} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="range" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Subject Breakdown Pie */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Breakdown</CardTitle>
            <CardDescription>Questions served by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={subjectBreakdown} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3} dataKey="value">
                  {subjectBreakdown.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performers</CardTitle>
            <CardDescription>Students ranked by accuracy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topStudents.map((student, i) => (
                <div key={student.name} className="flex items-center gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground">{student.exams} exams</p>
                  </div>
                  <span className="text-sm font-semibold text-primary">{student.accuracy}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
