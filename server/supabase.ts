import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client for real-time operations
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables"
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Export helper for real-time subscriptions
export function subscribeToTable(
  tableName: string,
  callback: (payload: any) => void
) {
  return supabase
    .channel(`public:${tableName}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: tableName,
      },
      callback
    )
    .subscribe();
}

// Helper to unsubscribe from real-time updates
export function unsubscribeFromTable(subscription: any) {
  return supabase.removeChannel(subscription);
}
