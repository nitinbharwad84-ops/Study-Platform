"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsCard } from "@/components/shared/stats-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users, ShieldCheck, BookOpen, Database, Cpu, KeyRound,
  ScrollText, ArrowRight, CheckCircle2, XCircle, AlertTriangle, Loader2,
} from "lucide-react";
import Link from "next/link";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

import { formatDistanceToNow } from "date-fns";

// Move logic into the component

export default function AdminDashboardPage() {
  const [data, setData] = React.useState<{ 
    stats?: { 
      totalUsers?: number; 
      totalAdmins?: number; 
      totalSubjects?: number; 
      totalQuestions?: number; 
      totalProviders?: number; 
      pendingResets?: number; 
    }; 
    recentLogs?: { 
      action: string; 
      actor_email: string; 
      created_at: string; 
      severity: string; 
    }[] 
  } | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = [
    { title: "Total Users", value: data?.stats?.totalUsers || 0, icon: Users, description: "Registered accounts" },
    { title: "Admins", value: data?.stats?.totalAdmins || 0, icon: ShieldCheck, description: "Management staff" },
    { title: "Subjects", value: data?.stats?.totalSubjects || 0, icon: BookOpen, description: "Academic units" },
    { title: "MCQ Questions", value: data?.stats?.totalQuestions || 0, icon: Database, description: "In question bank" },
    { title: "AI Providers", value: data?.stats?.totalProviders || 0, icon: Cpu, description: "Integrated LLMs" },
    { title: "Pending Resets", value: data?.stats?.pendingResets || 0, icon: KeyRound, description: "Password requests" },
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

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Platform overview and management" />

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => <StatsCard key={stat.title} {...stat} />)}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Exams chart — takes 2/3 */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Exams This Week</CardTitle>
                <CardDescription>Daily exam completions (last 7 days)</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
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

            {/* Quick Actions — takes 1/3 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Quick Actions</CardTitle>
                <CardDescription>Common tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {[
                  { label: "Manage Users", href: "/admin/users", icon: Users },
                  { label: "Add Emails", href: "/admin/approved-emails", icon: KeyRound },
                  { label: "MCQ Content", href: "/admin/mcq-content", icon: Database },
                  { label: "Audit Logs", href: "/admin/audit", icon: ScrollText },
                  { label: "AI Providers", href: "/admin/providers", icon: Cpu },
                ].map((action) => (
                  <Link key={action.href} href={action.href}>
                    <Button variant="outline" className="w-full justify-start gap-2 h-9">
                      <action.icon className="h-4 w-4" />
                      {action.label}
                      <ArrowRight className="ml-auto h-3 w-3 opacity-50" />
                    </Button>
                  </Link>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Recent Audit */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base">Recent Activity</CardTitle>
                <CardDescription>Latest audit log entries</CardDescription>
              </div>
              <Link href="/admin/audit">
                <Button variant="ghost" size="sm">
                  View All <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {(data?.recentLogs || []).map((entry, i: number) => (
                  <div key={i} className="flex items-center gap-3 rounded-lg border p-3 text-sm">
                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      entry.severity === "success" ? "bg-emerald-500/10" :
                      entry.severity === "error" ? "bg-red-500/10" :
                      entry.severity === "warning" ? "bg-amber-500/10" : "bg-blue-500/10"
                    }`}>
                      {entry.severity === "success" ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> :
                       entry.severity === "error" ? <XCircle className="h-3.5 w-3.5 text-red-600 dark:text-red-400" /> :
                       entry.severity === "warning" ? <AlertTriangle className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" /> :
                       <ScrollText className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{entry.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {entry.actor_email || "System"} · {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
