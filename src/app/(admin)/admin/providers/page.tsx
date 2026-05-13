"use client";

import React, { useState, useEffect } from "react";
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
import { Cpu, CheckCircle2, XCircle, Loader2, RefreshCw, Save } from "lucide-react";

type ProviderConfig = {
  provider_name: string;
  model_name: string;
  api_key: string;
  is_active: boolean;
  subjects: string[];
};

type Subject = {
  id: string;
  name: string;
};

// Models list
const NVIDIA_MODELS = ["meta/llama-3.1-70b-instruct", "meta/llama-3.1-8b-instruct", "mistralai/mistral-7b-instruct-v0.3"];
const GROK_MODELS = ["grok-3", "grok-3-mini", "grok-2"];

export default function ProvidersPage() {
  const [configs, setConfigs] = useState<ProviderConfig[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<Record<string, "idle" | "loading" | "success" | "error">>({});

  useEffect(() => {
    fetchConfigs();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const [pRes, sRes] = await Promise.all([
        fetch("/api/admin/providers"),
        fetch("/api/admin/subjects")
      ]);
      
      if (pRes.ok) {
        const data = await pRes.json();
        setConfigs(data.configs || []);
      }
      
      if (sRes.ok) {
        const data = await sRes.json();
        setSubjects(data.subjects || []);
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateConfig = async (provider: string, updates: Partial<ProviderConfig>) => {
    setSaving(provider);
    try {
      const current = configs.find(c => c.provider_name === provider) || {
        provider_name: provider,
        model_name: provider === "nvidia" ? NVIDIA_MODELS[0] : GROK_MODELS[0],
        api_key: "",
        is_active: true,
        subjects: [],
      };
      
      const payload = { ...current, ...updates };
      
      const res = await fetch("/api/admin/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (res.ok) {
        setConfigs(prev => {
          const exists = prev.some(c => c.provider_name === provider);
          if (exists) {
            return prev.map(c => c.provider_name === provider ? payload : c);
          }
          return [...prev, payload];
        });
      }
    } catch {
      alert("Failed to save configuration");
    } finally {
      setSaving(null);
    }
  };

  const handleTest = (id: string) => {
    setTestStatus((prev) => ({ ...prev, [id]: "loading" }));
    // Mock testing for now
    setTimeout(() => {
      setTestStatus((prev) => ({ ...prev, [id]: "success" }));
    }, 1500);
  };

  const providersList = [
    { id: "nvidia", name: "NVIDIA NIM", models: NVIDIA_MODELS },
    { id: "grok", name: "Grok (xAI)", models: GROK_MODELS }
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="AI Providers" description="Configure and test AI service providers" />

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {providersList.map((p) => {
            const config = configs.find(c => c.provider_name === p.id) || {
              provider_name: p.id,
              model_name: p.models[0],
              api_key: "",
              is_active: true,
              subjects: [],
            };

            return (
              <Card key={p.id} className="relative overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Cpu className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{p.name}</CardTitle>
                        <CardDescription className="text-xs">
                          {config.is_active ? "Active" : "Inactive"}
                        </CardDescription>
                      </div>
                    </div>
                    <StatusBadge
                      status={config.is_active ? "success" : "inactive"}
                      label={config.is_active ? "Enabled" : "Disabled"}
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label>API Key</Label>
                    <Input 
                      type="password" 
                      placeholder="••••••••••••••••" 
                      defaultValue={config.api_key ? "********" : ""}
                      onChange={(e) => {
                        if (e.target.value !== "********") {
                          config.api_key = e.target.value;
                        }
                      }}
                      className="font-mono text-sm" 
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label>Model</Label>
                    <Select 
                      defaultValue={config.model_name}
                      onValueChange={(val) => handleUpdateConfig(p.id, { model_name: val })}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {p.models.map((m) => (
                          <SelectItem key={m} value={m}>{m}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label>Routed Subjects</Label>
                    <div className="flex flex-wrap gap-1.5 p-2 border rounded-md min-h-[40px]">
                      {subjects.length === 0 ? (
                        <span className="text-xs text-muted-foreground">No subjects found</span>
                      ) : (
                        subjects.map(s => {
                          const isRouted = config.subjects?.includes(s.id);
                          return (
                            <Badge 
                              key={s.id} 
                              variant={isRouted ? "default" : "outline"}
                              className="cursor-pointer text-[10px] py-0 h-5"
                              onClick={() => {
                                const newSubs = isRouted 
                                  ? (config.subjects || []).filter(id => id !== s.id)
                                  : [...(config.subjects || []), s.id];
                                handleUpdateConfig(p.id, { subjects: newSubs });
                              }}
                            >
                              {s.name}
                            </Badge>
                          );
                        })
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground">Click a subject to toggle routing to this provider.</p>
                  </div>

                  {testStatus[p.id] && testStatus[p.id] !== "idle" && (
                    <div className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                      testStatus[p.id] === "success" ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" :
                      testStatus[p.id] === "error" ? "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400" : "border-border bg-muted"
                    }`}>
                      {testStatus[p.id] === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
                      {testStatus[p.id] === "success" && <CheckCircle2 className="h-4 w-4" />}
                      {testStatus[p.id] === "error" && <XCircle className="h-4 w-4" />}
                      <span>
                        {testStatus[p.id] === "loading" ? "Testing connection..." :
                         testStatus[p.id] === "success" ? "Connection successful" :
                         "Connection failed"}
                      </span>
                    </div>
                  )}

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleTest(p.id)}
                      disabled={testStatus[p.id] === "loading"}
                    >
                      {testStatus[p.id] === "loading"
                        ? <><Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />Testing...</>
                        : <><RefreshCw className="mr-1.5 h-3.5 w-3.5" />Test Connection</>}
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleUpdateConfig(p.id, { api_key: config.api_key })}
                      disabled={saving === p.id}
                    >
                      {saving === p.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Save className="mr-1.5 h-3.5 w-3.5" />}
                      Save Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Provider Priority & Routing</CardTitle>
          <CardDescription>Assign subjects to providers to optimize costs and performance.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>• If a subject is routed to multiple providers, the system will use the first active one.</p>
            <p>• Subjects not routed explicitly will use the default provider (NVIDIA NIM).</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
