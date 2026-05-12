"use client";

import React from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Eye, RotateCcw } from "lucide-react";

const attempts = [
  { id: 1, subject: "Physics", date: "May 12, 2026", questions: 20, score: 17, accuracy: 85, timerMode: "Full Exam", status: "completed" as const },
  { id: 2, subject: "Chemistry", date: "May 11, 2026", questions: 20, score: 14, accuracy: 70, timerMode: "Per Question", status: "completed" as const },
  { id: 3, subject: "Biology", date: "May 10, 2026", questions: 20, score: 0, accuracy: 0, timerMode: "Full Exam", status: "in_progress" as const },
  { id: 4, subject: "Mathematics", date: "May 9, 2026", questions: 30, score: 27, accuracy: 90, timerMode: "None", status: "completed" as const },
  { id: 5, subject: "Physics", date: "May 8, 2026", questions: 20, score: 16, accuracy: 80, timerMode: "Full Exam", status: "completed" as const },
  { id: 6, subject: "Chemistry", date: "May 7, 2026", questions: 10, score: 8, accuracy: 80, timerMode: "Per Question", status: "completed" as const },
];

export default function MCQHistoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Exam History"
        description="View all your past MCQ exam attempts and results"
      />

      {/* Filters */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by subject..." className="pl-9" />
          </div>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue placeholder="Subject" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Subjects</SelectItem>
              <SelectItem value="physics">Physics</SelectItem>
              <SelectItem value="chemistry">Chemistry</SelectItem>
              <SelectItem value="mathematics">Mathematics</SelectItem>
              <SelectItem value="biology">Biology</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Subject</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Accuracy</TableHead>
                <TableHead>Timer Mode</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {attempts.map((attempt) => (
                <TableRow key={attempt.id}>
                  <TableCell className="font-medium">{attempt.subject}</TableCell>
                  <TableCell className="text-muted-foreground">{attempt.date}</TableCell>
                  <TableCell className="text-center">{attempt.questions}</TableCell>
                  <TableCell className="text-center">
                    {attempt.status === "completed" ? `${attempt.score}/${attempt.questions}` : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {attempt.status === "completed" ? `${attempt.accuracy}%` : "—"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{attempt.timerMode}</Badge>
                  </TableCell>
                  <TableCell>
                    <StatusBadge
                      status={attempt.status === "completed" ? "success" : "warning"}
                      label={attempt.status === "completed" ? "Completed" : "In Progress"}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    {attempt.status === "completed" ? (
                      <Button variant="ghost" size="sm">
                        <Eye className="mr-1 h-3 w-3" />
                        Review
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm">
                        <RotateCcw className="mr-1 h-3 w-3" />
                        Resume
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
