"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Leaf, Heart, Shield, Zap, Users, Mail, Phone, MapPin, Menu, X } from "lucide-react"
import AIChatbot from "@/components/ai-chatbot"
import LanguageToggle from "@/components/language-toggle"
import HerbDetailModal from "@/components/herb-detail-modal"
import PlantScanner from "@/components/plant-scanner"
import SymptomFilter from "@/components/symptom-filter"
import { useLanguage } from "@/components/language-provider"

export default function SanjeevaniGarden() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [selectedHerb, setSelectedHerb] = useState<any>(null)
  const [isHerbModalOpen, setIsHerbModalOpen] = useState(false)
  const { t } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "herbs", "plant-scanner", "symptom-filter", "buy-plants", "ayush", "contact"]
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  const handleHerbClick = (herb: any) => {
    setSelectedHerb(herb)
    setIsHerbModalOpen(true)
  }

  const herbs = [
    {
      name: t("tulsi"),
      benefit: t("tulsiBenefit"),
      image: "/tulsi-plant-healing.jpg",
      description: t("tulsiDesc"),
      benefits: [
        t("tulsiBoostsImmunity"),
        t("tulsiReducesStress"),
        t("tulsiImprovesRespiratory"),
        t("tulsiAntiInflammatory"),
        t("tulsiRegulatesBloodSugar"),
      ],
      usage: [t("tulsiUsage1"), t("tulsiUsage2"), t("tulsiUsage3"), t("tulsiUsage4")],
      wikipediaUrl: "https://en.wikipedia.org/wiki/Ocimum_tenuiflorum",
    },
    {
      name: t("neem"),
      benefit: t("neemBenefit"),
      image: "/neem-tree-leaves-medicinal-plant.jpg",
      description: t("neemDesc"),
      benefits: [
        t("neemAntibacterial"),
        t("neemSkinHealth"),
        t("neemDentalCare"),
        t("neemBloodPurifier"),
        t("neemPestControl"),
      ],
      usage: [t("neemUsage1"), t("neemUsage2"), t("neemUsage3"), t("neemUsage4")],
      wikipediaUrl: "https://en.wikipedia.org/wiki/Azadirachta_indica",
    },
    {
      name: t("ashwagandha"),
      benefit: t("ashwagandhaBenefit"),
      image: "/ashwagandha-root-medicinal-herb.jpg",
      description: t("ashwagandhaDesc"),
      benefits: [
        t("ashwagandhaReducesStress"),
        t("ashwagandhaBoostsEnergy"),
        t("ashwagandhaImprovesStrength"),
        t("ashwagandhaEnhancesCognition"),
        t("ashwagandhaBalancesHormones"),
      ],
      usage: [t("ashwagandhaUsage1"), t("ashwagandhaUsage2"), t("ashwagandhaUsage3"), t("ashwagandhaUsage4")],
      wikipediaUrl: "https://en.wikipedia.org/wiki/Withania_somnifera",
    },
    {
      name: t("aloeVera"),
      benefit: t("aloeVeraBenefit"),
      image: "/aloe-vera-succulent-plant-healing.jpg",
      description: t("aloeVeraDesc"),
      benefits: [
        t("aloeVeraSkinHealing"),
        t("aloeVeraDigestiveHealth"),
        t("aloeVeraAntiInflammatory"),
        t("aloeVeraMoisturizing"),
        t("aloeVeraWoundHealing"),
      ],
      usage: [t("aloeVeraUsage1"), t("aloeVeraUsage2"), t("aloeVeraUsage3"), t("aloeVeraUsage4")],
      wikipediaUrl: "https://en.wikipedia.org/wiki/Aloe_vera",
    },
    {
      name: t("turmeric"),
      benefit: t("turmericBenefit"),
      image: "/turmeric-root-golden-spice-medicinal.jpg",
      description: t("turmericDesc"),
      benefits: [
        t("turmericAntiInflammatory"),
        t("turmericAntioxidant"),
        t("turmericJointHealth"),
        t("turmericDigestiveAid"),
        t("turmericImmuneSupport"),
      ],
      usage: [t("turmericUsage1"), t("turmericUsage2"), t("turmericUsage3"), t("turmericUsage4")],
      wikipediaUrl: "https://en.wikipedia.org/wiki/Turmeric",
    },
    {
      name: t("brahmi"),
      benefit: t("brahmiBenefit"),
      image: "/brahmi-bacopa-monnieri-herb-brain-health.jpg",
      description: t("brahmiDesc"),
      benefits: [
        t("brahmiEnhancesMemory"),
        t("brahmiReducesAnxiety"),
        t("brahmiImprovesConcentration"),
        t("brahmiNeuroprotective"),
        t("brahmiStressRelief"),
      ],
      usage: [t("brahmiUsage1"), t("brahmiUsage2"), t("brahmiUsage3"), t("brahmiUsage4")],
      wikipediaUrl: "https://en.wikipedia.org/wiki/Bacopa_monnieri",
    },
  ]

  const ayushSystems = [
    {
      name: t("ayurveda"),
      description: t("ayurvedaDesc"),
      icon: <Leaf className="h-8 w-8" />,
    },
    {
      name: t("yoga"),
      description: t("yogaDesc"),
      icon: <Heart className="h-8 w-8" />,
    },
    {
      name: t("unani"),
      description: t("unaniDesc"),
      icon: <Shield className="h-8 w-8" />,
    },
    {
      name: t("siddha"),
      description: t("siddhaDesc"),
      icon: <Zap className="h-8 w-8" />,
    },
    {
      name: t("homeopathy"),
      description: t("homeopathyDesc"),
      icon: <Users className="h-8 w-8" />,
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Global navigation moved to SiteNav in layout */}

      {/* Hero Section */}
      <section id="home" className="pt-16 min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-32 bg-emerald-200 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-green-200 rounded-full blur-lg"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-teal-200 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-lime-200 rounded-full blur-xl"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="animate-fade-in-up">
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <Leaf className="h-12 w-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 bg-clip-text text-transparent mb-6 text-balance">
              {t("heroTitle")}
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 text-pretty font-medium">🌿 {t("heroSubtitle")} 🌱</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => scrollToSection("herbs")}
                className="px-6 py-3 text-lg font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-md shadow-lg hover:shadow-xl transition-all duration-300"
                style={{
                  backgroundColor: "#059669",
                  color: "#ffffff",
                }}
              >
                🌿 {t("exploreHerbs")}
              </button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("about")}
                className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 font-semibold"
              >
                📚 {t("learnMore")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🌱 {t("aboutMission")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-700 to-green-700 bg-clip-text text-transparent mb-4 text-balance">
              {t("aboutTitle")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("aboutDescription")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-emerald-800">📖 {t("educational")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">{t("educationalDesc")}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-emerald-100 bg-gradient-to-br from-white to-emerald-50">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-emerald-800">💚 {t("wellnessFocused")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 leading-relaxed">{t("wellnessDesc")}</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-emerald-100 bg-gradient-to-br from-white to-teal-50">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-emerald-800">🕉️ {t("ayushInspired")}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-center text-gray-600 leading-relaxed">
                  {t("ayushDesc")}
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Herbs Section */}
      <section id="herbs" className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🌿</div>
          <div className="absolute top-32 right-20 text-4xl">🍃</div>
          <div className="absolute bottom-40 left-1/4 text-5xl">🌱</div>
          <div className="absolute bottom-20 right-1/3 text-3xl">🌾</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🌿 {t("herbalCollection")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-4 text-balance">
              {t("medicinalHerbs")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("herbsDescription")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {herbs.map((herb, index) => (
              <Card
                key={index}
                onClick={() => handleHerbClick(herb)}
                className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border-green-100 bg-white/80 backdrop-blur-sm overflow-hidden cursor-pointer"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={herb.image || "/placeholder.svg"}
                    alt={herb.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: "linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.6), transparent)",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    }}
                  >
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-medium text-sm mb-1" style={{ color: "#ffffff" }}>
                        {herb.benefit}
                      </p>
                      <p className="text-xs flex items-center gap-1" style={{ color: "#ffffff" }}>
                        <span style={{ color: "#ffffff" }}>🔍</span> {t("clickToLearnMore")}
                      </p>
                    </div>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl text-emerald-800 flex items-center gap-2">🌿 {herb.name}</CardTitle>
                  <CardDescription className="text-green-600 font-medium text-sm">{herb.benefit}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {herb.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Plant Scanner Section */}
      <section id="plant-scanner" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              📱 {t("plantScanner")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-4 text-balance">
              {t("identifyPlants")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("plantScannerSectionDesc")}
            </p>
          </div>

          <div className="flex justify-center">
            <PlantScanner />
          </div>
        </div>
      </section>

      {/* Symptom Filter Section */}
      <section id="symptom-filter" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🔍 {t("symptomFilter")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent mb-4 text-balance">
              {t("findPlantsForSymptoms")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("symptomFilterSectionDesc")}
            </p>
          </div>

          <SymptomFilter />
        </div>
      </section>

      {/* Buy Plants Section */}
      <section id="buy-plants" className="py-20 bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 text-6xl">🛒</div>
          <div className="absolute top-32 right-20 text-4xl">🌱</div>
          <div className="absolute bottom-40 left-1/4 text-5xl">🏠</div>
          <div className="absolute bottom-20 right-1/3 text-3xl">📦</div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-200 text-green-900 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🛒 {t("shopNow")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-emerald-800 bg-clip-text text-transparent mb-4 text-balance">
              {t("buyMedicinalPlants")}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("buyPlantsDescription")}
            </p>
          </div>

          <div className="text-center mb-12">
            <Button
              size="lg"
              onClick={() => window.open("/shop", "_blank")}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold px-8 py-4 text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            >
              🌿 {t("shopMedicinalPlants")} 🏠
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🚚", title: t("freeDelivery"), desc: t("freeDeliveryDesc") },
              { icon: "🌱", title: t("freshPlants"), desc: t("freshPlantsDesc") },
              { icon: "💰", title: t("affordablePrices"), desc: t("affordablePricesDesc") },
              { icon: "🏆", title: t("qualityGuarantee"), desc: t("qualityGuaranteeDesc") },
            ].map((feature, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-green-200 bg-white/90 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="text-4xl mb-2">{feature.icon}</div>
                  <CardTitle className="text-green-800 text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-sm leading-relaxed">{feature.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AYUSH Section */}
      <section id="ayush" className="py-20 bg-gradient-to-b from-white to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              🕉️ {t("traditionalSystems")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-600 mb-4 text-balance">{t("ayushSystems")}</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto text-pretty leading-relaxed">
              {t("ayushSystemsDesc")}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ayushSystems.map((system, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all duration-300 hover:-translate-y-2 group border-orange-100 bg-gradient-to-br from-white to-orange-50"
              >
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <div className="text-white">{system.icon}</div>
                  </div>
                  <CardTitle className="text-xl text-orange-800">{system.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600 leading-relaxed">
                    {system.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-4">
              📞 {t("contactUs")}
            </div>
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4 text-balance">
              {t("getInTouch")}
            </h2>
            <p className="text-lg text-gray-600 text-pretty leading-relaxed">{t("contactDescription")}</p>
          </div>

          <Card className="max-w-2xl mx-auto shadow-xl border-blue-100 bg-white/90 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
              <CardTitle className="text-blue-800 flex items-center gap-2">💌 {t("contactForm")}</CardTitle>
              <CardDescription className="text-gray-600">{t("contactFormDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      👤 {t("name")}
                    </label>
                    <Input id="name" placeholder={t("name")} className="border-blue-200 focus:border-blue-400" />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      📧 {t("email")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t("email")}
                      className="border-blue-200 focus:border-blue-400"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    💬 {t("message")}
                  </label>
                  <Textarea
                    id="message"
                    placeholder={t("message")}
                    rows={5}
                    className="border-blue-200 focus:border-blue-400"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 shadow-lg text-white font-semibold"
                >
                  📤 {t("sendMessage")}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-blue-800 mb-2">📧 {t("email")}</h3>
              <p className="text-gray-600">info@sanjeevani-garden.com</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-green-800 mb-2">📞 {t("phone")}</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
            <div className="text-center bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-blue-100">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-orange-800 mb-2">📍 {t("location")}</h3>
              <p className="text-gray-600">Wellness Center, India</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-emerald-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-white">🌿 {t("heroTitle")}</span>
            </div>

            <div className="flex space-x-6 mb-4 md:mb-0">
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                {t("privacyPolicy")}
              </a>
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                {t("termsOfService")}
              </a>
              <a href="#" className="text-emerald-100 hover:text-white transition-colors">
                {t("aboutUs")}
              </a>
            </div>

            <p className="text-emerald-100 text-sm">
              © 2024 {t("heroTitle")}. {t("allRightsReserved")}.
            </p>
          </div>
        </div>
      </footer>

      {/* AI Chatbot */}
      <AIChatbot />

      {/* Herb Detail Modal */}
      <HerbDetailModal herb={selectedHerb} isOpen={isHerbModalOpen} onClose={() => setIsHerbModalOpen(false)} />
    </div>
  )
}
