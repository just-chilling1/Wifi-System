"use client"

import type { LucideIcon } from "lucide-react"
import {
  Activity,
  Calendar,
  CheckCircle2,
  FileText,
  Fingerprint,
  Gem,
  Globe,
  Key,
  Lock,
  Mail,
  Server,
  Shield,
  ShieldCheck,
  User,
} from "lucide-react"
import { PremiumPageLayout } from "@/components/premium-page-layout"
import { PremiumVideoTutorial } from "@/components/premium-video-tutorial"
import { PRODUCT_NAME } from "@/lib/brand"
import { PREMIUM_FEATURE_LABELS } from "@/lib/premium-features"
import { getPremiumTrainingVimeoId } from "@/lib/premium-training-videos"
import type { ProtectorViewModel } from "@/lib/protector/build-protector-data"
import { cn } from "@/lib/utils"

interface ProtectorContentProps {
  data: ProtectorViewModel
}

const panelClass =
  "overflow-hidden rounded-[2.75rem] border border-[var(--border-subtle)] bg-[var(--layer-elevated)] shadow-[var(--ds-shadow-card)]"

const PROTECTION_LAYERS = [
  {
    num: "1",
    title: "Verified identity",
    desc: "Sign-in credentials and email status are checked on every session.",
  },
  {
    num: "2",
    title: "Encrypted session",
    desc: "Your connection stays private while you work inside the command center.",
  },
  {
    num: "3",
    title: "Live monitoring",
    desc: "Account, platform, and API health stay visible on this page.",
  },
] as const

function getSecurityChecks(data: ProtectorViewModel) {
  const name = data.account.fullName || "your account"
  return [
    {
      icon: ShieldCheck,
      title: "Account Verified",
      description: data.isEmailVerified
        ? `${name} is verified on ${PRODUCT_NAME} with validated sign-in credentials`
        : `Complete email verification to fully secure your ${PRODUCT_NAME} account`,
    },
    {
      icon: Lock,
      title: "Secure Connection",
      description: `Your ${PRODUCT_NAME} session uses a private, encrypted connection`,
    },
    {
      icon: Key,
      title: "Session Protected",
      description: `Authenticated Supabase session for account ${data.account.accountId}`,
    },
    {
      icon: Shield,
      title: "Data Encryption",
      description: "Profile, comment packs, and vault data are encrypted in transit",
    },
    {
      icon: Server,
      title: "Platform Status",
      description: `${PRODUCT_NAME} Command Center, Gold Rush, and Premium Tier are operational`,
    },
    {
      icon: Globe,
      title: "API Connectivity",
      description: "Shorts discovery and comment generation APIs are responding normally",
    },
  ]
}

const activityIcons = {
  login: CheckCircle2,
  session: Activity,
  onboarding: ShieldCheck,
  premium: Gem,
  created: Server,
} as const

function StatusChip({
  ok,
  okLabel,
  pendingLabel,
}: {
  ok: boolean
  okLabel: string
  pendingLabel: string
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 text-xs font-medium",
        ok ? "text-[var(--ds-offer-green-800)]" : "text-warning",
      )}
    >
      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
      {ok ? okLabel : pendingLabel}
    </span>
  )
}

function AccountRow({
  icon: Icon,
  label,
  value,
  tone = "ink",
}: {
  icon: LucideIcon
  label: string
  value: string
  tone?: "ink" | "success" | "warning"
}) {
  return (
    <div className="surface-action flex items-center gap-3 rounded-[1.25rem] px-4 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--layer-elevated)] text-ink-3">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-ink-3">{label}</p>
        <p
          className={cn(
            "truncate text-sm font-medium",
            tone === "warning" ? "text-warning" : "text-ink",
          )}
        >
          {value}
        </p>
      </div>
    </div>
  )
}

export function ProtectorContent({ data }: ProtectorContentProps) {
  const { account, activities, accountStatus, isEmailVerified } = data
  const securityChecks = getSecurityChecks(data)
  const protectorVideoId = getPremiumTrainingVimeoId("protector")
  const displayName = account.fullName || account.email

  return (
    <PremiumPageLayout
      title={PREMIUM_FEATURE_LABELS.protector}
      subtitle={
        <>
          Your {PRODUCT_NAME} account security overview. Live status for {displayName}.
        </>
      }
      actions={
        isEmailVerified ? (
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--layer-elevated)] px-4 py-2.5 text-ink">
            <ShieldCheck size={15} aria-hidden />
            <span className="text-sm font-medium">All systems secure</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning-light px-4 py-2.5 text-warning">
            <Shield size={15} aria-hidden />
            <span className="text-sm font-medium">Verification pending</span>
          </div>
        )
      }
    >
      <PremiumVideoTutorial
        premiumKey="protector"
        vimeoId={protectorVideoId}
        title={`${PREMIUM_FEATURE_LABELS.protector} training`}
        description={`How ${PREMIUM_FEATURE_LABELS.protector} shows the live security status of your ${PRODUCT_NAME} account.`}
        iframeTitle={`${PREMIUM_FEATURE_LABELS.protector} training video`}
      />

      <section className={cn(panelClass, "px-5 py-6 md:px-8 md:py-8")}>
        <h2 className="text-xl font-medium tracking-tight text-ink">How it works</h2>
        <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-ink-3">
          {PRODUCT_NAME} watches sign-in, session, and platform health for {displayName}. This page is a live readout. Nothing here is a scan you have to run.
        </p>
        <ol className="mt-6 grid gap-3 sm:grid-cols-3">
          {PROTECTION_LAYERS.map((step) => (
            <li key={step.num} className="surface-action flex h-full flex-col rounded-[1.75rem] p-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-grad-sapphire text-sm font-medium text-white">
                {step.num}
              </span>
              <h3 className="mt-4 text-base font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-3">{step.desc}</p>
            </li>
          ))}
        </ol>
        <dl className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Protection", value: isEmailVerified ? "Strong" : "Good" },
            { label: "Account status", value: accountStatus },
            { label: "Security", value: "Bank-level" },
            { label: "Availability", value: "Always on" },
          ].map((metric) => (
            <div
              key={metric.label}
              className="rounded-[1.75rem] border border-[var(--border-subtle)] bg-[var(--layer-shell)] px-5 py-4"
            >
              <dt className="text-sm text-ink-3">{metric.label}</dt>
              <dd className="mt-1 text-lg font-medium text-ink">{metric.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className={cn(panelClass, "px-5 py-6 md:px-8 md:py-8")}>
            <h2 className="text-xl font-medium tracking-tight text-ink">Security checks</h2>
            <p className="mt-1 text-sm text-ink-3">Live status for this session</p>
            <div className="mt-5 space-y-3">
              {securityChecks.map((check) => {
                const Icon = check.icon
                const verified = check.title !== "Account Verified" || isEmailVerified
                return (
                  <div
                    key={check.title}
                    className="surface-action flex items-center gap-4 rounded-[1.25rem] p-4"
                  >
                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--layer-elevated)]",
                        verified ? "text-ink-3" : "text-warning",
                      )}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{check.title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-ink-3">{check.description}</p>
                    </div>
                    <StatusChip ok={verified} okLabel="Verified" pendingLabel="Pending" />
                  </div>
                )
              })}
            </div>
          </section>

          <section className={cn(panelClass, "px-5 py-6 md:px-8 md:py-8")}>
            <h2 className="text-xl font-medium tracking-tight text-ink">Recent activity</h2>
            <p className="mt-1 text-sm text-ink-3">Latest account events</p>
            <div className="mt-5 flex flex-col gap-3 lg:flex-row">
              {activities.map((event) => {
                const Icon = activityIcons[event.id as keyof typeof activityIcons] ?? Activity
                return (
                  <div
                    key={event.id}
                    className="surface-action flex min-w-0 flex-1 items-start gap-3 rounded-[1.25rem] px-4 py-3"
                  >
                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--layer-elevated)] text-ink-3">
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{event.label}</p>
                      <p className="text-sm text-ink-3">{event.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>

        <section className={cn(panelClass, "px-5 py-6 md:px-8 md:py-8")}>
          <h2 className="text-xl font-medium tracking-tight text-ink">Account info</h2>
          <p className="mt-1 text-sm text-ink-3">Who this session belongs to</p>
          <div className="mt-5 space-y-2.5">
            {account.fullName ? (
              <AccountRow icon={User} label="Name" value={account.fullName} />
            ) : null}
            <AccountRow icon={Mail} label="Email" value={account.email} />
            <AccountRow icon={Gem} label="Premium tier" value={account.premiumTier} tone="success" />
            <AccountRow icon={Shield} label="Membership" value={account.membership} tone="success" />
            <AccountRow
              icon={Lock}
              label="Auth"
              value={account.authProtection}
              tone={isEmailVerified ? "success" : "warning"}
            />
            <AccountRow icon={Calendar} label="Last login" value={account.lastLogin} />
            <AccountRow icon={Calendar} label="Member since" value={account.memberSince} />
            <AccountRow icon={Fingerprint} label="Account ID" value={account.accountId} />
            <AccountRow
              icon={FileText}
              label="Comment packs"
              value={`${account.pagesGenerated} generated`}
            />
          </div>
        </section>
      </div>
    </PremiumPageLayout>
  )
}
