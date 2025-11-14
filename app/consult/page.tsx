"use client"

import { useSearchParams } from "next/navigation"
import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { CalendarClock, Video, IndianRupee } from "lucide-react"

export default function ConsultPage() {
  const params = useSearchParams()
  const doctor = params.get("doctor") || "Selected Doctor"
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [problem, setProblem] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fee = useMemo(() => {
    if (/Hemant/.test(doctor)) return 499
    if (/Priya/.test(doctor)) return 599
    if (/Rohan/.test(doctor)) return 699
    if (/Sharma/.test(doctor)) return 399
    return 499
  }, [doctor])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-2">
              Book Your Online Consultation
            </h1>
            <p className="text-gray-600">Secure video consultation with a verified herbal health expert</p>
          </header>

          <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 shadow-sm">
            <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-green-50">
              <CardTitle className="text-emerald-800">{doctor}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-3 rounded-md bg-emerald-50 border border-emerald-100">
                  <Video className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-700">Mode</p>
                    <p className="font-medium text-emerald-800">Video Consultation</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-md bg-emerald-50 border border-emerald-100">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="text-sm text-gray-700">Fee</p>
                    <p className="font-medium text-emerald-800">₹{fee} / session</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-md bg-green-50 border border-green-100">
                <CalendarClock className="h-5 w-5 text-green-700" />
                <p className="text-sm text-gray-700">
                  This is a demo booking flow. Proceed to mock payment to confirm your time slot.
                </p>
              </div>

              {/* Simple consult request form */}
              <div className="space-y-3">
                <h3 className="font-medium text-emerald-800">Quick Consult Request</h3>
                <Input placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />
                <Input placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <Textarea placeholder="Describe your problem" value={problem} onChange={(e) => setProblem(e.target.value)} />
                <div className="flex gap-3">
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
                    disabled={submitting || !name || !email || !problem}
                    onClick={async () => {
                      try {
                        setSubmitting(true)
                        const resp = await fetch('http://localhost:4000/api/health/consult-requests', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ name, email, problem }),
                        })
                        if (resp.ok) {
                          setSubmitted(true)
                          setName('')
                          setEmail('')
                          setProblem('')
                        }
                      } finally {
                        setSubmitting(false)
                      }
                    }}
                  >
                    {submitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                  {submitted && <span className="text-sm text-emerald-700 self-center">Thanks! We will contact you shortly.</span>}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700" asChild>
                  <Link href={{ pathname: "/consult/payment", query: { doctor } }}>Proceed to Payment</Link>
                </Button>
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/doctors">Back to Doctors</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}


