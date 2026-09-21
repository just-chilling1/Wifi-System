/** Session flags for the dashboard Start-Up Specialist popup. */
export const SPECIALIST_POPUP_DISMISS_KEY = "rh_specialist_popup_dismissed"
/** Set on sign-in so the popup still opens after navigating into the app. */
export const SPECIALIST_POPUP_SHOW_KEY = "rh_specialist_popup_show"
/** Sign-up emits SIGNED_IN too — this keeps the dashboard popup from opening then. */
export const SPECIALIST_POPUP_FROM_SIGNUP_KEY = "rh_specialist_popup_from_signup"

export function readSpecialistPopupDismissed(): boolean {
  try {
    return sessionStorage.getItem(SPECIALIST_POPUP_DISMISS_KEY) === "1"
  } catch {
    return false
  }
}

export function writeSpecialistPopupDismissed(value: boolean) {
  try {
    if (value) sessionStorage.setItem(SPECIALIST_POPUP_DISMISS_KEY, "1")
    else sessionStorage.removeItem(SPECIALIST_POPUP_DISMISS_KEY)
  } catch {
    // ignore
  }
}

export function readSpecialistPopupShowFlag(): boolean {
  try {
    return sessionStorage.getItem(SPECIALIST_POPUP_SHOW_KEY) === "1"
  } catch {
    return false
  }
}

export function writeSpecialistPopupShowFlag(value: boolean) {
  try {
    if (value) sessionStorage.setItem(SPECIALIST_POPUP_SHOW_KEY, "1")
    else sessionStorage.removeItem(SPECIALIST_POPUP_SHOW_KEY)
  } catch {
    // ignore
  }
}

/** Consultation already happened — don't also open the dashboard popup. */
export function suppressSpecialistPopup() {
  writeSpecialistPopupDismissed(true)
  writeSpecialistPopupShowFlag(false)
}

export function readSpecialistPopupFromSignup(): boolean {
  try {
    return sessionStorage.getItem(SPECIALIST_POPUP_FROM_SIGNUP_KEY) === "1"
  } catch {
    return false
  }
}

/** Call before signUp so SIGNED_IN does not open the returning-member popup. */
export function markSpecialistPopupFromSignup() {
  try {
    sessionStorage.setItem(SPECIALIST_POPUP_FROM_SIGNUP_KEY, "1")
  } catch {
    // ignore
  }
  suppressSpecialistPopup()
}

export function clearSpecialistPopupFromSignup() {
  try {
    sessionStorage.removeItem(SPECIALIST_POPUP_FROM_SIGNUP_KEY)
  } catch {
    // ignore
  }
}
