"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, MoreHorizontal, Trash2, Loader2, Mail } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type ApprovedEmail = {
  email: string;
  role_to_assign: string;
  invited_by: string;
  invited_at: string;
};

// Move logic into the component

export default function ApprovedEmailsPage() {
  const [emails, setEmails] = useState<ApprovedEmail[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newRole, setNewRole] = useState("student");
  const [submitting, setSubmitting] = useState(false);
  const [deletingEmail, setDeletingEmail] = useState<string | null>(null);

  useEffect(() => {
    fetchEmails();
  }, []);

  const fetchEmails = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/approved-emails", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setEmails(data.emails || []);
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = async () => {
    if (!newEmail) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/approved-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, role: newRole }),
      });
      if (res.ok) {
        setNewEmail("");
        setOpen(false);
        fetchEmails();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add email");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = React.useCallback(async (email: string) => {
    setDeletingEmail(email);
    try {
      const res = await fetch(`/api/admin/approved-emails/${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setEmails(emails.filter(e => e.email !== email));
      }
    } catch {
      // Error handled
    } finally {
      setDeletingEmail(null);
    }
  }, [emails]);

  const columns = React.useMemo<ColumnDef<ApprovedEmail>[]>(() => [
    { 
      accessorKey: "email", 
      header: "Email", 
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.email}</span>
        </div>
      ) 
    },
    {
      accessorKey: "role_to_assign",
      header: "Role",
      cell: ({ row }) => (
        <Badge variant="outline" className="capitalize">
          {row.original.role_to_assign.replace("_", " ")}
        </Badge>
      ),
    },
    { 
      accessorKey: "invited_at", 
      header: "Date Added", 
      cell: ({ row }) => (
        <span className="text-muted-foreground text-sm">
          {format(new Date(row.original.invited_at), "MMM d, yyyy")}
        </span>
      ) 
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const isDeleting = deletingEmail === row.original.email;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting}>
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <MoreHorizontal className="h-4 w-4" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleRevoke(row.original.email)}
              >
                <Trash2 className="mr-2 h-4 w-4" />Revoke & Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ], [deletingEmail, handleRevoke]);

  return (
    <div className="space-y-6">
      <PageHeader title="Approved Emails" description="Manage the email whitelist for platform registration" />
      
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={emails}
          searchKey="email"
          searchPlaceholder="Search by email..."
          actionSlot={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Add Email</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Approved Email</DialogTitle>
                  <DialogDescription>Add an email address to allow this user to register.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Email Address</Label>
                    <Input 
                      placeholder="student@university.com" 
                      value={newEmail} 
                      onChange={(e) => setNewEmail(e.target.value)} 
                      type="email" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Assign Role</Label>
                    <Select value={newRole} onValueChange={setNewRole}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="normal_admin">Normal Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                  <Button onClick={handleAddEmail} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Add Email
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          }
          emptyTitle="No approved emails"
          emptyDescription="Add email addresses to allow new users to register."
        />
      )}
    </div>
  );
}
