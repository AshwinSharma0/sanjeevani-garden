"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CreditCard, ShieldCheck } from "lucide-react"

export default function PaymentPage() {
  const params = useSearchParams()
  const router = useRouter()
  const doctor = params.get("doctor") || "Selected Doctor"
  const [loading, setLoading] = useState(false)

  const handlePay = async () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push(`/consult/success?doctor=${encodeURIComponent(doctor)}`)
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 shadow-sm">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="text-emerald-800">Mock Payment</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p className="text-gray-700 text-sm">Pay securely to confirm your slot with {doctor}.</p>
              <div className="grid gap-3">
                <Input placeholder="Cardholder Name" />
                <Input placeholder="Card Number" />
                <div className="grid grid-cols-2 gap-3">
                  <Input placeholder="MM/YY" />
                  <Input placeholder="CVV" />
                </div>
              </div>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={handlePay} disabled={loading}>
                <CreditCard className="h-4 w-4 mr-2" /> {loading ? "Processing..." : "Pay & Confirm"}
              </Button>
              <p className="flex items-center gap-2 justify-center text-xs text-gray-500">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% secure mock payment
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


