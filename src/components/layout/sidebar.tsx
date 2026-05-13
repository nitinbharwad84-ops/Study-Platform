"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { GraduationCap, Menu, LogOut } from "lucide-react";
import { adminNavGroups, studentNavGroups } from "@/config/navigation";

import type { SessionUser } from "@/lib/auth/session";

interface SidebarProps {
  variant: "student" | "admin";
  user?: SessionUser;
}

function SidebarContent({ variant, user }: SidebarProps) {
  const pathname = usePathname();
  const navGroups = variant === "admin" ? adminNavGroups : studentNavGroups;

  // Filter groups and items based on permissions
  const filteredNavGroups = navGroups
    .map((group) => {
      const filteredItems = group.items.filter((item) => {
        if (!item.requiredPermission) return true;
        if (!user?.permissions) return false;
        return user.permissions.includes(item.requiredPermission);
      });
      return { ...group, items: filteredItems };
    })
    .filter((group) => group.items.length > 0);

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          variant === "admin" ? "bg-primary" : "bg-primary"
        )}>
          <GraduationCap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">StudyPlatform</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {variant === "admin" ? "Admin Panel" : "Student"}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="flex flex-col gap-1">
          {filteredNavGroups.map((group, groupIdx) => (
            <div key={group.label} className={cn(groupIdx > 0 && "mt-4")}>
              <p className="mb-1 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map((item) => {
                const isActive = pathname === item.href || 
                  (item.href !== "/dashboard" && item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.disabled ? "#" : item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                      item.disabled && "pointer-events-none opacity-60"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant="outline"
                        className="ml-auto h-5 shrink-0 rounded-full border-amber-500/30 bg-amber-500/10 px-1.5 text-[10px] text-amber-600 dark:text-amber-400"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground">
          <LogOut className="h-4 w-4" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}

export function Sidebar({ variant, user }: SidebarProps) {
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-[260px] lg:flex-col">
        <div className="flex h-full flex-col border-r bg-card">
          <SidebarContent variant={variant} user={user} />
        </div>
      </aside>
    </>
  );
}

export function MobileSidebar({ variant, user }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[260px] p-0">
        <SidebarContent variant={variant} user={user} />
      </SheetContent>
    </Sheet>
  );
}
