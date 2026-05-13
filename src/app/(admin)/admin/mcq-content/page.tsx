"use client";

import React, { useState, useEffect } from "react";
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
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Trash2, Upload, PowerOff, Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type MCQQuestion = {
  id: string;
  question_text: string;
  subject_id: string;
  subjects?: { name: string };
  difficulty: "easy" | "medium" | "hard";
  status: "active" | "inactive" | "archived";
  created_at: string;
  options: Record<string, string>;
  correct_option: string;
  explanations?: Record<string, string>;
};

type Subject = {
  id: string;
  name: string;
};

const difficultyConfig = { easy: "success", medium: "warning", hard: "error" } as const;

export default function MCQContentPage() {
  const [questions, setQuestions] = useState<MCQQuestion[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [newQuestion, setNewQuestion] = useState<{
    subject_id: string;
    question_text: string;
    difficulty: "easy" | "medium" | "hard";
    correct_option: string;
    options: Record<string, string>;
    explanations: Record<string, string>;
  }>({
    subject_id: "",
    question_text: "",
    difficulty: "medium",
    correct_option: "A",
    options: { A: "", B: "", C: "", D: "" },
    explanations: { A: "", B: "", C: "", D: "" }
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [qRes, sRes] = await Promise.all([
        fetch("/api/admin/mcq-questions"),
        fetch("/api/admin/subjects")
      ]);
      
      if (qRes.ok) {
        const data = await qRes.json();
        setQuestions(data.questions || []);
      }
      
      if (sRes.ok) {
        const data = await sRes.json();
        setSubjects(data.subjects || []);
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.subject_id || !newQuestion.question_text) {
      alert("Please fill in required fields");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/mcq-questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuestion)
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(prev => [data.question, ...prev]);
        setAddOpen(false);
        setNewQuestion({
          subject_id: "",
          question_text: "",
          difficulty: "medium",
          correct_option: "A",
          options: { A: "", B: "", C: "", D: "" },
          explanations: { A: "", B: "", C: "", D: "" }
        });
      }
    } catch {
      alert("Failed to create question");
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSubmitting(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const csvData = event.target?.result as string;
        const res = await fetch("/api/admin/mcq-questions/import", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ csvData, format: "csv" })
        });

        if (res.ok) {
          const data = await res.json();
          alert(`Successfully imported ${data.count} questions!`);
          setUploadOpen(false);
          fetchInitialData(); // Refresh list
        } else {
          const data = await res.json();
          alert(`Import failed: ${data.error}`);
        }
        setSubmitting(false);
      };
      reader.readAsText(file);
    } catch {
      alert("Failed to read file");
      setSubmitting(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await fetch(`/api/admin/mcq-questions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setQuestions(prev => prev.map(q => q.id === id ? { ...q, status: newStatus as MCQQuestion["status"] } : q));
      }
    } catch {
      // Error handled
    }
  };

  const columns: ColumnDef<MCQQuestion>[] = [
    { 
      accessorKey: "id", 
      header: "ID", 
      cell: ({ row }) => <code className="text-[10px] bg-muted px-1 py-0.5 rounded uppercase">{row.original.id.slice(0, 8)}</code> 
    },
    {
      accessorKey: "question_text",
      header: "Question",
      cell: ({ row }) => <p className="text-xs max-w-sm line-clamp-2">{row.original.question_text}</p>,
    },
    { 
      accessorKey: "subjects.name", 
      header: "Subject", 
      cell: ({ row }) => <Badge variant="outline" className="text-[10px]">{row.original.subjects?.name || "Unknown"}</Badge> 
    },
    {
      accessorKey: "difficulty",
      header: "Difficulty",
      cell: ({ row }) => (
        <StatusBadge 
          status={difficultyConfig[row.original.difficulty] || "info"} 
          label={row.original.difficulty} 
        />
      ),
    },
    { 
      accessorKey: "status", 
      header: "Status", 
      cell: ({ row }) => {
      const status = row.original.status as "active" | "inactive" | "archived" | "error";
      return (
        <StatusBadge 
          status={status === "active" ? "success" : status === "archived" ? "inactive" : "error"} 
          label={status} 
        />
      );
    }
    },
    { 
      accessorKey: "created_at", 
      header: "Created", 
      cell: ({ row }) => (
        <span className="text-muted-foreground text-[10px]">
          {format(new Date(row.original.created_at), "MMM d, yyyy")}
        </span>
      ) 
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className={row.original.status === "active" ? "text-amber-600" : "text-emerald-600"}
              onClick={() => toggleStatus(row.original.id, row.original.status)}
            >
              <PowerOff className="mr-2 h-4 w-4" />
              {row.original.status === "active" ? "Deactivate" : "Activate"}
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const filtered = subjectFilter === "all" ? questions : questions.filter((q) => q.subjects?.name === subjectFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="MCQ Content" description="Manage question banks across all subjects" />

      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          <Tabs value={subjectFilter} onValueChange={setSubjectFilter}>
            <TabsList>
              <TabsTrigger value="all">All ({questions.length})</TabsTrigger>
              {subjects.map(s => (
                <TabsTrigger key={s.id} value={s.name}>
                  {s.name} ({questions.filter(q => q.subjects?.name === s.name).length})
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <DataTable
            columns={columns}
            data={filtered}
            searchKey="question_text"
            searchPlaceholder="Search questions..."
            actionSlot={
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)}>
                  <Upload className="mr-1.5 h-4 w-4" />Upload CSV
                </Button>
                <Button size="sm" onClick={() => setAddOpen(true)}>
                  <Plus className="mr-1.5 h-4 w-4" />Add Question
                </Button>
              </div>
            }
            emptyTitle="No questions found"
            emptyDescription="No questions match the current filter. Try adding some."
          />
        </>
      )}

      {/* Add Question Dialog */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add MCQ Question</DialogTitle>
            <DialogDescription>Enter the question details, options, and explanations.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Subject</Label>
                <Select onValueChange={(val) => setNewQuestion(p => ({ ...p, subject_id: val }))}>
                  <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                  <SelectContent>
                    {subjects.map((s) => (
                      <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Difficulty</Label>
                <Select onValueChange={(val) => setNewQuestion(p => ({ ...p, difficulty: val as MCQQuestion["difficulty"] }))}>
                  <SelectTrigger><SelectValue placeholder="Select difficulty" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Question Text</Label>
              <Textarea 
                placeholder="Enter the question..." 
                rows={3} 
                onChange={(e) => setNewQuestion(p => ({ ...p, question_text: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt} className="space-y-1.5">
                  <Label>Option {opt}</Label>
                  <Input 
                    placeholder={`Option ${opt}`} 
                    onChange={(e) => setNewQuestion(p => ({ ...p, options: { ...p.options, [opt]: e.target.value } }))}
                  />
                </div>
              ))}
            </div>
            <div className="space-y-1.5">
              <Label>Correct Option</Label>
              <Select defaultValue="A" onValueChange={(val) => setNewQuestion(p => ({ ...p, correct_option: val }))}>
                <SelectTrigger><SelectValue placeholder="Select correct answer" /></SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((o) => <SelectItem key={o} value={o}>Option {o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {["A", "B", "C", "D"].map((opt) => (
                <div key={opt} className="space-y-1.5">
                  <Label>Explanation for {opt}</Label>
                  <Input 
                    placeholder={`Why ${opt} is...`} 
                    onChange={(e) => setNewQuestion(p => ({ ...p, explanations: { ...p.explanations, [opt]: e.target.value } }))}
                  />
                </div>
              ))}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateQuestion} disabled={submitting}>
              {submitting ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : "Add Question"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Question Bank</DialogTitle>
            <DialogDescription>CSV/JSON import functionality is coming soon.</DialogDescription>
          </DialogHeader>
          <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4 my-2">
            {submitting ? (
              <div className="space-y-3">
                <Loader2 className="h-8 w-8 mx-auto animate-spin text-primary" />
                <p className="text-sm font-medium">Processing your questions...</p>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Select Question Bank CSV</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Columns: subject, question, optionA, optionB, optionC, optionD, correct, difficulty
                  </p>
                </div>
                <Input 
                  type="file" 
                  accept=".csv" 
                  onChange={handleFileUpload}
                  className="max-w-[200px] mx-auto cursor-pointer"
                />
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUploadOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
