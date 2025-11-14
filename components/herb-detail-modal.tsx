"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, X } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface HerbDetailModalProps {
  herb: {
    name: string
    benefit: string
    image: string
    description: string
    benefits: string[]
    usage: string[]
    wikipediaUrl: string
  } | null
  isOpen: boolean
  onClose: () => void
}

export default function HerbDetailModal({ herb, isOpen, onClose }: HerbDetailModalProps) {
  const { t } = useLanguage()

  if (!herb) return null

  const handleWikipediaRedirect = () => {
    window.open(herb.wikipediaUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold text-emerald-800 flex items-center gap-2">🌿 {herb.name}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Herb Image */}
          <div className="aspect-video w-full overflow-hidden rounded-lg">
            <img src={herb.image || "/placeholder.svg"} alt={herb.name} className="w-full h-full object-cover" />
          </div>

          {/* Primary Benefit Badge */}
          <Badge className="bg-emerald-100 text-emerald-800 text-sm px-3 py-1">{herb.benefit}</Badge>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📖 {t("description")}</h3>
            <p className="text-gray-600 leading-relaxed">{herb.description}</p>
          </div>

          {/* Benefits */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">💚 {t("healthBenefits")}</h3>
            <ul className="space-y-2">
              {herb.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-emerald-500 mt-1">✓</span>
                  <span className="text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Usage Instructions */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">🥄 {t("howToUse")}</h3>
            <ul className="space-y-2">
              {herb.usage.map((instruction, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-500 font-bold mt-1">{index + 1}.</span>
                  <span className="text-gray-600">{instruction}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Wikipedia Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button
              onClick={handleWikipediaRedirect}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {t("knowMore")} - Wikipedia
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
