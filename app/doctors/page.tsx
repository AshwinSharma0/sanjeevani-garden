"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { CheckCircle2, Stethoscope, ShieldCheck, Star, Search, Filter, ArrowUpDown, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"

type Doctor = {
  name: string
  qualification: string
  experience: string
  specialization: string
  fee: string
  organization?: string
  image: string
}

const doctors: Doctor[] = [
  {
    name: "Dr. Hemant Yadav",
    qualification: "MD Ayurveda, BAMS",
    experience: "10 Years",
    specialization: "Ayurveda & Herbal Medicine",
    fee: "₹499 / session",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Dr. Priya Nair",
    qualification: " MD Skin & Wellness",
    experience: "8 Years",
    specialization: "Skin & Wellness",
    fee: "₹599 / session",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Dr. Rohan Mehta",
    qualification: "BAMS, PG Diploma in Diet & Nutrition",
    experience: "12 Years",
    specialization: "Diet & Nutrition",
    fee: "₹699 / session",
    image: "/placeholder-user.jpg",
  },
  {
    name: "Dr. KK Sharma",
    qualification: "BAMS",
    experience: "5 Years",
    specialization: "Herbal Therapy & Natural Health",
    fee: "₹399 / session",
    organization: "Patanjali Ayurved",
    image: "/placeholder-user.jpg",
  },
]

export default function DoctorsPage() {
  const [query, setQuery] = useState("")
  const [specialization, setSpecialization] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recommended")

  const specializations = useMemo(() => {
    const set = new Set<string>(["all"])
    doctors.forEach((d) => set.add(d.specialization))
    return Array.from(set)
  }, [])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let list = doctors.filter((d) => {
      const inQuery = !q ||
        d.name.toLowerCase().includes(q) ||
        d.qualification.toLowerCase().includes(q) ||
        d.specialization.toLowerCase().includes(q) ||
        (d.organization?.toLowerCase().includes(q) ?? false)
      const inSpec = specialization === "all" || d.specialization === specialization
      return inQuery && inSpec
    })

    if (sortBy === "fee-asc" || sortBy === "fee-desc") {
      const parseFee = (fee: string) => {
        const match = fee.match(/\d+/g)
        return match ? Number(match.join("")) : Number.MAX_SAFE_INTEGER
      }
      list = list.slice().sort((a, b) => {
        const da = parseFee(a.fee)
        const db = parseFee(b.fee)
        return sortBy === "fee-asc" ? da - db : db - da
      })
    }

    return list
  }, [query, specialization, sortBy])

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      <section className="pt-10 pb-6 border-b border-emerald-100/60 bg-gradient-to-r from-emerald-50/60 to-teal-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <ChevronRight className="h-4 w-4 text-emerald-700/70" />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Doctors</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <header className="mt-6 mb-8 text-center">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Stethoscope className="h-4 w-4" />
              Herbal Health Experts
            </div>
            <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-3">
              Meet Our Verified Doctors
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
              Search, filter and book consultations with trusted wellness specialists
            </p>
          </header>

          <div className="grid gap-3 md:grid-cols-3 mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-700/60" />
              <Input
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
                placeholder="Search by name, qualification, specialization"
                className="pl-9 bg-white/80 backdrop-blur-sm border-emerald-100"
              />
            </div>
            <div className="flex gap-2">
              <Select value={specialization} onValueChange={setSpecialization}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-100">
                  <Filter className="mr-2 h-4 w-4 text-emerald-700/70" />
                  <SelectValue placeholder="Filter by specialization" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec: string) => (
                    <SelectItem key={spec} value={spec}>
                      {spec === "all" ? "All specializations" : spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-white/80 backdrop-blur-sm border-emerald-100">
                  <ArrowUpDown className="mr-2 h-4 w-4 text-emerald-700/70" />
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="fee-asc">Fee: Low to High</SelectItem>
                  <SelectItem value="fee-desc">Fee: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 bg-white/70 border border-emerald-100 rounded-xl">
              <p className="text-emerald-800 font-medium">No doctors match your search.</p>
              <p className="text-sm text-gray-600 mt-1">Try adjusting your keywords or filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filtered.map((doc: Doctor) => (
              <article
                key={doc.name}
                className="group relative overflow-hidden rounded-xl border border-emerald-100 bg-white/90 backdrop-blur-sm shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex items-stretch">
                  <div className="w-36 shrink-0 relative">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="h-full w-36 object-cover"
                    />
                    <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-emerald-600 text-white text-xs px-2 py-1 rounded-md shadow">
                      <ShieldCheck className="h-3.5 w-3.5" /> Verified
                    </div>
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-xl font-semibold text-emerald-800">
                          {doc.name}
                        </h3>
                        <p className="text-sm text-emerald-700/80 font-medium">{doc.qualification}</p>
                      </div>
                      <div className="hidden md:flex items-center text-amber-500" aria-label="rating">
                        <Star className="h-4 w-4 fill-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400" />
                        <Star className="h-4 w-4 fill-amber-400" />
                        <Star className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700">
                      <div className="bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
                        <span className="font-medium text-emerald-800">Experience:</span> {doc.experience}
                      </div>
                      <div className="bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2">
                        <span className="font-medium text-emerald-800">Specialization:</span> {doc.specialization}
                      </div>
                      {doc.organization && (
                        <div className="bg-emerald-50 border border-emerald-100 rounded-md px-3 py-2 sm:col-span-2">
                          <span className="font-medium text-emerald-800">Organization:</span> {doc.organization}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                        <span className="text-sm text-gray-700">Trusted Expert</span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Consultation Fee</p>
                        <p className="text-lg font-semibold text-emerald-700">{doc.fee}</p>
                      </div>
                    </div>

                    <div className="mt-5">
                      <Button asChild className="w-full bg-emerald-600 hover:bg-emerald-700">
                        <Link href={{ pathname: "/consult", query: { doctor: doc.name } }}>
                          Consult Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16,185,129,0.06) 0%, rgba(5,150,105,0.06) 100%)",
                  }}
                />
              </article>
            ))}
          </div>
          )}
        </div>
      </section>
    </div>
  )
}


