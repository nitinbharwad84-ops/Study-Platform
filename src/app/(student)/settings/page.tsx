"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

import { ThemeToggle } from "@/components/shared/theme-toggle";
import { User, Lock, Palette, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1500);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account and preferences"
      />

      <div className="max-w-2xl space-y-6">
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
                <Input id="settings-first-name" defaultValue="John" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-last-name">Last Name</Label>
                <Input id="settings-last-name" defaultValue="Doe" />
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
              <Input value="john@studyplatform.com" disabled className="bg-muted" />
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
              <Button variant="outline" size="sm" className="mt-3">
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
