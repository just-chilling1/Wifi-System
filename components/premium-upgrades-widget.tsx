"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowRight, Sparkles } from "lucide-react"
import { PREMIUM_FEATURES } from "@/lib/premium-features"

export function PremiumUpgradesWidget() {
  const pathname = usePathname()

  return (
    <div className="premium-nav-section p-2">
      <div className="premium-nav-section-shimmer" aria-hidden />
      <div className="relative z-[1] px-3 pb-3 pt-2.5">
        <p className="premium-nav-section-label flex items-center gap-2 text-xs uppercase tracking-wider">
          <Sparkles className="premium-sparkle h-4 w-4" fill="currentColor" />
          Premium Upgrades
        </p>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-2">
          Unlock the tools that drive the biggest results.
        </p>
      </div>

      <div className="relative z-[1] space-y-2">
        {PREMIUM_FEATURES.map((feature, index) => {
          const isActive = pathname === feature.href
          const Icon = feature.icon

          return (
            <div
              key={feature.href}
              className="premium-stagger-item"
              style={{ animationDelay: `${0.1 + index * 0.08}s` }}
            >
              <Link
                href={feature.href}
                className={`premium-upgrade-card group ${isActive ? "is-active" : ""}`}
              >
                <span className="premium-upgrade-icon" aria-hidden>
                  <Icon className="h-4 w-4" />
                </span>

                <div className="min-w-0 flex-1">
                  <span className={`block text-sm font-semibold tracking-wide ${isActive ? "text-[#f8fafc]" : "text-ink"}`}>
                    {feature.label}
                  </span>
                  <p className={`mt-0.5 text-xs leading-relaxed ${isActive ? "text-sapphire-300" : "text-ink-3"}`}>
                    {feature.description}
                  </p>
                </div>

                <span
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-[160ms] ${
                    isActive
                      ? "bg-white/15 text-[#f8fafc]"
                      : "bg-sapphire-100 text-sapphire-700 group-hover:translate-x-0.5"
                  }`}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            </div>
          )
        })}
      </div>
    </div>
  )
}
