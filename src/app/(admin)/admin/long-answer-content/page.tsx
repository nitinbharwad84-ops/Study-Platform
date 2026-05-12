import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function LongAnswerContentPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Long Answer Content"
        description="Manage subjective question content and rubrics"
      />
      <ComingSoon
        title="Coming Soon"
        description="The long answer content management module will allow you to create subjective questions, define rubrics, and configure AI grading parameters."
      />
    </div>
  );
}
