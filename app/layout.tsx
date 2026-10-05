import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { brand } from "@/config/brand.config"
import { display, sans } from "@/lib/fonts"
import { AppProviders } from "@/components/layout/AppProviders"
import "./globals.css"

export const viewport: Viewport = {
  themeColor: brand.colors.page,
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export const metadata: Metadata = {
  title: brand.metadata.title,
  description: brand.metadata.description,
  generator: "v0.app",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: brand.productName,
  },
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${display.variable}`}
      style={{ colorScheme: "dark" }}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var c=localStorage.getItem("rh_sidebar_collapsed")==="1";document.documentElement.dataset.sidebar=c?"collapsed":"expanded";document.documentElement.style.setProperty("--sidebar-w",c?"84px":"280px");}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased selection:bg-primary selection:text-primary-foreground">
        <AppProviders>{children}</AppProviders>
        <Analytics />
      </body>
    </html>
  )
}
