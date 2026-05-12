"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertTriangle, Info } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type AuditLog = {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  type: "info" | "success" | "warning" | "error";
};

const LOGS: AuditLog[] = [
  { id: "1", timestamp: "2026-05-12 15:42:10", actor: "john@study.com", action: "User Login", entity: "User", entityId: "USR-001", type: "info" },
  { id: "2", timestamp: "2026-05-12 15:30:55", actor: "admin@study.com", action: "Question Added", entity: "MCQ Question", entityId: "PHY-050", type: "success" },
  { id: "3", timestamp: "2026-05-12 14:55:20", actor: "unknown@test.com", action: "Failed Login Attempt", entity: "Auth", entityId: "—", type: "error" },
  { id: "4", timestamp: "2026-05-12 13:20:00", actor: "sarah@study.com", action: "Exam Completed", entity: "MCQ Attempt", entityId: "ATT-089", type: "success" },
  { id: "5", timestamp: "2026-05-12 12:10:30", actor: "admin@study.com", action: "Provider Test Failed", entity: "AI Provider", entityId: "nvidia", type: "warning" },
  { id: "6", timestamp: "2026-05-12 11:00:00", actor: "super@study.com", action: "Admin Created", entity: "Admin", entityId: "ADM-004", type: "success" },
  { id: "7", timestamp: "2026-05-12 10:45:15", actor: "content@study.com", action: "Subject Updated", entity: "Subject", entityId: "SUB-002", type: "info" },
  { id: "8", timestamp: "2026-05-12 09:30:00", actor: "super@study.com", action: "Email Approved", entity: "Approved Email", entityId: "pending@uni.com", type: "success" },
  { id: "9", timestamp: "2026-05-11 18:00:45", actor: "carol@study.com", action: "Account Disabled", entity: "User", entityId: "USR-003", type: "warning" },
  { id: "10", timestamp: "2026-05-11 16:15:30", actor: "bob@study.com", action: "Exam Started", entity: "MCQ Attempt", entityId: "ATT-088", type: "info" },
  { id: "11", timestamp: "2026-05-11 14:00:00", actor: "admin@study.com", action: "Question Deactivated", entity: "MCQ Question", entityId: "BIO-001", type: "warning" },
  { id: "12", timestamp: "2026-05-11 12:30:20", actor: "super@study.com", action: "System Config Updated", entity: "Settings", entityId: "—", type: "info" },
  { id: "13", timestamp: "2026-05-10 20:00:00", actor: "frank@study.com", action: "Password Reset Requested", entity: "Password Reset", entityId: "REQ-003", type: "info" },
  { id: "14", timestamp: "2026-05-10 18:00:00", actor: "admin@study.com", action: "Reset Approved", entity: "Password Reset", entityId: "REQ-002", type: "success" },
  { id: "15", timestamp: "2026-05-10 10:00:00", actor: "unknown@hack.com", action: "Failed Login Attempt", entity: "Auth", entityId: "—", type: "error" },
];

const typeIcons = {
  info: <Info className="h-3.5 w-3.5 text-blue-500" />,
  success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
  warning: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
  error: <XCircle className="h-3.5 w-3.5 text-red-500" />,
};

const columns: ColumnDef<AuditLog>[] = [
  { accessorKey: "timestamp", header: "Timestamp", cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground whitespace-nowrap">{row.original.timestamp}</span> },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        {typeIcons[row.original.type]}
        <span className="text-xs capitalize">{row.original.type}</span>
      </div>
    ),
  },
  { accessorKey: "actor", header: "Actor", cell: ({ row }) => <span className="text-sm">{row.original.actor}</span> },
  { accessorKey: "action", header: "Action", cell: ({ row }) => <span className="font-medium text-sm">{row.original.action}</span> },
  { accessorKey: "entity", header: "Entity", cell: ({ row }) => <Badge variant="outline" className="text-xs">{row.original.entity}</Badge> },
  { accessorKey: "entityId", header: "Entity ID", cell: ({ row }) => <code className="text-xs text-muted-foreground">{row.original.entityId}</code> },
];

export default function AuditPage() {
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = typeFilter === "all" ? LOGS : LOGS.filter((l) => l.type === typeFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="System-wide activity and audit trail (read-only)" />
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="actor"
        searchPlaceholder="Search by actor..."
        filterSlot={
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        }
        emptyTitle="No logs found"
        emptyDescription="No audit logs match the current filter."
      />
    </div>
  );
}
