"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { User, Lock, Palette, Loader2, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [profile, setProfile] = useState({ firstName: "", lastName: "", email: "" });
  const [status, setStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setProfile({
            firstName: data.user.firstName || "",
            lastName: data.user.lastName || "",
            email: data.user.email || ""
          });
        }
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName: profile.firstName, lastName: profile.lastName })
      });
      if (res.ok) {
        setStatus({ type: "success", message: "Profile updated successfully!" });
      } else {
        const d = await res.json();
        setStatus({ type: "error", message: d.error || "Failed to update profile" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestReset = async () => {
    setResetLoading(true);
    setStatus(null);
    try {
      const res = await fetch("/api/auth/request-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: profile.email, reason: "Requested from settings" })
      });
      if (res.ok) {
        setStatus({ type: "success", message: "Password reset request submitted! An admin will review it." });
      } else {
        const d = await res.json();
        setStatus({ type: "error", message: d.error || "Failed to submit request" });
      }
    } catch {
      setStatus({ type: "error", message: "Network error" });
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="max-w-2xl space-y-6">
        {status && (
          <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
            status.type === "success" ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20" : "bg-red-500/10 text-red-600 border border-red-500/20"
          }`}>
            {status.type === "success" ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
            {status.message}
          </div>
        )}

        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="settings-first-name">First Name</Label>
                <Input 
                  id="settings-first-name" 
                  value={profile.firstName} 
                  onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-last-name">Last Name</Label>
                <Input 
                  id="settings-last-name" 
                  value={profile.lastName} 
                  onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))}
                />
              </div>
            </div>
            <Button size="sm" disabled={loading} onClick={handleSave}>
              {loading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>

        {/* Security Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lock className="h-5 w-5" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={profile.email} disabled className="bg-muted" />
              <p className="text-xs text-muted-foreground">
                Email cannot be changed. Contact an administrator for assistance.
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="mt-1 text-sm text-muted-foreground">
                To reset your password, submit a request that will be reviewed by an administrator.
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3" 
                onClick={handleRequestReset}
                disabled={resetLoading}
              >
                {resetLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                Request Password Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Palette className="h-5 w-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              <ThemeToggle />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
