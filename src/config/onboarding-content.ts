import { brand } from "./brand.config"
import { specialist } from "./specialist.config"

const product = brand.productName
const role = specialist.roleLabel

/**
 * Wifi Code onboarding copy. Product name and specialist role come from config.
 */
export const onboardingContent = {
  productName: product,
  dashboardRoute: "/dashboard",

  initiating: {
    title: "Initiating your account",
    rows: [
      `Creating your ${product} account`,
      "Preparing your tools and training",
      "Reserving your consultation slot",
    ],
    doneLabel: "Account created",
  },

  consultation: {
    eyebrow: "Personal Success Consultation",
    headline: (name: string) =>
      name ? `Congratulations, ${name}. You've qualified.` : "Congratulations. You've qualified.",
    subhead: `Your success consultation with your ${role}`,
    body: `You don't have to figure this out alone. Your ${role} will walk you through ${product}, step by step, and help you find your starting point.`,
    learnTitle: "On this phone call, you'll learn:",
    bullets: [
      "How the online business model works",
      `How to use the tools inside ${product}`,
      "What to focus on first as a beginner",
      "How to turn your goals into an action plan",
    ],
    specialistTitle: `Your ${role}`,
    specialistSubtitle: "Your personal success partner.",
    quote: (name: string) =>
      name ? `Hi ${name}. We'll take it one step at a time.` : "We'll take it one step at a time.",
    callType: "One-to-one phone consultation",
    cta: "Call now & start my consultation",
    timerLabel: "Your call slot will expire in",
    timerExpiredLabel: "Your slot is being held. Call now.",
    footnote: "No preparation needed. Bring your questions.",
    skipLink: "Skip to my account",
    createdLabel: "Account created",
  },

  exit: {
    eyebrow: "Your success consultation",
    title: (name: string) =>
      name ? `${name}, skip your consultation?` : "Skip your consultation?",
    body: `Before you go, let your ${role} walk you through ${product} and help you turn 'Where do I start?' into a clear next step.`,
    listTitle: "On your personal phone call:",
    bullets: [
      "Get a guided tour of the tools",
      "Ask questions about the business model",
      "Plan your first steps with your specialist",
    ],
    note: "No preparation needed. Your specialist will guide the conversation.",
    cta: "Call now & use my consultation",
    skipLink: "Skip consultation & open my account",
  },

  afterCall: "Continue to my account",
} as const
