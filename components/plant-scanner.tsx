"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Camera, Upload, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface PlantScannerProps {
  onPlantIdentified?: (plantData: any) => void
}

export default function PlantScanner({ onPlantIdentified }: PlantScannerProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { t } = useLanguage()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setError(null)
    setScanResult(null)

    try {
      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/health/plant-scanner', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to scan plant')
      }

      const result = await response.json()
      setScanResult(result)
      onPlantIdentified?.(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Camera className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-green-800">🌿 {t("plantScanner")}</CardTitle>
        <CardDescription>{t("plantScannerDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        
        <Button
          onClick={handleCameraClick}
          disabled={isScanning}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white"
        >
          {isScanning ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t("scanning")}
            </>
          ) : (
            <>
              <Camera className="mr-2 h-4 w-4" />
              {t("scanPlant")}
            </>
          )}
        </Button>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-700 text-sm">{error}</span>
          </div>
        )}

        {scanResult && (
          <div className="space-y-3 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">{t("plantIdentified")}</span>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">{scanResult.plantName}</h4>
              {scanResult.uses && (
                <div>
                  <p className="text-sm font-medium text-green-700 mb-1">{t("uses")}:</p>
                  <ul className="text-sm text-green-600 space-y-1">
                    {scanResult.uses.map((use: string, index: number) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-500">•</span>
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {scanResult.prototype && (
                <p className="text-xs text-green-600 mt-2 italic">{t("prototypeNote")}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

