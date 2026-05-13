import React from "react";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { getSession } from "@/lib/auth/session";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (!session) {
    redirect("/admin/login");
  }

  if (session.role === "student") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Desktop */}
      <Sidebar variant="admin" user={session} />

      {/* Main content area */}
      <div className="lg:pl-[260px]">
        <Topbar
          pageTitle=""
          variant="admin"
          initialUser={session}
        />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
