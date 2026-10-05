import { Brain } from "lucide-react"

export const TRAINING_WORKFLOW_STEPS = [
  {
    step: 1,
    title: "Gold Rush",
    page: "/create",
    description: "Add your affiliate link, pick a video, and generate a ready-to-post comment pack.",
  },
  {
    step: 2,
    title: "My Vault",
    page: "/pages",
    description: "Open a saved pack, copy a comment, and paste it on the YouTube Short.",
  },
  {
    step: 3,
    title: "Your links",
    page: "/share",
    description: "Store DigiStore and ClickBank URLs once so Gold Rush can reuse them.",
  },
] as const

export const TRAINING_QUICK_START_CHECKLIST = [
  "Watch the three Start Here videos on your Dashboard",
  "Run Gold Rush and generate your first comment pack",
  "Copy a comment from My Vault and post it on the Short",
  "Save your best affiliate URLs in Your Links for reuse",
] as const

export const TRAINING_PRO_TIPS = [
  {
    title: "Launch before you optimize",
    text: "Your first pack does not need to be perfect. Generate it, post one comment, and learn from what happens.",
  },
  {
    title: "One hub for comments",
    text: "After Gold Rush, always come back to My Vault to copy comments and reopen the video.",
  },
  {
    title: "Name your links clearly",
    text: 'In Your Links use labels like "Keto supplement, Digistore" instead of "link2" so campaigns stay organized.',
  },
] as const

export const TRAINING_CTA = {
  headline: "Ready to make your first comment pack?",
  subcopy:
    "The Academy gives you the click-by-click detail. Gold Rush is where you put it into action. Generate a pack and post tonight.",
  buttonLabel: "Get Started Now with Gold Rush",
  href: "/create",
  icon: Brain,
} as const
