"use client"

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow"

/**
 * Dev-only visual preview of the post-signup consultation.
 * Middleware blocks /dev/* outside development.
 */
export default function OnboardingDevPreviewPage() {
  return <OnboardingFlow firstName="Alex" />
}
