"use client";

import { useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Clock3, FastForward, Phone, TrendingUp, Vault, Wallet, X } from "lucide-react";
import { PRODUCT_NAME } from "@/lib/brand";
import { isDevAuthBypassEnabled } from "@/lib/auth/dev-bypass";
import { createClient } from "@/lib/supabase/client";
import { specialist } from "@/config/specialist.config";
import {
    clearSpecialistPopupFromSignup,
    readSpecialistPopupDismissed,
    readSpecialistPopupFromSignup,
    readSpecialistPopupShowFlag,
    suppressSpecialistPopup,
    writeSpecialistPopupDismissed,
    writeSpecialistPopupShowFlag,
} from "@/lib/specialist-popup-session";

const COUNTDOWN_MS = 10 * 60 * 1000;

const BENEFITS = [
    { icon: FastForward, text: "Skip all the learning curve and all the wait" },
    { icon: Clock3, text: "Get results from day zero" },
    { icon: TrendingUp, text: "Scale your results to $1,000 - $2,000 per day" },
] as const;

type TrackEvent = "cta_call_click" | "popup_open";

/** Best-effort analytics; never throws / never blocks navigation. */
function trackPopupEvent(event: TrackEvent) {
    try {
        const payload = JSON.stringify({ event });
        // Prefer keepalive fetch: application/json sendBeacon is unreliable in
        // some browsers when a tel: navigation immediately unloads the page.
        const sent = navigator.sendBeacon?.(
            "/api/track/specialist-popup",
            new Blob([payload], { type: "text/plain" })
        );
        if (!sent) {
            fetch("/api/track/specialist-popup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: payload,
                keepalive: true,
            }).catch(() => {});
        }
    } catch {
        // ignore
    }
}

function subscribeNoop() {
    return () => {};
}

/** Client-only gate — avoids SSR/portal hydration mismatch. */
function useIsClient() {
    return useSyncExternalStore(subscribeNoop, () => true, () => false);
}

type SpecialistWelcomePopupProps = {
    /** Preview/embed — open immediately, skip auth-event gating. */
    forceOpen?: boolean;
    /** Notified whenever the popup becomes visible/hidden (used by the embed). */
    onOpenChange?: (open: boolean) => void;
};

export function SpecialistWelcomePopup({
    forceOpen = false,
    onOpenChange,
}: SpecialistWelcomePopupProps) {
    const titleId = useId();
    const isClient = useIsClient();
    const reduceMotion = useReducedMotion();
    const [authOpen, setAuthOpen] = useState(false);
    const [dismissed, setDismissed] = useState(false);
    const [remainingMs, setRemainingMs] = useState(COUNTDOWN_MS);
    const trackedOpen = useRef(false);
    const lastUserId = useRef<string | null>(null);
    const open = !dismissed && (forceOpen || authOpen);

    useEffect(() => {
        onOpenChange?.(open);
    }, [open, onOpenChange]);

    const reveal = useCallback((opts?: { resetDismiss?: boolean; persistShow?: boolean }) => {
        if (opts?.resetDismiss) {
            writeSpecialistPopupDismissed(false);
            setDismissed(false);
        }
        if (opts?.persistShow) writeSpecialistPopupShowFlag(true);
        setRemainingMs(COUNTDOWN_MS);
        setAuthOpen(true);
        if (!trackedOpen.current) {
            trackedOpen.current = true;
            trackPopupEvent("popup_open");
        }
    }, []);

    useEffect(() => {
        if (!isClient) return;
        if (forceOpen) {
            reveal();
            return;
        }

        const onAuthRoute = window.location.pathname.startsWith("/auth/");
        const fromSignup = readSpecialistPopupFromSignup();
        // Local auth-bypass preview only (no real login event).
        if (
            isDevAuthBypassEnabled(window.location.hostname) &&
            !onAuthRoute &&
            !fromSignup &&
            !readSpecialistPopupDismissed()
        ) {
            reveal();
        } else if (
            !fromSignup &&
            readSpecialistPopupShowFlag() &&
            !readSpecialistPopupDismissed()
        ) {
            // Sign-in set this flag; keep showing after route change into the app.
            reveal();
        }

        let cancelled = false;
        let unsubscribe: (() => void) | undefined;

        try {
            const supabase = createClient();
            const {
                data: { subscription },
            } = supabase.auth.onAuthStateChange((event, session) => {
                if (cancelled) return;

                if (event === "SIGNED_OUT") {
                    lastUserId.current = null;
                    trackedOpen.current = false;
                    setAuthOpen(false);
                    setDismissed(false);
                    writeSpecialistPopupDismissed(false);
                    writeSpecialistPopupShowFlag(false);
                    clearSpecialistPopupFromSignup();
                    return;
                }

                if (event === "INITIAL_SESSION") {
                    lastUserId.current = session?.user?.id ?? null;
                    // Do not open on refresh — only after sign-in (show flag or SIGNED_IN).
                    return;
                }

                // Password sign-in emits SIGNED_IN. Sign-up does too — skip that path.
                if (event === "SIGNED_IN") {
                    const id = session?.user?.id ?? null;
                    if (id && id !== lastUserId.current) {
                        lastUserId.current = id;
                        const path = window.location.pathname;
                        const isSignUpFlow =
                            readSpecialistPopupFromSignup() ||
                            path === "/auth/sign-up" ||
                            path.startsWith("/auth/sign-up/") ||
                            path === "/onboarding" ||
                            path.startsWith("/onboarding/");
                        if (isSignUpFlow) {
                            suppressSpecialistPopup();
                            setAuthOpen(false);
                            return;
                        }
                        trackedOpen.current = false;
                        reveal({ resetDismiss: true, persistShow: true });
                        return;
                    }
                    lastUserId.current = id;
                }
            });
            unsubscribe = () => subscription.unsubscribe();
        } catch {
            // Missing Supabase env — bypass path above still covers local chrome.
        }

        return () => {
            cancelled = true;
            unsubscribe?.();
        };
    }, [forceOpen, isClient, reveal]);

    const dismiss = useCallback(() => {
        setDismissed(true);
        setAuthOpen(false);
        trackedOpen.current = false;
        if (forceOpen) return;
        writeSpecialistPopupDismissed(true);
        writeSpecialistPopupShowFlag(false);
    }, [forceOpen]);

    // Fire-and-forget tracking; must never delay or block the tel: call.
    const trackCallClick = useCallback(() => {
        trackPopupEvent("cta_call_click");
    }, []);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") dismiss();
        },
        [dismiss]
    );

    // Robust scroll lock for iOS Safari (overflow:hidden alone is not enough).
    useEffect(() => {
        if (!open) return;

        const scrollY = window.scrollY;
        const { style } = document.body;
        const prev = {
            overflow: style.overflow,
            position: style.position,
            top: style.top,
            left: style.left,
            right: style.right,
            width: style.width,
        };

        style.overflow = "hidden";
        style.position = "fixed";
        style.top = `-${scrollY}px`;
        style.left = "0";
        style.right = "0";
        style.width = "100%";

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            style.overflow = prev.overflow;
            style.position = prev.position;
            style.top = prev.top;
            style.left = prev.left;
            style.right = prev.right;
            style.width = prev.width;
            window.scrollTo(0, scrollY);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, handleKeyDown]);

    useEffect(() => {
        if (!open) return;

        const startedAt = Date.now();
        const tick = () => {
            setRemainingMs(Math.max(0, COUNTDOWN_MS - (Date.now() - startedAt)));
        };

        tick();
        const id = window.setInterval(tick, 250);
        return () => window.clearInterval(id);
    }, [open]);

    if (!isClient) return null;

    const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000));
    const mm = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const ss = String(totalSeconds % 60).padStart(2, "0");
    const progressPct = (remainingMs / COUNTDOWN_MS) * 100;

    return createPortal(
        <AnimatePresence>
            {open ? (
                <div className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center sm:p-4">
                    <motion.button
                        type="button"
                        aria-label="Close welcome offer"
                        className="absolute inset-0 bg-black/30"
                        onClick={dismiss}
                        initial={reduceMotion ? false : { opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={reduceMotion ? undefined : { opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    />

                    <motion.div
                        key="specialist-welcome-dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby={titleId}
                        className="relative z-10 w-full max-w-[24.5rem] sm:max-w-[52rem] max-sm:rounded-t-3xl sm:rounded-3xl bg-card shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
                        onClick={(e) => e.stopPropagation()}
                        initial={
                            reduceMotion ? false : { opacity: 0, y: 36, scale: 0.97 }
                        }
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={
                            reduceMotion ? undefined : { opacity: 0, y: 24, scale: 0.97 }
                        }
                        transition={{ type: "spring", stiffness: 340, damping: 30 }}
                    >
                        <div className="relative flex max-h-[min(96dvh,46rem)] flex-col overflow-hidden max-sm:rounded-t-3xl sm:rounded-3xl">
                            {/* Soft brand wash behind the hero */}
                            <div
                                aria-hidden
                                className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-primary/10 to-transparent"
                            />

                            {/* Header: icon tile + close (headline carries the brand) */}
                            <div className="relative z-10 flex shrink-0 items-center justify-between px-4 pt-[max(0.75rem,env(safe-area-inset-top))] sm:px-5 sm:pt-4">
                                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_12px_rgba(13,148,136,0.3)]">
                                    <Wallet size={16} strokeWidth={2.4} />
                                </span>
                                <button
                                    type="button"
                                    onClick={dismiss}
                                    aria-label="Close"
                                    className="flex h-10 w-10 items-center justify-center rounded-full text-ink-5 transition-colors hover:bg-primary-light hover:text-ink active:bg-primary-light touch-manipulation"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Content — vertical on phones, two columns on desktop */}
                            <div
                                className="relative z-10 flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 pb-2 pt-1 sm:grid sm:grid-cols-[1fr_1.05fr] sm:items-center sm:gap-x-10 sm:px-10 sm:pb-5 sm:pt-2"
                                style={{ WebkitOverflowScrolling: "touch" }}
                            >
                                {/* Left column: brand + message */}
                                <div>
                                    <p className="text-center text-[12px] font-bold uppercase tracking-[0.3em] text-ink-4 sm:text-left sm:text-[13px]">
                                        Welcome To
                                    </p>
                                    <h2
                                        id={titleId}
                                        className="brand-font mt-1 text-center text-[1.9rem] font-black uppercase leading-none tracking-tight text-ink sm:text-left sm:text-[2.6rem]"
                                    >
                                        <span className="text-primary">{PRODUCT_NAME}</span>
                                    </h2>

                                    <div className="mx-auto mt-3 max-w-[22rem] space-y-0.5 text-center text-[14px] leading-[1.5] text-ink-4 sm:mx-0 sm:mt-4 sm:max-w-none sm:space-y-1 sm:text-left sm:text-[15.5px] sm:leading-[1.6]">
                                        <p>
                                            As part of our commitment to{" "}
                                            <span className="font-bold text-ink">
                                                YOUR
                                            </span>{" "}
                                            success…
                                        </p>
                                        <p>
                                            …And to fast-track your results and skip
                                            the learning curve.
                                        </p>
                                    </div>
                                    <p className="mx-auto mt-2 max-w-[20rem] text-center text-[16px] font-bold leading-snug text-ink sm:mx-0 sm:mt-3 sm:max-w-none sm:text-left sm:text-[19px]">
                                        You have been assigned a dedicated Start-Up
                                        Specialist.
                                    </p>
                                </div>

                                {/* Right column: benefits + vault */}
                                <div className="sm:border-l sm:border-[var(--ds-line-sapphire)] sm:pl-10">
                                    <div className="mx-auto mt-3.5 max-w-[22rem] sm:mx-0 sm:mt-0 sm:max-w-none">
                                        <p className="text-[11.5px] font-bold uppercase tracking-[0.18em] text-ink-4 sm:text-[12px]">
                                            Who will help you
                                        </p>
                                        <ul className="mt-2 space-y-1.5 sm:mt-3 sm:space-y-2.5">
                                            {BENEFITS.map(({ icon: Icon, text }) => (
                                                <li
                                                    key={text}
                                                    className="flex items-center gap-3"
                                                >
                                                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--ds-line-sapphire)] bg-sapphire-100 text-sapphire-700 sm:h-10 sm:w-10 sm:rounded-xl">
                                                        <Icon
                                                            size={16}
                                                            strokeWidth={2.2}
                                                            className="sm:hidden"
                                                        />
                                                        <Icon
                                                            size={19}
                                                            strokeWidth={2.2}
                                                            className="hidden sm:block"
                                                        />
                                                    </span>
                                                    <span className="text-[14.5px] font-semibold leading-snug text-ink sm:text-[15.5px]">
                                                        {text}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="mx-auto mt-2.5 flex max-w-[22rem] items-center gap-3 rounded-2xl border border-[var(--ds-line-sapphire)] bg-primary-light px-3.5 py-2.5 sm:mx-0 sm:mt-4 sm:max-w-none sm:px-4 sm:py-3.5">
                                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[var(--ds-line-sapphire)] bg-card text-sapphire-700 shadow-sm sm:h-12 sm:w-12">
                                            <Vault
                                                size={22}
                                                strokeWidth={1.8}
                                                className="sm:hidden"
                                            />
                                            <Vault
                                                size={26}
                                                strokeWidth={1.8}
                                                className="hidden sm:block"
                                            />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[10.5px] font-black uppercase tracking-[0.18em] text-primary sm:text-[11px]">
                                                Plus
                                            </p>
                                            <p className="mt-0.5 text-[14px] font-bold leading-snug text-ink sm:text-[15px]">
                                                He will unlock our secret vault
                                                bonuses for you for FREE
                                            </p>
                                            <p className="mt-0.5 text-[13px] text-ink-4 sm:text-[14px]">
                                                Worth over{" "}
                                                <span className="font-bold text-ink tabular-nums">
                                                    $11,385.32
                                                </span>{" "}
                                                in retail value
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action zone: horizontal bar on desktop */}
                            <div className="relative z-10 shrink-0 border-t border-[var(--ds-line-sapphire)] bg-primary-light px-6 pt-3 pb-[max(1.15rem,env(safe-area-inset-bottom))] sm:px-10 sm:pt-4 sm:pb-5">
                                <div className="sm:flex sm:items-center sm:gap-8">
                                    {/* Urgency strip — danger countdown */}
                                    <div className="mx-auto max-w-[22rem] sm:mx-0 sm:max-w-none sm:flex-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-[11.5px] font-bold uppercase tracking-[0.16em] text-ink-4 sm:text-[12px]">
                                                Your code expires in
                                            </span>
                                            <span className="brand-font rounded-lg bg-[var(--danger-light)] px-2 py-1 text-[1.25rem] font-black leading-none tabular-nums text-[var(--danger)] sm:text-[1.5rem]">
                                                {mm}:{ss}
                                            </span>
                                        </div>
                                        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--danger-light)]">
                                            <div
                                                className="h-full rounded-full bg-[var(--danger)] transition-[width] duration-300 ease-linear"
                                                style={{ width: `${progressPct}%` }}
                                            />
                                        </div>
                                    </div>

                                    <a
                                        href={specialist.phoneTel}
                                        onClick={trackCallClick}
                                        className="group relative mt-3 flex w-full min-h-[64px] items-center justify-center gap-3 overflow-hidden rounded-2xl bg-grad-sapphire px-5 text-white shadow-sapphire transition-all hover:bg-grad-sapphire-hover hover:shadow-sapphire active:scale-[0.985] touch-manipulation select-none motion-safe:animate-[cta-pulse-green_2.2s_ease-in-out_infinite] sm:mt-0 sm:w-auto sm:min-w-[19rem] sm:flex-1 sm:min-h-[72px]"
                                    >
                                        <span
                                            aria-hidden
                                            className="absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-card/20 blur-md motion-safe:animate-[sheen_3s_ease-in-out_infinite]"
                                        />
                                        <Phone size={22} strokeWidth={2.4} className="shrink-0 text-white" />
                                        <span className="flex flex-col items-start leading-none">
                                            <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/90 sm:text-[10.5px]">
                                                Call now · tap to call
                                            </span>
                                            <span className="mt-1 font-sans text-[1.85rem] font-black tabular-nums tracking-tight text-white sm:text-[2.15rem]">
                                                {specialist.phoneDisplay}
                                            </span>
                                        </span>
                                    </a>
                                </div>

                                <p className="mx-auto mt-2.5 max-w-[22rem] text-center text-[12px] leading-[1.55] text-ink-4 sm:mt-3 sm:max-w-none sm:text-[12.5px]">
                                    Call immediately to finalize your setup and claim
                                    your Secret Vault Code. (Your temporary code
                                    expires when this page closes. Call within the
                                    next 10 minutes to secure your bonuses!)
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>,
        document.body
    );
}
