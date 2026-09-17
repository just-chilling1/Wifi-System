"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { unlockUpgrade } from "@/app/actions/unlock-upgrade"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Sparkles, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"

const Confetti = dynamic(() => import("react-confetti"), { ssr: false })

interface UnlockUpgradeClientProps {
  upgradeLevel: "dfy_vault" | "instant_income" | "automated_income"
  upgradeName: string
  upgradeValue: string
  features: string[]
}

export function UnlockUpgradeClient({ upgradeLevel, upgradeName, upgradeValue, features }: UnlockUpgradeClientProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    async function unlock() {
      const result = await unlockUpgrade(upgradeLevel)

      if (result.success) {
        setStatus("success")
        setShowConfetti(true)

        // Stop confetti after 5 seconds
        setTimeout(() => setShowConfetti(false), 5000)
      } else {
        setStatus("error")
      }
    }

    unlock()
  }, [upgradeLevel])

  if (status === "loading") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background px-4">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-sapphire-500 sm:h-16 sm:w-16" />
          <p className="text-base text-ink-4 sm:text-xl">Unlocking your upgrade...</p>
        </div>
      </div>
    )
  }

  if (status === "error") {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-background p-4 sm:p-6">
        <div className="w-full max-w-md rounded-3xl border border-[var(--border)] bg-card p-5 text-center shadow-[var(--shadow-lg)] sm:p-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/20 sm:h-16 sm:w-16">
            <span className="text-2xl sm:text-3xl">❌</span>
          </div>
          <h1 className="mb-2 text-xl font-bold text-ink sm:text-2xl">Unlock Failed</h1>
          <p className="mb-6 text-sm text-ink-4 sm:text-base">
            We couldn&apos;t unlock your upgrade. Please make sure you&apos;re logged in and try again.
          </p>
          <Link href="/dashboard">
            <Button className="w-full bg-primary font-bold text-white hover:bg-primary-hover">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background p-4 sm:p-6">
      {showConfetti && <Confetti recycle={false} numberOfPieces={500} />}

      <div className="w-full max-w-2xl rounded-3xl border border-[var(--border)] bg-card p-5 shadow-[var(--shadow-lg)] sm:p-8">
        {/* Success Icon */}
        <div className="mb-5 flex justify-center sm:mb-6">
          <div className="relative">
            <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary sm:h-24 sm:w-24">
              <CheckCircle2 className="h-10 w-10 text-white sm:h-12 sm:w-12" />
            </div>
            <Sparkles className="absolute -right-2 -top-2 h-7 w-7 animate-bounce text-sapphire-500 sm:h-8 sm:w-8" />
          </div>
        </div>

        {/* Success Message */}
        <h1 className="mb-3 text-center text-2xl font-bold text-ink sm:text-4xl">🎉 Congratulations!</h1>
        <p className="mb-5 text-center text-base text-sapphire-700 sm:mb-6 sm:text-xl">
          You&apos;ve unlocked <span className="font-bold">{upgradeName}</span>!
        </p>

        {/* Upgrade Value */}
        <div className="mb-5 rounded-2xl border border-[var(--border)] bg-card p-4 sm:mb-6 sm:p-6">
          <div className="mb-4 text-center">
            <span className="text-sm text-ink-4">Upgrade Value</span>
            <p className="text-3xl font-bold text-sapphire-700 sm:text-5xl">{upgradeValue}</p>
          </div>

          {/* Features */}
          <div className="space-y-3">
            <p className="text-ink-4 font-semibold mb-3">What You Just Unlocked:</p>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-sapphire-700 flex-shrink-0 mt-0.5" />
                <span className="text-ink-4">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3">
          <Link href="/dashboard" className="block">
            <Button className="w-full bg-primary hover:bg-primary-hover text-white font-bold text-lg py-6 rounded-xl shadow-[var(--shadow-md)]">
              Go to Dashboard
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <Link href="/training" className="block">
            <Button
              variant="outline"
              className="w-full border-[var(--border)] text-sapphire-700 hover:bg-sapphire-100 font-semibold py-6 rounded-xl bg-card"
            >
              Access Training
            </Button>
          </Link>
        </div>

        {/* Footer Message */}
        <p className="text-center text-ink-4 text-sm mt-6">
          Your account has been upgraded. All premium features are now available!
        </p>
      </div>
    </div>
  )
}
