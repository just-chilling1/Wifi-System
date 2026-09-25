"use client"

import { FormEvent, useEffect, useState } from "react"
import { CheckCircle2, KeyRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { isWifiCodeAccepted } from "@/lib/wifi-code"

const STORAGE_KEY = "wificode:wifi-code-verified"

export function WifiCodeEntry() {
  const [value, setValue] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [verified, setVerified] = useState(false)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setVerified(true)
      }
    } catch {
      // Ignore storage failures (private mode, etc.)
    }
    setHydrated(true)
  }, [])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isWifiCodeAccepted(value)) {
      setError(null)
      setVerified(true)
      try {
        window.localStorage.setItem(STORAGE_KEY, "1")
      } catch {
        // Ignore storage failures
      }
      return
    }
    setError("That code doesn’t match. Check the video and try again.")
  }

  if (!hydrated) {
    return (
      <article className="glass-card px-5 py-5 sm:px-6" aria-hidden>
        <div className="h-24 animate-pulse rounded-md bg-surface-nested" />
      </article>
    )
  }

  if (verified) {
    return (
      <article className="glass-card accent-card px-5 py-5 sm:px-6" role="status">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-sapphire-700" strokeWidth={1.75} aria-hidden />
          <div>
            <h3 className="ds-h3">Wifi code unlocked</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground sm:text-[15px]">
              Congratulations, your wifi code is correct. You can now proceed to use the app.
            </p>
          </div>
        </div>
      </article>
    )
  }

  return (
    <article className="glass-card px-5 py-5 sm:px-6">
      <div className="flex items-start gap-3">
        <KeyRound className="mt-0.5 h-5 w-5 shrink-0 text-ink-3" strokeWidth={1.75} aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="ds-h3">Enter your wifi code</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-text-secondary">
            After the welcome video, enter the 12-character code from the training to continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <label htmlFor="wifi-code-input" className="sr-only">
                Wifi code
              </label>
              <Input
                id="wifi-code-input"
                name="wifiCode"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value)
                  if (error) setError(null)
                }}
                placeholder="Enter your 12-letter code"
                autoComplete="off"
                spellCheck={false}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? "wifi-code-error" : undefined}
                className="font-mono tracking-wide"
              />
              {error ? (
                <p id="wifi-code-error" className="mt-2 text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}
            </div>
            <button type="submit" className="btn-primary min-h-[48px] shrink-0 px-6 sm:min-w-[8.5rem]">
              Submit
            </button>
          </form>
        </div>
      </div>
    </article>
  )
}
