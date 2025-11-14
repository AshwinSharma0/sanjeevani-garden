"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, Loader2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface SymptomFilterProps {
  onPlantsFound?: (plants: any[]) => void
}

export default function SymptomFilter({ onPlantsFound }: SymptomFilterProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isSearching, setIsSearching] = useState(false)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const { t } = useLanguage()

  const commonSymptoms = [
    "cough", "cold", "fever", "headache", "stomach ache", "skin problems",
    "stress", "anxiety", "insomnia", "digestion", "joint pain", "acne",
    "hair loss", "diabetes", "hypertension", "respiratory", "inflammation"
  ]

  const searchPlants = async (symptoms: string | string[]) => {
    const list = Array.isArray(symptoms) ? symptoms : [symptoms]
    const clean = list.map((s) => s.trim()).filter(Boolean)
    if (!clean.length) return

    setIsSearching(true)
    try {
      const params = new URLSearchParams({ symptoms: clean.join(",") })
      const response = await fetch(`/api/health/symptoms?${params.toString()}`)
      if (response.ok) {
        const results = await response.json()
        setSearchResults(results)
        onPlantsFound?.(results)
      }
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSymptomClick = (symptom: string) => {
    setSelectedSymptoms((prev) => {
      const exists = prev.includes(symptom)
      const next = exists ? prev.filter((s) => s !== symptom) : [...prev, symptom]
      setSearchTerm(next.join(", "))
      searchPlants(next)
      return next
    })
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const parsed = searchTerm.split(/,|\|/g).map((s) => s.trim()).filter(Boolean)
      searchPlants(parsed.length ? parsed : searchTerm)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Filter className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-blue-800">🔍 {t("symptomFilter")}</CardTitle>
        <CardDescription>{t("symptomFilterDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Input */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={t("enterSymptom")}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-black placeholder:text-gray-500"
            />
          </div>
          <Button
            onClick={handleSearch}
            disabled={isSearching || !searchTerm.trim()}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white"
          >
            {isSearching ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              t("search")
            )}
          </Button>
        </div>

        {/* Common Symptoms */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">{t("commonSymptoms")}</h3>
          <div className="flex flex-wrap gap-2">
            {commonSymptoms.map((symptom) => (
              <Badge
                key={symptom}
                variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                className={`cursor-pointer transition-colors ${
                  selectedSymptoms.includes(symptom)
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-black border border-gray-300 hover:bg-blue-50 hover:text-blue-700"
                }`}
                onClick={() => handleSymptomClick(symptom)}
              >
                {symptom}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {isSearching && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">{t("searching")}</span>
          </div>
        )}

        {searchResults.length > 0 && !isSearching && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              {t("foundPlants")} ({searchResults.length})
            </h3>
            <div className="grid gap-3">
              {searchResults.map((plant, index) => (
                <Card key={index} className="p-4 border-l-4 border-l-green-500">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h4 className="font-semibold text-green-800 mb-1">
                        🌿 {plant.commonName ? plant.commonName : plant.plantName} {plant.scientificName ? `(${plant.scientificName})` : ""}
                      </h4>
                      {plant.description ? (
                        <p className="text-sm text-gray-600 mb-2">{plant.description}</p>
                      ) : plant.usage ? (
                        <p className="text-sm text-gray-600 mb-2">{plant.usage}</p>
                      ) : null}
                      {Array.isArray(plant.symptoms) && plant.symptoms.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {plant.symptoms.slice(0, 6).map((s: string, i: number) => (
                            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              {s}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {plant.imageUrl && (
                      <img src={plant.imageUrl} alt={plant.commonName || plant.plantName} className="w-16 h-16 object-cover rounded ml-3" />
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {searchResults.length === 0 && !isSearching && selectedSymptoms.length > 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>{t("noPlantsFound")}</p>
            <p className="text-sm mt-1">{t("tryDifferentSymptom")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

