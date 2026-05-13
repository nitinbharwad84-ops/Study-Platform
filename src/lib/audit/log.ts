import { createServerClient } from "@/lib/supabase/server";

export type AuditSeverity = "info" | "success" | "warning" | "error";

interface AuditEvent {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  severity: AuditSeverity;
  details?: Record<string, unknown>;
}

/**
 * Log a system event to the audit_logs table.
 * Uses the service role client to ensure logs are always written regardless of user permissions.
 */
export async function logAuditEvent(event: AuditEvent) {
  try {
    const supabase = createServerClient();
    
    const { error } = await supabase.from("audit_logs").insert({
      actor_id: event.actorId || null,
      actor_email: event.actorEmail || "System",
      action: event.action,
      entity_type: event.entityType,
      entity_id: event.entityId || null,
      severity: event.severity,
      details: event.details || {},
    });

    if (error) {
      console.error("[AuditLog] Failed to insert log:", error);
    }
  } catch (err) {
    console.error("[AuditLog] Critical error:", err);
  }
}
