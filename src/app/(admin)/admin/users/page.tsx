"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal, UserX, UserCheck, Eye } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type User = {
  id: string;
  name: string;
  email: string;
  status: "active" | "disabled" | "pending";
  exams: number;
  lastActive: string;
  joined: string;
};

const USERS: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@study.com", status: "active", exams: 24, lastActive: "2 hours ago", joined: "Jan 10, 2026" },
  { id: "2", name: "Bob Sharma", email: "bob@study.com", status: "active", exams: 18, lastActive: "1 day ago", joined: "Jan 15, 2026" },
  { id: "3", name: "Carol Patel", email: "carol@study.com", status: "disabled", exams: 5, lastActive: "2 weeks ago", joined: "Feb 1, 2026" },
  { id: "4", name: "David Kim", email: "david@study.com", status: "active", exams: 31, lastActive: "30 min ago", joined: "Dec 20, 2025" },
  { id: "5", name: "Eva Martinez", email: "eva@study.com", status: "pending", exams: 0, lastActive: "Never", joined: "May 11, 2026" },
  { id: "6", name: "Frank Liu", email: "frank@study.com", status: "active", exams: 12, lastActive: "3 days ago", joined: "Mar 5, 2026" },
  { id: "7", name: "Grace Thompson", email: "grace@study.com", status: "active", exams: 9, lastActive: "5 hours ago", joined: "Feb 28, 2026" },
  { id: "8", name: "Hassan Ali", email: "hassan@study.com", status: "disabled", exams: 3, lastActive: "1 month ago", joined: "Jan 30, 2026" },
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-primary/10 text-primary">
            {row.original.name.split(" ").map((n) => n[0]).join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-sm">{row.original.name}</p>
          <p className="text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge
        status={row.original.status === "active" ? "success" : row.original.status === "pending" ? "warning" : "error"}
        label={row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
      />
    ),
  },
  { accessorKey: "exams", header: "Exams Taken", cell: ({ row }) => <span className="font-medium">{row.original.exams}</span> },
  { accessorKey: "lastActive", header: "Last Active", cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.lastActive}</span> },
  { accessorKey: "joined", header: "Joined", cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.joined}</span> },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem><Eye className="mr-2 h-4 w-4" />View Profile</DropdownMenuItem>
          <DropdownMenuSeparator />
          {row.original.status === "active" ? (
            <DropdownMenuItem className="text-destructive">
              <UserX className="mr-2 h-4 w-4" />Disable Account
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem className="text-emerald-600 dark:text-emerald-400">
              <UserCheck className="mr-2 h-4 w-4" />Enable Account
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AdminUsersPage() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = statusFilter === "all" ? USERS : USERS.filter((u) => u.status === statusFilter);

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="View and manage all registered students" />
      <DataTable
        columns={columns}
        data={filtered}
        searchKey="name"
        searchPlaceholder="Search by name or email..."
        filterSlot={
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="disabled">Disabled</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
            </SelectContent>
          </Select>
        }
        actionSlot={<Badge variant="outline" className="font-normal">{USERS.length} total users</Badge>}
        emptyTitle="No users found"
        emptyDescription="No users match the current filter."
      />
    </div>
  );
}
