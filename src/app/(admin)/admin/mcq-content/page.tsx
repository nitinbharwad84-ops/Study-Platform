"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Upload, PowerOff } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type MCQQuestion = {
  id: string;
  question: string;
  subject: string;
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "inactive";
  created: string;
};

const QUESTIONS: MCQQuestion[] = [
  { id: "PHY-001", question: "A body is thrown vertically upward with a velocity of 20 m/s. What is the maximum height reached?", subject: "Physics", difficulty: "medium", status: "active", created: "Jan 10, 2026" },
  { id: "PHY-002", question: "Which of the following is NOT a unit of energy?", subject: "Physics", difficulty: "easy", status: "active", created: "Jan 11, 2026" },
  { id: "PHY-003", question: "The wavelength of visible light ranges approximately from:", subject: "Physics", difficulty: "easy", status: "active", created: "Jan 12, 2026" },
  { id: "CHE-001", question: "What is the chemical formula for sulfuric acid?", subject: "Chemistry", difficulty: "easy", status: "active", created: "Jan 15, 2026" },
  { id: "CHE-002", question: "Which type of bond involves the sharing of electron pairs?", subject: "Chemistry", difficulty: "medium", status: "active", created: "Jan 16, 2026" },
  { id: "MAT-001", question: "What is the derivative of sin(x)?", subject: "Mathematics", difficulty: "easy", status: "active", created: "Jan 20, 2026" },
  { id: "MAT-002", question: "Solve for x: 2x² - 5x + 3 = 0", subject: "Mathematics", difficulty: "hard", status: "active", created: "Jan 21, 2026" },
  { id: "BIO-001", question: "Which organelle is known as the powerhouse of the cell?", subject: "Biology", difficulty: "easy", status: "inactive", created: "Feb 1, 2026" },
  { id: "PHY-004", question: "Ohm's law states that the current through a conductor is:", subject: "Physics", difficulty: "medium", status: "active", created: "Feb 5, 2026" },
  { id: "CHE-003", question: "What is the pH of a neutral solution at 25°C?", subject: "Chemistry", difficulty: "easy", status: "active", created: "Feb 8, 2026" },
];

const difficultyConfig = { easy: "success", medium: "warning", hard: "error" } as const;

const columns: ColumnDef<MCQQuestion>[] = [
  { accessorKey: "id", header: "ID", cell: ({ row }) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.original.id}</code> },
  {
    accessorKey: "question",
    header: "Question",
    cell: ({ row }) => <p className="text-sm max-w-sm line-clamp-2">{row.original.question}</p>,
  },
  { accessorKey: "subject", header: "Subject", cell: ({ row }) => <Badge variant="outline" className="text-xs">{row.original.subject}</Badge> },
  {
    accessorKey: "difficulty",
    header: "Difficulty",
    cell: ({ row }) => (
      <StatusBadge status={difficultyConfig[row.original.difficulty]} label={row.original.difficulty.charAt(0).toUpperCase() + row.original.difficulty.slice(1)} />
    ),
  },
  { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status === "active" ? "success" : "error"} label={row.original.status === "active" ? "Active" : "Inactive"} /> },
  { accessorKey: "created", header: "Created", cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.created}</span> },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-amber-600 dark:text-amber-400"><PowerOff className="mr-2 h-4 w-4" />Deactivate</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function MCQContentPage() {
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");

  const filtered = subjectFilter === "all" ? QUESTIONS : QUESTIONS.filter((q) => q.subject === subjectFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="MCQ Content" description="Manage question banks across all subjects" />

      {/* Subject Tabs */}
      <Tabs value={subjectFilter} onValueChange={setSubjectFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({QUESTIONS.length})</TabsTrigger>
          <TabsTrigger value="Physics">Physics ({QUESTIONS.filter((q) => q.subject === "Physics").length})</TabsTrigger>
          <TabsTrigger value="Chemistry">Chemistry ({QUESTIONS.filter((q) => q.subject === "Chemistry").length})</TabsTrigger>
          <TabsTrigger value="Mathematics">Math ({QUESTIONS.filter((q) => q.subject === "Mathematics").length})</TabsTrigger>
          <TabsTrigger value="Biology">Biology ({QUESTIONS.filter((q) => q.subject === "Biology").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      <DataTable
        columns={columns}
        data={filtered}
        searchKey="question"
        searchPlaceholder="Search questions..."
        actionSlot={
          <div className="flex items-center gap-2">
            {/* Upload CSV */}
            <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm"><Upload className="mr-1.5 h-4 w-4" />Upload CSV</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Question Bank</DialogTitle>
                  <DialogDescription>Upload a CSV or JSON file containing MCQ questions.</DialogDescription>
                </DialogHeader>
                <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-2 my-2">
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                  <p className="text-sm font-medium">Drop your CSV/JSON file here</p>
                  <p className="text-xs text-muted-foreground">or click to browse — Max 5MB</p>
                  <Button variant="outline" size="sm" className="mt-2">Browse Files</Button>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button>
                  <Button onClick={() => setUploadOpen(false)} disabled>Preview Import</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Add Question */}
            <Dialog open={addOpen} onOpenChange={setAddOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Question</Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Add MCQ Question</DialogTitle>
                  <DialogDescription>Enter the question, options, correct answer, and explanations.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label>Subject</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                        <SelectContent>
                          {["Physics", "Chemistry", "Mathematics", "Biology"].map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1.5">
                      <Label>Difficulty</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-1.5"><Label>Question Text</Label><Textarea placeholder="Enter the question..." rows={3} /></div>
                  {["A", "B", "C", "D"].map((opt) => (
                    <div key={opt} className="space-y-1.5">
                      <Label>Option {opt}</Label>
                      <Input placeholder={`Option ${opt}`} />
                    </div>
                  ))}
                  <div className="space-y-1.5">
                    <Label>Correct Option</Label>
                    <Select>
                      <SelectTrigger><SelectValue placeholder="Select correct answer" /></SelectTrigger>
                      <SelectContent>
                        {["A", "B", "C", "D"].map((o) => <SelectItem key={o} value={o}>Option {o}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  {["A", "B", "C", "D"].map((opt) => (
                    <div key={opt} className="space-y-1.5">
                      <Label>Explanation for Option {opt}</Label>
                      <Input placeholder={`Why option ${opt} is correct/incorrect...`} />
                    </div>
                  ))}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
                  <Button onClick={() => setAddOpen(false)}>Add Question</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        }
        emptyTitle="No questions found"
        emptyDescription="No questions match the current filter. Try adding some."
      />
    </div>
  );
}
