"use client";

import React from "react";
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
import { Bell, LogOut, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NavGroup } from "@/config/navigation";

interface TopbarProps {
  pageTitle: string;
  navGroups: NavGroup[];
  variant: "student" | "admin";
}

export function Topbar({ pageTitle, navGroups, variant }: TopbarProps) {
  // Dummy user for now
  const user = {
    firstName: "John",
    lastName: "Doe",
    email: "john@studyplatform.com",
    role: variant === "admin" ? "Admin" : "Student",
  };

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b bg-card/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-card/60 lg:px-6">
      {/* Mobile menu trigger */}
      <MobileSidebar navGroups={navGroups} variant={variant} />

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
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
