import { Fraunces, Inter } from "next/font/google"

/** Wifi System UI stack — Inter for interface, Fraunces for display headlines. */
export const sans = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
})

export const display = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
})
