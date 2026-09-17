import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass"
import { AutomatedIncomeContent } from "./automated-income-content"

export default async function AutomatedIncomePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user && !isDevAuthBypassEnabled()) {
    redirect("/auth/login")
  }

  return <AutomatedIncomeContent userId={user?.id ?? "dev-preview"} />
}
