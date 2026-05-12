"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { DataTable } from "@/components/shared/data-table";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Pencil, UserX, Trash2, ShieldCheck, Shield } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";

type Admin = {
  id: string;
  name: string;
  email: string;
  role: "super-admin" | "normal-admin";
  subjects: string[];
  status: "active" | "disabled";
  lastLogin: string;
};

const ADMINS: Admin[] = [
  { id: "1", name: "Super Admin", email: "super@study.com", role: "super-admin", subjects: ["All"], status: "active", lastLogin: "1 hour ago" },
  { id: "2", name: "Admin User", email: "admin@study.com", role: "normal-admin", subjects: ["Physics", "Chemistry"], status: "active", lastLogin: "3 hours ago" },
  { id: "3", name: "Content Admin", email: "content@study.com", role: "normal-admin", subjects: ["Mathematics", "Biology"], status: "active", lastLogin: "1 day ago" },
  { id: "4", name: "Old Admin", email: "old@study.com", role: "normal-admin", subjects: ["Physics"], status: "disabled", lastLogin: "1 month ago" },
];

const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "name",
    header: "Admin",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8">
          <AvatarFallback className="text-xs bg-secondary/10 text-secondary">
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        {row.original.role === "super-admin"
          ? <ShieldCheck className="h-4 w-4 text-primary" />
          : <Shield className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm capitalize">{row.original.role.replace("-", " ")}</span>
      </div>
    ),
  },
  {
    accessorKey: "subjects",
    header: "Subjects",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.subjects.slice(0, 2).map((s) => (
          <Badge key={s} variant="outline" className="text-xs">{s}</Badge>
        ))}
        {row.original.subjects.length > 2 && (
          <Badge variant="outline" className="text-xs">+{row.original.subjects.length - 2}</Badge>
        )}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <StatusBadge status={row.original.status === "active" ? "success" : "error"} label={row.original.status === "active" ? "Active" : "Disabled"} />
    ),
  },
  { accessorKey: "lastLogin", header: "Last Login", cell: ({ row }) => <span className="text-muted-foreground text-sm">{row.original.lastLogin}</span> },
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
          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-destructive"><UserX className="mr-2 h-4 w-4" />Disable</DropdownMenuItem>
          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function AdminsPage() {
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-6">
      <PageHeader title="Admins" description="Manage admin accounts and permissions" />
      <DataTable
        columns={columns}
        data={ADMINS}
        searchKey="name"
        searchPlaceholder="Search admins..."
        actionSlot={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Create Admin</Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create Admin</DialogTitle>
                <DialogDescription>Create a new admin account with a specified role.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5"><Label>First Name</Label><Input placeholder="John" /></div>
                  <div className="space-y-1.5"><Label>Last Name</Label><Input placeholder="Doe" /></div>
                </div>
                <div className="space-y-1.5"><Label>Email</Label><Input placeholder="admin@study.com" type="email" /></div>
                <div className="space-y-1.5">
                  <Label>Role</Label>
                  <Select defaultValue="normal-admin">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="super-admin">Super Admin</SelectItem>
                      <SelectItem value="normal-admin">Normal Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => setOpen(false)}>Create Admin</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
    </div>
  );
}
