"use client"

import { Button } from "@/components/ui/button"
import { Languages } from "lucide-react"
import { useLanguage } from "./language-provider"

export default function LanguageToggle() {
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "hi" : "en")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
    >
      <Languages className="h-4 w-4" />
      {language === "en" ? t("switchToHindi") : t("switchToEnglish")}
    </Button>
  )
}
