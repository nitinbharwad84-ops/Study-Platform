import React from "react";
import { ComingSoon } from "@/components/shared/coming-soon";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, BookOpen } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Chat"
        description="Ask questions about your study material"
      />

      <ComingSoon
        title="Coming Soon"
        description="The AI-powered RAG chatbot is under development. You'll be able to ask questions grounded in your study materials, with strict source-bounded answers."
      >
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          {/* Mock sidebar */}
          <Card className="hidden lg:block">
            <CardContent className="p-3">
              <div className="space-y-2">
                {["Physics Thread 1", "Chemistry Q&A", "Math Doubts"].map((thread) => (
                  <div key={thread} className="rounded-lg border p-3">
                    <p className="text-sm font-medium">{thread}</p>
                    <p className="text-xs text-muted-foreground">2 days ago</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Mock chat area */}
          <Card>
            <CardContent className="flex h-[400px] flex-col p-4">
              <div className="flex-1 space-y-4">
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-sm">
                    Welcome! Select a subject and ask me anything about your study material.
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <Input placeholder="Ask a question..." disabled />
                <Button disabled size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ComingSoon>
    </div>
  );
}
