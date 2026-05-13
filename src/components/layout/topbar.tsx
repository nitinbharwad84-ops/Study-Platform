"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { MobileSidebar } from "@/components/layout/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, LogOut, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import type { SessionUser } from "@/lib/auth/session";

interface TopbarProps {
  pageTitle: string;
  variant: "student" | "admin";
  initialUser?: SessionUser;
}

export function Topbar({ pageTitle, variant, initialUser }: TopbarProps) {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(initialUser ?? null);
  const [loggingOut, setLoggingOut] = useState(false);

  // Fetch current user from session if not provided by server
  useEffect(() => {
    if (!initialUser) {
      fetch("/api/auth/me")
        .then((r) => r.ok ? r.json() : null)
        .then((data) => {
          if (data?.user) setUser(data.user);
        })
        .catch(() => {});
    }
  }, [initialUser]);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/login");
      router.refresh();
    } catch {
      setLoggingOut(false);
    }
  };

  const initials = user
    ? `${user.firstName[0] ?? ""}${user.lastName[0] ?? ""}`.toUpperCase()
    : "??";

  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "Loading...";

  const settingsHref = variant === "admin" ? "/admin/settings" : "/settings";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:px-6">
      {/* Mobile menu trigger */}
      <MobileSidebar variant={variant} user={user || undefined} />

      {/* Page title */}
      <div className="flex-1">
        <h1 className="text-lg font-semibold tracking-tight">{pageTitle}</h1>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        {/* Notifications placeholder */}
        <Button variant="ghost" size="icon" className="h-9 w-9 relative">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-9 w-9 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-sm font-medium text-primary">
                  {user ? initials : <Loader2 className="h-4 w-4 animate-spin" />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{displayName}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email ?? ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={settingsHref} className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive cursor-pointer"
              onClick={handleLogout}
              disabled={loggingOut}
            >
              {loggingOut
                ? <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                : <LogOut className="mr-2 h-4 w-4" />
              }
              <span>{loggingOut ? "Signing out..." : "Log out"}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
