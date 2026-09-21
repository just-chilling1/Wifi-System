"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function completeOnboarding() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false as const, error: "Not authenticated" }
    }

    const { error: updateError } = await supabase
      .from("users")
      .update({
        onboarding_completed_at: new Date().toISOString(),
      })
      .eq("id", user.id)

    if (updateError) {
      console.error("[onboarding] Failed to complete:", updateError)
      return { success: false as const, error: "Failed to save onboarding status" }
    }

    revalidatePath("/dashboard")
    revalidatePath("/onboarding")

    return { success: true as const }
  } catch (error) {
    console.error("[onboarding] Error:", error)
    return { success: false as const, error: "An error occurred" }
  }
}
