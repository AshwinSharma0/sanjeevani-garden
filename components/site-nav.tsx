"use client"

import Link from "next/link"
import { useState } from "react"
import { Leaf, Menu, X } from "lucide-react"
import LanguageToggle from "@/components/language-toggle"

export default function SiteNav() {
  const [open, setOpen] = useState(false)
  const items = [
    { href: "/", label: "Home" },
    { href: "/doctors", label: "Doctors" },
    { href: "/consult", label: "Consult" },
    { href: "/shop", label: "Shop" },
  ]

  return (
    <nav className="fixed top-0 w-full bg-background/95 backdrop-blur-sm border-b border-border z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">Sanjeevani Garden</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {items.map((i) => (
              <Link key={i.href} href={i.href} className="transition-colors text-muted-foreground hover:text-primary font-medium">
                {i.label}
              </Link>
            ))}
            <LanguageToggle />
          </div>

          <div className="md:hidden flex items-center gap-2">
            <LanguageToggle />
            <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden py-4 border-t border-border">
            {items.map((i) => (
              <Link
                key={i.href}
                href={i.href}
                onClick={() => setOpen(false)}
                className="block w-full py-2 text-muted-foreground hover:text-primary transition-colors"
              >
                {i.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}


