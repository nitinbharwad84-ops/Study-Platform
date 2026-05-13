"use client";

import React, { useState, useEffect } from "react";
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
import { CheckCircle2, XCircle, MoreHorizontal, Clock, Loader2, Copy } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type ResetRequest = {
  id: string;
  user_id: string;
  email: string;
  reason: string;
  requested_at: string;
  status: "pending" | "approved" | "rejected" | "completed";
  users: {
    first_name: string;
    last_name: string;
  };
};

const statusConfig = { pending: "warning", approved: "success", rejected: "error", completed: "success" } as const;

export default function PasswordResetsPage() {
  const [requests, setRequests] = useState<ResetRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState<{ type: "approve" | "reject"; id: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [resetLinkResult, setResetLinkResult] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/password-resets");
      if (res.ok) {
        const data = await res.json();
        setRequests(data.requests || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    setResetLinkResult(null);

    try {
      const endpoint = `/api/admin/password-resets/${confirmAction.id}/${confirmAction.type}`;
      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (res.ok) {
        if (confirmAction.type === "approve" && data.resetLink) {
          setResetLinkResult(data.resetLink);
        } else {
          setConfirmAction(null);
        }
        fetchRequests(); // Refresh table
      } else {
        alert(data.error || "Failed to perform action");
      }
    } catch {
      alert("Network error");
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = statusFilter === "all" ? requests : requests.filter((r) => r.status === statusFilter);

  const columns: ColumnDef<ResetRequest>[] = [
    { accessorKey: "id", header: "ID", cell: ({ row }) => <code className="text-xs bg-muted px-1.5 py-0.5 rounded">{row.original.id.slice(0,8)}...</code> },
    {
      id: "studentName",
      header: "Student",
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-sm">{row.original.users?.first_name} {row.original.users?.last_name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    { accessorKey: "reason", header: "Reason", cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.reason || "—"}</span> },
    { accessorKey: "requested_at", header: "Requested", cell: ({ row }) => <span className="text-xs text-muted-foreground whitespace-nowrap">{format(new Date(row.original.requested_at), "PPp")}</span> },
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
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="email"
          searchPlaceholder="Search by email..."
          filterSlot={
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          }
          emptyTitle="No requests"
          emptyDescription="No password reset requests match the current filter."
        />
      )}

      <AlertDialog open={!!confirmAction || !!resetLinkResult} onOpenChange={(open) => {
        if (!open) {
          setConfirmAction(null);
          setResetLinkResult(null);
        }
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {resetLinkResult ? "Request Approved" : confirmAction?.type === "approve" ? "Approve Password Reset?" : "Reject Password Reset?"}
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-4 mt-2">
                {resetLinkResult ? (
                  <>
                    <p>The reset request was approved. Since this is an MVP without email integration, please share the following link with the user securely:</p>
                    <div className="flex items-center gap-2 rounded-md bg-muted p-3 border">
                      <code className="text-xs flex-1 overflow-x-auto whitespace-nowrap">{resetLinkResult}</code>
                      <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={() => navigator.clipboard.writeText(resetLinkResult)}>
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </>
                ) : confirmAction?.type === "approve" ? (
                  <p>This will approve the reset request and generate a reset link. Request ID: {confirmAction.id.slice(0, 8)}...</p>
                ) : (
                  <p>This will reject the student&apos;s request. Request ID: {confirmAction?.id?.slice(0, 8)}...</p>
                )}
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {resetLinkResult ? (
              <AlertDialogAction onClick={() => { setResetLinkResult(null); setConfirmAction(null); }}>Done</AlertDialogAction>
            ) : (
              <>
                <AlertDialogCancel disabled={actionLoading}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className={confirmAction?.type === "reject" ? "bg-destructive hover:bg-destructive/90" : ""}
                  onClick={() => {
                    handleAction();
                  }}
                  disabled={actionLoading}
                >
                  {actionLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {confirmAction?.type === "approve" ? "Approve & Generate Link" : "Reject"}
                </AlertDialogAction>
              </>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
