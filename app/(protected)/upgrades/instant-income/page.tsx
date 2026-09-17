import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { listInstantIncomePostSets } from "@/app/actions/instant-income-post-sets"
import { InstantIncomeContent } from "./instant-income-content"

export default async function InstantIncomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  const libraryResult = user
    ? await listInstantIncomePostSets()
    : { success: true as const, sets: [] }
  const initialSets = libraryResult.success ? libraryResult.sets : []

  return <InstantIncomeContent userId={user?.id ?? "dev-preview"} initialSets={initialSets} />
}
