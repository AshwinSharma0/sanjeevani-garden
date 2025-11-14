import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "next-themes"
import { Suspense } from "react"
import "./globals.css"
import SiteNav from "@/components/site-nav"

const geistSans = GeistSans
const geistMono = GeistMono

export const metadata: Metadata = {
  title: "Sanjeevani Garden — Herbal Wellness & Plant Remedies",
  description: "Discover medicinal plants, filter by symptoms, and consult experts at Sanjeevani Garden.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Sanjeevani Garden',
    description: 'Discover medicinal plants, filter by symptoms, and consult experts.',
    type: 'website',
    url: '/',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Suspense fallback={null}>
          <LanguageProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <SiteNav />
              <div className="pt-16">{children}</div>
            </ThemeProvider>
          </LanguageProvider>
          <Analytics />
        </Suspense>
      </body>
    </html>
  )
}
