import React from "react";
import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";

export default function ChatHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Chat History"
        description="Browse your past AI chat conversations"
      />
      <ComingSoon
        title="Coming Soon"
        description="View, search, and manage your past AI chat threads organized by subject."
      />
    </div>
  );
}
