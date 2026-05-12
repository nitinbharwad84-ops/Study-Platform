import React from "react";
import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Theme toggle - top right */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Brand */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
          <GraduationCap className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">StudyPlatform</h1>
          <p className="text-xs text-muted-foreground">AI-Assisted Learning</p>
        </div>
      </div>

      {/* Auth card */}
      <div className="w-full max-w-[440px]">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        Private, invite-only platform. Contact your administrator for access.
      </p>
    </div>
  );
}
