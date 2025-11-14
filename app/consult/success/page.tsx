"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"

export default function SuccessPage() {
  const params = useSearchParams()
  const doctor = params.get("doctor") || "Doctor"
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <section className="py-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 text-center">
            <CardHeader>
              <CardTitle className="text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="h-6 w-6 text-emerald-600" /> Booking Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Your video consultation with {doctor} is confirmed.</p>
              <p className="text-sm text-gray-600">A confirmation email would be sent in a real flow.</p>
              <div className="flex gap-3 justify-center">
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                  <Link href="/doctors">Browse More Doctors</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/">Go to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


