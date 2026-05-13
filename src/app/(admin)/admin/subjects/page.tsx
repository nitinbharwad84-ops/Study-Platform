"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, MoreHorizontal, Pencil, Archive, PowerOff, Loader2, BookOpen } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type Subject = {
  id: string;
  name: string;
  description: string;
  status: "active" | "archived" | "inactive";
  created_at: string;
};

// Move logic into the component

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/subjects");
      if (res.ok) {
        const data = await res.json();
        setSubjects(data.subjects || []);
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubject = async () => {
    if (!name) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/subjects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      });
      if (res.ok) {
        setName("");
        setDescription("");
        setOpen(false);
        fetchSubjects();
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateStatus = async (subjectId: string, newStatus: string) => {
    setUpdatingId(subjectId);
    try {
      const res = await fetch(`/api/admin/subjects/${subjectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setSubjects(subjects.map(s => s.id === subjectId ? { ...s, status: newStatus as any } : s));
      }
    } catch {
      // Error handled
    } finally {
      setUpdatingId(null);
    }
  };

  const statusConfig = { active: "success", archived: "inactive", inactive: "warning" } as const;

  const columns: ColumnDef<Subject>[] = [
    {
      accessorKey: "name",
      header: "Subject",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <p className="font-medium">{row.original.name}</p>
            <p className="text-xs text-muted-foreground line-clamp-1">{row.original.description}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge 
          status={statusConfig[row.original.status]} 
          label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)} 
        />
      ),
    },
    { 
      accessorKey: "created_at", 
      header: "Created", 
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
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
            <Button variant="ghost" size="icon" className="h-8 w-8" disabled={updatingId === row.original.id}>
              {updatingId === row.original.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreHorizontal className="h-4 w-4" />
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
            {row.original.status === "active" ? (
              <DropdownMenuItem 
                className="text-amber-600 dark:text-amber-400"
                onClick={() => handleUpdateStatus(row.original.id, "inactive")}
              >
                <PowerOff className="mr-2 h-4 w-4" />Deactivate
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-emerald-600 dark:text-emerald-400"
                onClick={() => handleUpdateStatus(row.original.id, "active")}
              >
                <PowerOff className="mr-2 h-4 w-4" />Activate
              </DropdownMenuItem>
            )}
            <DropdownMenuItem 
              className="text-muted-foreground"
              onClick={() => handleUpdateStatus(row.original.id, "archived")}
            >
              <Archive className="mr-2 h-4 w-4" />Archive
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Subjects" description="Manage academic subjects and their configurations" />
      
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={subjects}
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
                  <div className="space-y-1.5">
                    <Label>Subject Name</Label>
                    <Input 
                      placeholder="e.g. Physics" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Description</Label>
                    <Textarea 
                      placeholder="Brief description of this subject..." 
                      rows={3} 
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                  <Button onClick={handleCreateSubject} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Subject
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
        />
      )}
    </div>
  );
}
