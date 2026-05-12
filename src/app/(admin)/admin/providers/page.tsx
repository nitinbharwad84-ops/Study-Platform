"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Cpu, CheckCircle2, XCircle, Loader2, RefreshCw, Settings } from "lucide-react";

type TestStatus = "idle" | "loading" | "success" | "error";

type Provider = {
  id: string;
  name: string;
  model: string;
  status: "connected" | "disconnected" | "unknown";
  lastTest: string;
  subjects: string[];
};

const PROVIDERS: Provider[] = [
  {
    id: "nvidia",
    name: "NVIDIA NIM",
    model: "meta/llama-3.1-70b-instruct",
    status: "connected",
    lastTest: "12 min ago",
    subjects: ["Physics", "Chemistry", "Mathematics"],
  },
  {
    id: "grok",
    name: "Grok (xAI)",
    model: "grok-3-mini",
    status: "connected",
    lastTest: "1 hour ago",
    subjects: ["Biology"],
  },
];

const NVIDIA_MODELS = ["meta/llama-3.1-70b-instruct", "meta/llama-3.1-8b-instruct", "mistralai/mistral-7b-instruct-v0.3"];
const GROK_MODELS = ["grok-3", "grok-3-mini", "grok-2"];

export default function ProvidersPage() {
  const [testStatus, setTestStatus] = useState<Record<string, TestStatus>>({ nvidia: "idle", grok: "idle" });

  const handleTest = (id: string) => {
    setTestStatus((prev) => ({ ...prev, [id]: "loading" }));
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [id]: "success" }));
    }, 1800);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="AI Providers" description="Configure and test AI service providers" />

      <div className="grid gap-6 lg:grid-cols-2">
        {PROVIDERS.map((provider) => (
          <Card key={provider.id} className="relative overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Cpu className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription className="text-xs">Last tested: {provider.lastTest}</CardDescription>
                  </div>
                </div>
                <StatusBadge
                  status={provider.status === "connected" ? "success" : "error"}
                  label={provider.status === "connected" ? "Connected" : "Disconnected"}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* API Key */}
              <div className="space-y-1.5">
                <Label>API Key</Label>
                <Input type="password" value="••••••••••••••••••••••••••••" readOnly className="font-mono text-sm bg-muted" />
                  <span className="text-xs text-muted-foreground">API key is encrypted and stored securely.</span>
              </div>

              {/* Model */}
              <div className="space-y-1.5">
                <Label>Model</Label>
                <Select defaultValue={provider.model}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(provider.id === "nvidia" ? NVIDIA_MODELS : GROK_MODELS).map((m) => (
                      <SelectItem key={m} value={m}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Subjects */}
              <div className="space-y-1.5">
                <Label>Serving Subjects</Label>
                <div className="flex flex-wrap gap-1.5">
                  {provider.subjects.map((s) => (
                    <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Test Result */}
              {testStatus[provider.id] !== "idle" && (
                <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                  testStatus[provider.id] === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                  testStatus[provider.id] === "error" ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400" : "border-border bg-muted"
                }`}>
                  {testStatus[provider.id] === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                  {testStatus[provider.id] === "success" && <CheckCircle2 className="h-4 w-4" />}
                  {testStatus[provider.id] === "error" && <XCircle className="h-4 w-4" />}
                  <span>
                    {testStatus[provider.id] === "loading" ? "Testing connection..." :
                     testStatus[provider.id] === "success" ? "Connection successful — 342ms response time" :
                     "Connection failed — check API key"}
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTest(provider.id)}
                  disabled={testStatus[provider.id] === "loading"}
                >
                  {testStatus[provider.id] === "loading"
                    ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Testing...</>
                    : <><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Test Connection</>}
                </Button>
                <Button size="sm"><Settings className="mr-1.5 h-3.5 w-3.5" />Configure</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Routing Config */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Subject Routing Configuration</CardTitle>
          <CardDescription>Assign which AI provider handles each subject&apos;s questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {["Physics", "Chemistry", "Mathematics", "Biology"].map((subject) => (
              <div key={subject} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                <span className="font-medium text-sm">{subject}</span>
                <Select defaultValue={subject === "Biology" ? "grok" : "nvidia"}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nvidia">NVIDIA NIM (Primary)</SelectItem>
                    <SelectItem value="grok">Grok (Fallback)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
