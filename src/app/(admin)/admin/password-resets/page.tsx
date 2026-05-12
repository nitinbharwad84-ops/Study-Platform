"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, XCircle, MoreHorizontal, Clock } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type ResetRequest = {
  id: string;
  studentName: string;
  email: string;
  reason: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected" | "expired";
};

const REQUESTS: ResetRequest[] = [
  { id: "REQ-001", studentName: "Frank Liu", email: "frank@study.com", reason: "Forgot password after device change", requestedAt: "May 10, 2026 10:00 AM", status: "pending" },
  { id: "REQ-002", studentName: "Alice Johnson", email: "alice@study.com", reason: "", requestedAt: "May 8, 2026 02:30 PM", status: "approved" },
  { id: "REQ-003", studentName: "Bob Sharma", email: "bob@study.com", reason: "Phone lost", requestedAt: "May 5, 2026 09:00 AM", status: "approved" },
  { id: "REQ-004", studentName: "Eva Martinez", email: "eva@study.com", reason: "Cannot remember password", requestedAt: "Apr 20, 2026 11:00 AM", status: "expired" },
  { id: "REQ-005", studentName: "David Kim", email: "david@study.com", reason: "Test account", requestedAt: "Apr 15, 2026 03:00 PM", status: "rejected" },
];

const statusConfig = { pending: "warning", approved: "success", rejected: "error", expired: "inactive" } as const;

export default function PasswordResetsPage() {
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject"; id: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? REQUESTS : REQUESTS.filter((r) => r.status === statusFilter);

  const columns: ColumnDef<ResetRequest>[] = [
    { accessorKey: "id", header: "ID", cell: ({ row }) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.original.id}</code> },
    {
      accessorKey: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.studentName}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: "reason", header: "Reason", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.reason || "—"}</span> },
    { accessorKey: "requestedAt", header: "Requested", cell: ({ row }) => <span className="text-xs text-muted-foreground whitespace-nowrap">{row.original.requestedAt}</span> },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={statusConfig[row.original.status]} label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)} />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => row.original.status === "pending" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="text-emerald-600 dark:text-emerald-400" onClick={() => setConfirmAction({ type: "approve", id: row.original.id })}>
              <CheckCircle2 className="mr-2 h-4 w-4" />Approve
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => setConfirmAction({ type: "reject", id: row.original.id })}>
              <XCircle className="mr-2 h-4 w-4" />Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : <span className="text-xs text-muted-foreground pl-3"><Clock className="h-3.5 w-3.5 inline mr-1" />Resolved</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Password Resets" description="Review and approve student password reset requests" />
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="studentName"
        searchPlaceholder="Search by student name..."
        filterSlot={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        }
        emptyTitle="No requests"
        emptyDescription="No password reset requests match the current filter."
      />

      <AlertDialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.type === "approve" ? "Approve Password Reset?" : "Reject Password Reset?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.type === "approve"
                ? `This will send a password reset link to the student's email address. Request ID: ${confirmAction?.id}`
                : `The student will be notified that their request has been rejected. Request ID: ${confirmAction?.id}`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className={confirmAction?.type === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
              onClick={() => setConfirmAction(null)}
            >
              {confirmAction?.type === "approve" ? "Approve" : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
