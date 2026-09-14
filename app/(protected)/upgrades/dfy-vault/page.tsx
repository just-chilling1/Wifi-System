import { Metadata } from "next"
import DFYVaultClient from "./DFYVaultClient"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { listPremiumGenerationSets } from "@/app/actions/premium-generation-sets"

export const metadata: Metadata = {
  title: `${PREMIUM_FEATURE_LABELS.dfyVault} | Pre-Loaded Opportunities`,
  description: "200+ viral videos with ready-to-use comments",
}

export default async function DFYVaultPage() {
  const libraryResult = await listPremiumGenerationSets("dfy_vault")
  const initialSets = libraryResult.success ? libraryResult.sets : []
  return <DFYVaultClient initialSets={initialSets} />
}
