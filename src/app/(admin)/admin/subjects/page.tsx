"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, Archive, PowerOff } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type Subject = {
  id: string;
  name: string;
  description: string;
  questionCount: number;
  assignedAdmins: string[];
  status: "active" | "archived" | "inactive";
  created: string;
};

const SUBJECTS: Subject[] = [
  { id: "1", name: "Physics", description: "Classical mechanics, optics, electricity and magnetism", questionCount: 350, assignedAdmins: ["admin@study.com", "content@study.com"], status: "active", created: "Dec 15, 2025" },
  { id: "2", name: "Chemistry", description: "Organic, inorganic, and physical chemistry", questionCount: 280, assignedAdmins: ["content@study.com"], status: "active", created: "Dec 20, 2025" },
  { id: "3", name: "Mathematics", description: "Algebra, calculus, trigonometry, and statistics", questionCount: 420, assignedAdmins: ["admin@study.com"], status: "active", created: "Jan 5, 2026" },
  { id: "4", name: "Biology", description: "Cell biology, genetics, ecology, and human physiology", questionCount: 190, assignedAdmins: ["content@study.com"], status: "active", created: "Jan 10, 2026" },
  { id: "5", name: "English", description: "Grammar, comprehension, and literature", questionCount: 0, assignedAdmins: [], status: "inactive", created: "Feb 1, 2026" },
  { id: "6", name: "Computer Science", description: "Programming concepts, algorithms, and data structures", questionCount: 0, assignedAdmins: [], status: "archived", created: "Nov 10, 2025" },
];

const statusConfig = { active: "success", archived: "inactive", inactive: "warning" } as const;

const columns: ColumnDef<Subject>[] = [
  {
    accessorKey: "name",
    header: "Subject",
    cell: ({ row }) => (
      <div>
        <p className="font-medium">{row.original.name}</p>
        <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>
      </div>
    ),
  },
  { accessorKey: "questionCount", header: "Questions", cell: ({ row }) => <span className="font-semibold">{row.original.questionCount.toLocaleString()}</span> },
  {
    accessorKey: "assignedAdmins",
    header: "Assigned Admins",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {row.original.assignedAdmins.length === 0 ? "None" : `${row.original.assignedAdmins.length} admin${row.original.assignedAdmins.length > 1 ? "s" : ""}`}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={statusConfig[row.original.status]} label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)} />
    ),
  },
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
          <DropdownMenuItem className="text-amber-600 dark:text-amber-400"><PowerOff className="mr-2 h-4 w-4" />Deactivate</DropdownMenuItem>
          <DropdownMenuItem className="text-muted-foreground"><Archive className="mr-2 h-4 w-4" />Archive</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function SubjectsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="Manage academic subjects and their configurations" />
      <DataTable
        columns={columns}
        data={SUBJECTS}
        searchKey="name"
        searchPlaceholder="Search subjects..."
        actionSlot={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Create Subject</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Subject</DialogTitle>
                <DialogDescription>Add a new subject to organize MCQ questions and exams.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5"><Label>Subject Name</Label><Input placeholder="e.g. Physics" /></div>
                <div className="space-y-1.5"><Label>Description</Label><Textarea placeholder="Brief description of this subject..." rows={3} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Create Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
}
