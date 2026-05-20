import { supabase } from "./supabase";

/**
 * Check if current user is admin.
 * Returns user profile if admin, null otherwise.
 */
export async function checkAdmin() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .eq("is_admin", true)
    .single();

  return profile;
}

/**
 * Admin API helper - fetches with admin check
 */
export async function adminFetch(table: string, options?: {
  select?: string;
  filters?: Record<string, unknown>;
  order?: { column: string; ascending?: boolean };
  limit?: number;
}) {
  const { select = "*", filters, order, limit } = options || {};

  let query = supabase.from(table).select(select);

  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      query = query.eq(key, value);
    }
  }

  if (order) {
    query = query.order(order.column, { ascending: order.ascending ?? false });
  }

  if (limit) {
    query = query.limit(limit);
  }

  return query;
}
