"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, MoreHorizontal, Pencil, UserX, UserCheck, ShieldCheck, Shield, Loader2 } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

type Admin = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "super_admin" | "normal_admin";
  status: "active" | "inactive";
  created_at: string;
};

// Move logic into the component

export default function AdminsPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Form state
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("normal_admin");

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/admins");
      if (res.ok) {
        const data = await res.json();
        setAdmins(data.admins || []);
      }
    } catch {
      // Error handled
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (adminId: string, newStatus: string) => {
    setUpdatingId(adminId);
    try {
      const res = await fetch(`/api/admin/users/${adminId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setAdmins(admins.map(a => a.id === adminId ? { ...a, status: newStatus as any } : a));
      }
    } catch {
      // Error handled
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreateInvitation = async () => {
    if (!email) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/approved-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role }),
      });
      if (res.ok) {
        setEmail("");
        setOpen(false);
        alert("Admin invitation created. They can now register using this email.");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create invitation");
      }
    } catch {
      alert("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  const columns: ColumnDef<Admin>[] = [
    {
      accessorKey: "name",
      header: "Admin",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="text-xs bg-secondary/10 text-secondary">
              {row.original.first_name?.[0]}{row.original.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{row.original.first_name} {row.original.last_name}</p>
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
          {row.original.role === "super_admin"
            ? <ShieldCheck className="h-4 w-4 text-primary" />
            : <Shield className="h-4 w-4 text-muted-foreground" />}
          <span className="text-sm capitalize">{row.original.role.replace("_", " ")}</span>
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge 
          status={row.original.status === "active" ? "success" : "error"} 
          label={row.original.status === "active" ? "Active" : "Disabled"} 
        />
      ),
    },
    { 
      accessorKey: "created_at", 
      header: "Joined", 
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
            <DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit Permissions</DropdownMenuItem>
            <DropdownMenuSeparator />
            {row.original.status === "active" ? (
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => handleUpdateStatus(row.original.id, "inactive")}
              >
                <UserX className="mr-2 h-4 w-4" />Disable
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem 
                className="text-emerald-600 dark:text-emerald-400"
                onClick={() => handleUpdateStatus(row.original.id, "active")}
              >
                <UserCheck className="mr-2 h-4 w-4" />Enable
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Admins" description="Manage admin accounts and permissions" />
      
      {loading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <DataTable
          columns={columns}
          data={admins}
          searchKey="email"
          searchPlaceholder="Search admins..."
          actionSlot={
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="sm"><Plus className="mr-1.5 h-4 w-4" />Create Admin</Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Invite Admin</DialogTitle>
                  <DialogDescription>
                    Approve an email address to allow a new admin to register.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <Label>Email</Label>
                    <Input 
                      placeholder="admin@study.com" 
                      type="email" 
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                        <SelectItem value="normal_admin">Normal Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)} disabled={submitting}>Cancel</Button>
                  <Button onClick={handleCreateInvitation} disabled={submitting}>
                    {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Send Invitation
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
