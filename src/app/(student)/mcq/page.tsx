"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BookOpen, Play, Timer, HelpCircle } from "lucide-react";

const subjects = [
  { id: "physics", name: "Physics", questions: 150 },
  { id: "chemistry", name: "Chemistry", questions: 120 },
  { id: "mathematics", name: "Mathematics", questions: 200 },
  { id: "biology", name: "Biology", questions: 100 },
];

export default function MCQPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questionCount, setQuestionCount] = useState("20");
  const [timerMode, setTimerMode] = useState("full");
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timerDuration, setTimerDuration] = useState("30");

  return (
    <div className="space-y-6">
      <PageHeader
        title="MCQ Examination"
        description="Configure and start a new multiple-choice exam"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Subject Selection */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="h-5 w-5" />
              Select Subject
            </CardTitle>
            <CardDescription>Choose a subject to take your exam in</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              {subjects.map((subject) => (
                <button
                  key={subject.id}
                  onClick={() => setSelectedSubject(subject.id)}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                    selectedSubject === subject.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-accent"
                  }`}
                >
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                    selectedSubject === subject.id ? "bg-primary/10" : "bg-muted"
                  }`}>
                    <BookOpen className={`h-5 w-5 ${
                      selectedSubject === subject.id ? "text-primary" : "text-muted-foreground"
                    }`} />
                  </div>
                  <div>
                    <p className="font-medium">{subject.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {subject.questions} questions available
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Exam Configuration */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <HelpCircle className="h-5 w-5" />
                Questions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Number of Questions</Label>
                <Select value={questionCount} onValueChange={setQuestionCount}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 Questions</SelectItem>
                    <SelectItem value="20">20 Questions</SelectItem>
                    <SelectItem value="30">30 Questions</SelectItem>
                    <SelectItem value="50">50 Questions</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Timer className="h-5 w-5" />
                Timer
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="timer-toggle">Enable Timer</Label>
                <Switch
                  id="timer-toggle"
                  checked={timerEnabled}
                  onCheckedChange={setTimerEnabled}
                />
              </div>

              {timerEnabled && (
                <>
                  <div className="space-y-2">
                    <Label>Timer Mode</Label>
                    <Select value={timerMode} onValueChange={setTimerMode}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full">Full Exam Timer</SelectItem>
                        <SelectItem value="per-question">Per Question Timer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>
                      Duration ({timerMode === "full" ? "minutes" : "seconds per question"})
                    </Label>
                    <Input
                      type="number"
                      value={timerDuration}
                      onChange={(e) => setTimerDuration(e.target.value)}
                      min={timerMode === "full" ? 5 : 15}
                      max={timerMode === "full" ? 120 : 300}
                    />
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Button
            className="w-full"
            size="lg"
            disabled={!selectedSubject}
          >
            <Play className="mr-2 h-4 w-4" />
            Start Exam
          </Button>
        </div>
      </div>
    </div>
  );
}
