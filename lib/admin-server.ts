import type { User } from "@supabase/supabase-js"
import { getServiceRoleClient } from "@/lib/api-auth"
import { getAdminEmail, ADMIN_ROLE } from "@/lib/admin"
import { getAdminPassword } from "@/lib/admin-credentials"

const ONBOARDING_META_KEY = "onboarding_completed" as const

let adminUserEnsured = false

async function findAuthUserByEmail(
  admin: NonNullable<ReturnType<typeof getServiceRoleClient>>,
  email: string,
): Promise<User | undefined> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (url && key) {
    try {
      const res = await fetch(`${url}/auth/v1/admin/users?email=${encodeURIComponent(email)}`, {
        headers: {
          Authorization: `Bearer ${key}`,
          apikey: key,
        },
      })
      if (res.ok) {
        const payload = (await res.json()) as { users?: User[]; user?: User }
        if (payload.user?.id) return payload.user
        const match = payload.users?.find((u) => u.email?.toLowerCase() === email)
        if (match) return match
      }
    } catch {
      // Fall through to paginated listUsers
    }
  }

  for (let page = 1; page <= 50; page++) {
    const { data: existingList, error: listError } = await admin.auth.admin.listUsers({
      page,
      perPage: 200,
    })
    if (listError) {
      console.warn("[ensureAdminUser] listUsers failed:", listError.message)
      return undefined
    }
    const match = existingList?.users.find((u) => u.email?.toLowerCase() === email)
    if (match) return match
    if (!existingList?.users.length) break
  }

  return undefined
}

/** Creates or updates the admin account from ADMIN_EMAIL / ADMIN_PASSWORD env vars. */
export async function ensureAdminUser(force = false): Promise<void> {
  if (adminUserEnsured && !force) return

  const email = getAdminEmail()
  const password = getAdminPassword()
  if (!email || !password) {
    console.warn("[ensureAdminUser] ADMIN_EMAIL or ADMIN_PASSWORD not set.")
    return
  }

  const admin = getServiceRoleClient()
  if (!admin) {
    console.warn("[ensureAdminUser] SUPABASE_SERVICE_ROLE_KEY not set — admin user not seeded.")
    return
  }

  const completedAt = new Date().toISOString()
  let existing = await findAuthUserByEmail(admin, email)

  if (!existing) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      app_metadata: { role: ADMIN_ROLE },
      user_metadata: {
        [ONBOARDING_META_KEY]: true,
        full_name: "Admin",
      },
    })
    if (error) {
      if (/already been registered|already registered/i.test(error.message)) {
        existing = await findAuthUserByEmail(admin, email)
        if (!existing) {
          console.warn("[ensureAdminUser] create failed:", error.message)
          return
        }
      } else {
        console.warn("[ensureAdminUser] create failed:", error.message)
        return
      }
    } else if (data.user) {
      existing = data.user
    }
  }

  if (!existing) return

  const { error } = await admin.auth.admin.updateUserById(existing.id, {
    password,
    email_confirm: true,
    app_metadata: { ...existing.app_metadata, role: ADMIN_ROLE },
    user_metadata: {
      ...existing.user_metadata,
      [ONBOARDING_META_KEY]: true,
      full_name: "Admin",
    },
  })
  if (error) {
    console.warn("[ensureAdminUser] update failed:", error.message)
    return
  }

  await admin.from("users").upsert(
    {
      id: existing.id,
      onboarding_completed_at: completedAt,
      updated_at: completedAt,
    },
    { onConflict: "id" },
  )

  adminUserEnsured = true
}
