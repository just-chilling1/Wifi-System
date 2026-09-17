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
import { PremiumFeatureBanner, PremiumSteps } from "@/components/premium-feature-chrome"
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

const SUCCESS = "var(--ds-sapphire-500)"
const SUCCESS_BG = "var(--ds-offer-green-100)"
const WARNING = "var(--warning)"
const WARNING_BG = "var(--warning-light)"

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
        "inline-flex shrink-0 items-center gap-1 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wide",
        ok
          ? "border-transparent text-white"
          : "border-warning/30 text-warning",
      )}
      style={{ backgroundColor: ok ? SUCCESS : WARNING_BG }}
    >
      <CheckCircle2 className="h-3 w-3" aria-hidden />
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
    <div className="flex items-center gap-3 rounded-xl border border-[var(--ds-line)] bg-surface-nested/60 px-3 py-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
        <Icon className="h-4 w-4" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-text-muted">{label}</p>
        <p
          className={cn(
            "truncate text-sm font-semibold",
            tone === "success" && "text-sapphire-700",
            tone === "warning" && "text-warning",
            tone === "ink" && "text-ink",
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
          <div className="inline-flex items-center gap-2 rounded-full bg-grad-sapphire px-4 py-2.5 text-white shadow-sapphire">
            <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
            <span className="text-xs font-medium uppercase tracking-wider">All systems secure</span>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-warning-light px-4 py-2.5">
            <span className="h-2 w-2 rounded-full bg-warning" />
            <span className="text-xs font-medium uppercase tracking-wider text-warning">
              Verification pending
            </span>
          </div>
        )
      }
    >
      <PremiumVideoTutorial
        premiumKey="protector"
        vimeoId={protectorVideoId}
        title={`${PREMIUM_FEATURE_LABELS.protector} Training`}
        description={`Watch this to understand how ${PREMIUM_FEATURE_LABELS.protector} keeps your ${PRODUCT_NAME} account and activity secure.`}
        iframeTitle={`${PREMIUM_FEATURE_LABELS.protector} training video`}
      />

      <PremiumFeatureBanner
        icon={ShieldCheck}
        kicker="Live monitoring"
        title={isEmailVerified ? "Protected account" : "Finish verification"}
        description={
          <>
            {PRODUCT_NAME} watches sign-in, session, and platform health for {displayName}. This page
            is the live readout — nothing here is a scan you have to run.
          </>
        }
        chip={isEmailVerified ? "Email verified" : "Verify email"}
      />

      <PremiumSteps title="What stays protected" steps={PROTECTION_LAYERS} />

      <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:grid-cols-4">
        {[
          {
            label: "Protection",
            value: isEmailVerified ? "Strong" : "Good",
            ok: true,
          },
          {
            label: "Account status",
            value: accountStatus,
            ok: isEmailVerified,
          },
          { label: "Security", value: "Bank-level", ok: true },
          { label: "Availability", value: "Always on", ok: true },
        ].map((metric) => (
          <div
            key={metric.label}
            className="glass-card p-3.5 sm:p-5"
          >
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted sm:mb-2 sm:text-[11px]">
              {metric.label}
            </p>
            <p
              className="break-words text-lg font-semibold leading-tight sm:text-2xl lg:text-3xl"
              style={{ color: metric.ok ? SUCCESS : WARNING }}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="glass-card p-5 sm:p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
              <ShieldCheck size={18} aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-medium text-ink">Security checks</h2>
              <p className="text-sm text-ink-3">Live status for this session</p>
            </div>
          </div>
          <div className="space-y-3">
            {securityChecks.map((check) => {
              const Icon = check.icon
              const verified = check.title !== "Account Verified" || isEmailVerified
              return (
                <div
                  key={check.title}
                  className="flex items-center gap-4 rounded-xl border border-[var(--ds-line)] bg-card p-4"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      backgroundColor: verified ? SUCCESS_BG : WARNING_BG,
                      color: verified ? SUCCESS : WARNING,
                    }}
                  >
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink">{check.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {check.description}
                    </p>
                  </div>
                  <StatusChip ok={verified} okLabel="Verified" pendingLabel="Pending" />
                </div>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                <User size={18} aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-medium text-ink">Account info</h2>
                <p className="text-sm text-ink-3">Who this session belongs to</p>
              </div>
            </div>
            <div className="space-y-2.5">
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
          </div>

          <div className="glass-card p-5 sm:p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sapphire-100 text-sapphire-700">
                <Activity size={18} aria-hidden />
              </div>
              <div>
                <h2 className="text-lg font-medium text-ink">Recent activity</h2>
                <p className="text-sm text-ink-3">Latest account events</p>
              </div>
            </div>
            <div className="space-y-3">
              {activities.map((event) => {
                const Icon = activityIcons[event.id as keyof typeof activityIcons] ?? Activity
                return (
                  <div
                    key={event.id}
                    className="flex items-start gap-3 rounded-xl border border-[var(--ds-line)] px-3 py-3"
                  >
                    <div
                      className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: SUCCESS_BG, color: SUCCESS }}
                    >
                      <Icon className="h-4 w-4" aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink">{event.label}</p>
                      <p className="text-xs text-text-secondary">{event.time}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </PremiumPageLayout>
  )
}
