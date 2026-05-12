import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Table skeleton — mimics a data table with N rows
export function TableSkeleton({ rows = 5, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-4">
      {/* Toolbar skeleton */}
      <div className="flex items-center gap-3">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-9 w-36" />
        <div className="ml-auto">
          <Skeleton className="h-9 w-28" />
        </div>
      </div>
      {/* Table skeleton */}
      <div className="rounded-lg border overflow-hidden">
        <div className="bg-muted/40 p-4">
          <div className="flex gap-6">
            {Array.from({ length: cols }).map((_, i) => (
              <Skeleton key={i} className="h-4 flex-1" />
            ))}
          </div>
        </div>
        <div className="divide-y">
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div key={rowIdx} className="flex gap-6 p-4">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <Skeleton
                  key={colIdx}
                  className="h-4 flex-1"
                  style={{ opacity: 1 - colIdx * 0.1 }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Pagination skeleton */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <div className="flex gap-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Stats card grid skeleton
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-8 rounded-lg" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-1" />
            <Skeleton className="h-3 w-32" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Full page skeleton
export function PageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="space-y-2">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      {/* Cards */}
      <CardGridSkeleton />
      {/* Table */}
      <Card>
        <CardContent className="p-6">
          <TableSkeleton />
        </CardContent>
      </Card>
    </div>
  );
}

// Inline skeleton for small areas
export function InlineSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-4"
          style={{ width: `${100 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

/**
 * Unified LoadingSkeleton — dispatches to the appropriate variant.
 * variant: "table" | "card-grid" | "page" | "inline"
 */
export function LoadingSkeleton({
  variant = "page",
  count,
}: {
  variant?: "table" | "card-grid" | "page" | "inline";
  count?: number;
}) {
  if (variant === "table") return <TableSkeleton rows={count} />;
  if (variant === "card-grid") return <CardGridSkeleton count={count} />;
  if (variant === "inline") return <InlineSkeleton lines={count} />;
  return <PageSkeleton />;
}

