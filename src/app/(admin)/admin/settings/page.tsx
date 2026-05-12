"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Palette, Timer, Cpu } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Platform Settings" description="Global platform configuration and defaults" />

      <div className="max-w-2xl space-y-6">
        {/* Exam Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Timer className="h-4 w-4" />Exam Defaults
            </CardTitle>
            <CardDescription>Default settings applied to new exams</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Default Question Count</Label>
                <Select defaultValue="20">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                    <SelectItem value="50">50 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Default Timer Mode</Label>
                <Select defaultValue="full">
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Timer</SelectItem>
                    <SelectItem value="full">Full Exam Timer</SelectItem>
                    <SelectItem value="per-question">Per Question</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Full Exam Timer Duration (minutes)</Label>
              <Input type="number" defaultValue={30} min={5} max={120} className="max-w-[120px]" />
            </div>
            <div className="space-y-1.5">
              <Label>Per-Question Timer (seconds)</Label>
              <Input type="number" defaultValue={90} min={15} max={300} className="max-w-[120px]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Students to Change Timer</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Students can override timer settings</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button size="sm">Save Exam Defaults</Button>
          </CardContent>
        </Card>

        {/* Provider Defaults */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Cpu className="h-4 w-4" />Provider Defaults
            </CardTitle>
            <CardDescription>Default AI provider configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label>Primary Provider</Label>
              <Select defaultValue="nvidia">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nvidia">NVIDIA NIM</SelectItem>
                  <SelectItem value="grok">Grok (xAI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Fallback Provider</Label>
              <Select defaultValue="grok">
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="nvidia">NVIDIA NIM</SelectItem>
                  <SelectItem value="grok">Grok (xAI)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Failover</Label>
                <p className="text-xs text-muted-foreground mt-0.5">Automatically switch to fallback on failure</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Button size="sm">Save Provider Defaults</Button>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Palette className="h-4 w-4" />Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Toggle light / dark mode</p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
