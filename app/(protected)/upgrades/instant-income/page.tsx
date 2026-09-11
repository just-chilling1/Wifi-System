import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { listInstantIncomePostSets } from "@/app/actions/instant-income-post-sets"
import { InstantIncomeContent } from "./instant-income-content"

export default async function InstantIncomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const libraryResult = await listInstantIncomePostSets()
  const initialSets = libraryResult.success ? libraryResult.sets : []

  return <InstantIncomeContent userId={user.id} initialSets={initialSets} />
}
