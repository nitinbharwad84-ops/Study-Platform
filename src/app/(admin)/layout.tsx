"use client";

import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { adminNavGroups } from "@/config/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar navGroups={adminNavGroups} variant="admin" />

      {/* Main content area */}
      <div className="lg:pl-[260px]">
        <Topbar
          pageTitle=""
          navGroups={adminNavGroups}
          variant="admin"
        />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
