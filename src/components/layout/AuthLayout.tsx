"use client"

import { usePathname } from "next/navigation"
import { brand } from "@/config/brand.config"
import { BrandLogo } from "@/components/brand-logo"

interface AuthLayoutProps {
  children: React.ReactNode
  subtitle?: string
}

/** Brand-focused auth frame: display type on the field, form on an elevated surface. */
export function AuthLayout({ children, subtitle }: AuthLayoutProps) {
  const pathname = usePathname()

  return (
    <div className="app-bg relative grid min-h-[100dvh] lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,32rem)]">
      <div className="relative z-[1] flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
        <BrandLogo variant="wordmark" width={180} priority />
        <div className="max-w-xl py-10 lg:py-0">
          <p className="type-eyebrow mb-4">{brand.productName}</p>
          <h1 className="type-display-lg">{subtitle || brand.tagline}</h1>
          <p className="type-body-lg mt-5">Member access for the engagement workspace.</p>
        </div>
        <p className="type-caption hidden lg:block">Secure session · {brand.productName}</p>
      </div>

      <div className="relative z-[1] flex items-center px-4 pb-10 sm:px-8 lg:px-10 lg:py-12">
        <div key={pathname} className="surface-featured w-full p-5 sm:p-8">
          <div className="mb-6 lg:hidden">
            <p className="type-caption">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
