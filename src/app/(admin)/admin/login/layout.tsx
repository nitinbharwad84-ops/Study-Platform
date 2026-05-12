import React from "react";
import { ShieldCheck } from "lucide-react";
import { ThemeToggle } from "@/components/shared/theme-toggle";

/**
 * Standalone layout for /admin/login — no sidebar, no topbar.
 * Overrides the parent (admin) layout just for this route.
 */
export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
      {/* Theme toggle */}
      <div className="absolute right-4 top-4">
        <ThemeToggle />
      </div>

      {/* Admin Brand */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-destructive/90">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Admin Portal</h1>
          <p className="text-xs text-muted-foreground">StudyPlatform · Restricted Access</p>
        </div>
      </div>

      {/* Login card */}
      <div className="w-full max-w-[440px]">
        {children}
      </div>

      {/* Footer */}
      <p className="mt-8 text-center text-xs text-muted-foreground">
        This area is restricted to authorized administrators only.
      </p>
    </div>
  );
}
