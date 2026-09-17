"use client"

import { useCallback, useEffect } from "react"
import { SpecialistWelcomePopup } from "@/components/ui/specialist-welcome-popup"

/**
 * Public iframe embed for the Start-Up Specialist popup.
 *
 * Usage on any external website:
 *   <iframe src="https://rhmemberarea.com/embed/specialist-popup" ...>
 *
 * Opens immediately (no geo/hours gate). Posts
 * `{ type: "rh-specialist-popup", open: boolean }` to the parent window
 * so the host page can show/hide the iframe. See EMBED.md for the snippet.
 */
export default function SpecialistPopupEmbedPage() {
  useEffect(() => {
    // Keep the iframe transparent so only the popup is visible on the host page.
    document.documentElement.style.background = "transparent"
    document.body.style.background = "transparent"
  }, [])

  const notifyParent = useCallback((open: boolean) => {
    try {
      window.parent?.postMessage({ type: "rh-specialist-popup", open }, "*")
    } catch {
      // host page may block messaging; popup still works standalone
    }
  }, [])

  return <SpecialistWelcomePopup forceOpen onOpenChange={notifyParent} />
}
