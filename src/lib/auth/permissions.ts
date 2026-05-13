import { createClient } from "@supabase/supabase-js";

// We use the service role client for permission checks because we might need to query
// other users' permissions (e.g., when an admin manages another admin), 
// or because RLS policies might not be fully configured yet.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
});

export type PermissionKey =
  | "can_manage_users"
  | "can_manage_admins"
  | "can_manage_subjects"
  | "can_manage_content"
  | "can_manage_providers"
  | "can_view_analytics"
  | "can_view_audit_logs"
  | "can_approve_resets";

/**
 * Gets all permissions for a given user ID, evaluating both role-based
 * default permissions and user-specific overrides.
 */
export async function getUserPermissions(userId: string): Promise<Set<PermissionKey>> {
  if (!userId) return new Set();

  // 1. Get user info and role
  const { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select(`
      role_id,
      roles ( name )
    `)
    .eq("id", userId)
    .single();

  if (userError || !user) {
    console.error("Error fetching user info:", userError);
    return new Set();
  }

  // 1.5 Get user specific permission overrides
  const { data: overrides, error: overridesError } = await supabaseAdmin
    .from("user_permissions")
    .select(`
      granted,
      permissions ( key )
    `)
    .eq("user_id", userId);

  if (overridesError) {
    console.error("Error fetching user permission overrides:", overridesError);
  }

  // Super admins implicitly have all permissions
  // Normally we also map this in the DB, but hardcoding the bypass is safer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const roleName = Array.isArray(user.roles) ? (user.roles[0] as any)?.name : (user.roles as any)?.name;
  if (roleName === "super_admin") {
    const { data: allPerms } = await supabaseAdmin.from("permissions").select("key");
    const permsSet = new Set(allPerms?.map((p) => p.key as PermissionKey) || []);
    return permsSet;
  }

  // 2. Get role-based permissions
  const { data: rolePerms, error: roleError } = await supabaseAdmin
    .from("role_permissions")
    .select(`
      permissions ( key )
    `)
    .eq("role_id", user.role_id);

  if (roleError) {
    console.error("Error fetching role permissions:", roleError);
    return new Set();
  }

  const finalPermissions = new Set<PermissionKey>();

  // Add all role permissions
  if (rolePerms) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rolePerms.forEach((rp: any) => {
      if (rp.permissions?.key) {
        finalPermissions.add(rp.permissions.key as PermissionKey);
      }
    });
  }

  // Apply user-specific overrides
  if (overrides) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overrides.forEach((up: any) => {
      const key = up.permissions?.key as PermissionKey;
      if (!key) return;

      if (up.granted) {
        finalPermissions.add(key);
      } else {
        finalPermissions.delete(key);
      }
    });
  }

  return finalPermissions;
}

/**
 * Checks if a user has a specific permission.
 */
export async function hasPermission(userId: string, permission: PermissionKey): Promise<boolean> {
  const perms = await getUserPermissions(userId);
  return perms.has(permission);
}
