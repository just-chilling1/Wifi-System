"use client"

import { PromoLinksProvider } from "@/context/PromoLinksContext"
import { BrandStyleProvider } from "./BrandStyleProvider"
import { Shell } from "./Shell"

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrandStyleProvider>
      <PromoLinksProvider>
        <Shell>{children}</Shell>
      </PromoLinksProvider>
    </BrandStyleProvider>
  )
}
