import { createClient as createSupabaseClient, type User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/server"

export function getServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !key) return null

  return createSupabaseClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}

function bearerToken(request?: Request): string {
  if (!request) return ""
  const authHeader = request.headers.get("Authorization")
  if (!authHeader?.startsWith("Bearer ")) return ""
  return authHeader.slice(7).trim()
}

/** Cookie session first, then optional Bearer token (admin panel / client widgets). */
export async function getApiUser(request?: Request): Promise<{
  supabase: Awaited<ReturnType<typeof createClient>>
  user: User | null
}> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (user) return { supabase, user }

  const token = bearerToken(request)
  if (!token) return { supabase, user: null }

  const {
    data: { user: tokenUser },
  } = await supabase.auth.getUser(token)

  return { supabase, user: tokenUser }
}
