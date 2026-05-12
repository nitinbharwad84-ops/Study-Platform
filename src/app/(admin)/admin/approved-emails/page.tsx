"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
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
import { Plus, MoreHorizontal, Trash2, Ban } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type ApprovedEmail = {
  id: string;
  email: string;
  status: "approved" | "claimed" | "revoked" | "expired";
  addedBy: string;
  dateAdded: string;
};

const EMAILS: ApprovedEmail[] = [
  { id: "1", email: "alice@study.com", status: "claimed", addedBy: "admin@study.com", dateAdded: "Jan 10, 2026" },
  { id: "2", email: "bob@study.com", status: "claimed", addedBy: "admin@study.com", dateAdded: "Jan 15, 2026" },
  { id: "3", email: "carol@study.com", status: "claimed", addedBy: "super@study.com", dateAdded: "Feb 1, 2026" },
  { id: "4", email: "david@study.com", status: "claimed", addedBy: "admin@study.com", dateAdded: "Dec 20, 2025" },
  { id: "5", email: "eva@study.com", status: "approved", addedBy: "super@study.com", dateAdded: "May 11, 2026" },
  { id: "6", email: "pending@university.com", status: "approved", addedBy: "admin@study.com", dateAdded: "May 10, 2026" },
  { id: "7", email: "old@student.com", status: "expired", addedBy: "admin@study.com", dateAdded: "Nov 1, 2025" },
  { id: "8", email: "revoked@test.com", status: "revoked", addedBy: "super@study.com", dateAdded: "Oct 15, 2025" },
];

const statusConfig = {
  approved: "warning",
  claimed: "success",
  revoked: "error",
  expired: "inactive",
} as const;

const columns: ColumnDef<ApprovedEmail>[] = [
  { accessorKey: "email", header: "Email", cell: ({ row }) => <span className="font-medium">{row.original.email}</span> },
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
  { accessorKey: "addedBy", header: "Added By", cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.addedBy}</span> },
  { accessorKey: "dateAdded", header: "Date Added", cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.dateAdded}</span> },
  {
    id: "actions",
    header: "Actions",
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem className="text-amber-600 dark:text-amber-400">
            <Ban className="mr-2 h-4 w-4" />Revoke Access
          </DropdownMenuItem>
          <DropdownMenuItem className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function ApprovedEmailsPage() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader title="Approved Emails" description="Manage the email whitelist for platform registration" />
      <DataTable
        columns={columns}
        data={EMAILS}
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
              <div className="space-y-3 py-2">
                <div className="space-y-1.5">
                  <Label>Email Address</Label>
                  <Input placeholder="student@university.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Add Email</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
        emptyTitle="No approved emails"
        emptyDescription="Add email addresses to allow new users to register."
      />
    </div>
  );
}
