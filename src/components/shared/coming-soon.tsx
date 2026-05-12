import React from "react";
import { cn } from "@/lib/utils";
import { Construction } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ComingSoonProps {
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export function ComingSoon({
  title = "Coming Soon",
  description = "This feature is under development and will be available in a future update.",
  children,
  className,
}: ComingSoonProps) {
  return (
    <div className={cn("relative", className)}>
      {/* Underlying content (blurred) */}
      {children && (
        <div className="pointer-events-none select-none blur-[2px] opacity-40">
          {children}
        </div>
      )}

      {/* Overlay */}
      <div
        className={cn(
          "flex flex-col items-center justify-center rounded-lg border bg-card/80 backdrop-blur-sm p-12 text-center",
          children && "absolute inset-0 z-10"
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/10">
          <Construction className="h-7 w-7 text-amber-600 dark:text-amber-400" />
        </div>
        <Badge
          variant="outline"
          className="mt-4 border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
        >
          {title}
        </Badge>
        <p className="mt-3 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  );
}
