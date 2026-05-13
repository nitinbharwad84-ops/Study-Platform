import { createServerClient } from "@/lib/supabase/server";
import { headers } from "next/headers";

export type AuditSeverity = "info" | "success" | "warning" | "error";

export async function logAuditEvent({
  actorId,
  actorEmail,
  action,
  entityType,
  entityId,
  details,
  severity = "info",
}: {
  actorId?: string;
  actorEmail?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  details?: any;
  severity?: AuditSeverity;
}) {
  try {
    const supabase = createServerClient();
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";

    const { error } = await supabase.from("audit_logs").insert({
      admin_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      ip_address: ip,
    });

    if (error) {
      console.error("Failed to log audit event:", { error, data: {
        actor_id: actorId,
        actor_email: actorEmail,
        action,
        entity_type: entityType,
        entity_id: entityId,
        details,
        severity,
        ip_address: ip,
      }});
    }
  } catch (err) {
    console.error("Audit logging error:", err);
  }
}
