"use client";

import React, { useState, useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { CheckCircle2, XCircle, AlertTriangle, Info, Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type AuditLog = {
  id: string;
  created_at: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  severity: "info" | "success" | "warning" | "error";
  details: Record<string, unknown>;
};

// Move logic into the component

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const typeIcons = React.useMemo(() => ({
    info: <Info className="h-3.5 w-3.5 text-blue-500" />,
    success: <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />,
    warning: <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />,
    error: <XCircle className="h-3.5 w-3.5 text-red-500" />,
  }), []);

  const columns = React.useMemo<ColumnDef<AuditLog>[]>(() => [
    { 
      accessorKey: "created_at", 
      header: "Timestamp", 
      cell: ({ row }) => (
        <span className="font-mono text-[10px] text-muted-foreground whitespace-nowrap">
          {format(new Date(row.original.created_at), "yyyy-MM-dd HH:mm:ss")}
        </span>
      ) 
    },
    {
      accessorKey: "severity",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5">
          {typeIcons[row.original.severity]}
          <span className="text-[10px] uppercase font-bold tracking-tight">{row.original.severity}</span>
        </div>
      ),
    },
    { accessorKey: "actor_email", header: "Actor", cell: ({ row }) => <span className="text-xs">{row.original.actor_email || "System"}</span> },
    { accessorKey: "action", header: "Action", cell: ({ row }) => <span className="font-medium text-xs">{row.original.action}</span> },
    { 
      accessorKey: "entity_type", 
      header: "Entity", 
      cell: ({ row }) => <Badge variant="outline" className="text-[10px] px-1 py-0">{row.original.entity_type}</Badge> 
    },
    { 
      accessorKey: "entity_id", 
      header: "ID", 
      cell: ({ row }) => <code className="text-[10px] text-muted-foreground">{row.original.entity_id || "—"}</code> 
    },
  ], [typeIcons]);

  const filtered = typeFilter === "all" ? logs : logs.filter((l) => l.severity === typeFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="Audit Logs" description="System-wide activity and audit trail (read-only)" />
      
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          searchKey="actor_email"
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
      )}
    </div>
  );
}
