function getSupabaseEnv() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error(
      "Missing Supabase environment variables. Define SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local.",
    );
  }

  return {
    supabaseUrl,
    supabaseServiceRoleKey,
  };
}

export function getSupabaseAdminUrl(path: string) {
  const { supabaseUrl } = getSupabaseEnv();
  return `${supabaseUrl}${path}`;
}

export function getSupabaseAdminHeaders(extraHeaders?: HeadersInit): HeadersInit {
  const { supabaseServiceRoleKey } = getSupabaseEnv();

  return {
    apikey: supabaseServiceRoleKey,
    Authorization: `Bearer ${supabaseServiceRoleKey}`,
    ...(extraHeaders ?? {}),
  };
}
