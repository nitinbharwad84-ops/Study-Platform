"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { studentNavGroups } from "@/config/navigation";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar navGroups={studentNavGroups} variant="student" />

      {/* Main content area */}
      <div className="lg:pl-[260px]">
        <Topbar
          pageTitle=""
          navGroups={studentNavGroups}
          variant="student"
        />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
