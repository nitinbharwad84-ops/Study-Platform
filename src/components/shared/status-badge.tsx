import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusVariant = "active" | "inactive" | "pending" | "success" | "error" | "warning" | "info";

interface StatusBadgeProps {
  status: StatusVariant;
  label?: string;
  className?: string;
}

const statusConfig: Record<StatusVariant, { className: string; defaultLabel: string }> = {
  active: {
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    defaultLabel: "Active",
  },
  inactive: {
    className: "border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-400",
    defaultLabel: "Inactive",
  },
  pending: {
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    defaultLabel: "Pending",
  },
  success: {
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    defaultLabel: "Success",
  },
  error: {
    className: "border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400",
    defaultLabel: "Error",
  },
  warning: {
    className: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    defaultLabel: "Warning",
  },
  info: {
    className: "border-blue-500/30 bg-blue-500/10 text-blue-700 dark:text-blue-400",
    defaultLabel: "Info",
  },
};

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full text-[11px] font-medium",
        config.className,
        className
      )}
    >
      <span className={cn(
        "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
        status === "active" || status === "success" ? "bg-emerald-500" :
        status === "error" ? "bg-red-500" :
        status === "pending" || status === "warning" ? "bg-amber-500" :
        status === "info" ? "bg-blue-500" :
        "bg-slate-500"
      )} />
      {label || config.defaultLabel}
    </Badge>
  );
}
