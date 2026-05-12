import React from "react";
import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function LongAnswerPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Long Answer Exams"
        description="Practice subjective questions with AI-powered evaluation"
      />

      <ComingSoon
        title="Coming Soon"
        description="The long answer exam module with AI-powered subjective grading is under development. You'll be able to write detailed answers and receive instant AI feedback on your responses."
      >
        <div className="max-w-2xl space-y-4">
          <Card>
            <CardContent className="p-6">
              <p className="mb-4 text-sm font-medium">
                Explain the second law of thermodynamics and its implications in daily life.
              </p>
              <Textarea
                placeholder="Write your answer here..."
                rows={8}
                disabled
              />
              <div className="mt-4 flex gap-2">
                <Button disabled>Submit Answer</Button>
                <Button variant="outline" disabled>
                  Reveal Ideal Answer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ComingSoon>
    </div>
  );
}
