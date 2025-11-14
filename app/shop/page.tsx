"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, ArrowLeft, ShoppingCart, Star, Truck, Shield, Heart } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import LanguageToggle from "@/components/language-toggle"

export default function ShopPage() {
  const { t } = useLanguage()
  const [cart, setCart] = useState<any[]>([])

  const plants = [
    {
      id: 1,
      name: t("tulsi"),
      scientificName: "Ocimum tenuiflorum",
      price: 299,
      originalPrice: 399,
      image: "/placeholder-l9a54.png",
      rating: 4.8,
      reviews: 156,
      inStock: true,
      benefits: [t("tulsiBenefit"), t("tulsiBoostsImmunity"), t("tulsiReducesStress")],
      size: t("mediumPot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 2,
      name: t("neem"),
      scientificName: "Azadirachta indica",
      price: 349,
      originalPrice: 449,
      image: "/neem-tree-leaves-medicinal-plant.jpg",
      rating: 4.7,
      reviews: 203,
      inStock: true,
      benefits: [t("neemBenefit"), t("neemAntibacterial"), t("neemSkinHealth")],
      size: t("largePot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 3,
      name: t("ashwagandha"),
      scientificName: "Withania somnifera",
      price: 399,
      originalPrice: 499,
      image: "/ashwagandha-root-medicinal-herb.jpg",
      rating: 4.9,
      reviews: 89,
      inStock: true,
      benefits: [t("ashwagandhaBenefit"), t("ashwagandhaReducesStress"), t("ashwagandhaBoostsEnergy")],
      size: t("mediumPot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 4,
      name: t("aloeVera"),
      scientificName: "Aloe barbadensis",
      price: 199,
      originalPrice: 299,
      image: "/aloe-vera-succulent-plant-healing.jpg",
      rating: 4.6,
      reviews: 312,
      inStock: true,
      benefits: [t("aloeVeraBenefit"), t("aloeVeraSkinHealing"), t("aloeVeraDigestiveHealth")],
      size: t("smallPot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 5,
      name: t("turmeric"),
      scientificName: "Curcuma longa",
      price: 249,
      originalPrice: 349,
      image: "/turmeric-root-golden-spice-medicinal.jpg",
      rating: 4.5,
      reviews: 178,
      inStock: true,
      benefits: [t("turmericBenefit"), t("turmericAntiInflammatory"), t("turmericAntioxidant")],
      size: t("mediumPot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 6,
      name: t("brahmi"),
      scientificName: "Bacopa monnieri",
      price: 329,
      originalPrice: 429,
      image: "/brahmi-bacopa-monnieri-herb-brain-health.jpg",
      rating: 4.7,
      reviews: 94,
      inStock: true,
      benefits: [t("brahmiBenefit"), t("brahmiEnhancesMemory"), t("brahmiReducesAnxiety")],
      size: t("mediumPot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 7,
      name: t("mintPlant"),
      scientificName: "Mentha spicata",
      price: 149,
      originalPrice: 199,
      image: "/fresh-mint-plant-in-pot.jpg",
      rating: 4.4,
      reviews: 267,
      inStock: true,
      benefits: [t("mintBenefit"), t("mintDigestive"), t("mintRefreshing")],
      size: t("smallPot"),
      delivery: t("freeDelivery"),
    },
    {
      id: 8,
      name: t("gingerPlant"),
      scientificName: "Zingiber officinale",
      price: 279,
      originalPrice: 379,
      image: "/ginger-plant-with-roots-in-pot.jpg",
      rating: 4.6,
      reviews: 145,
      inStock: false,
      benefits: [t("gingerBenefit"), t("gingerDigestive"), t("gingerAntiNausea")],
      size: t("mediumPot"),
      delivery: t("freeDelivery"),
    },
  ]

  const addToCart = (plant: any) => {
    setCart([...cart, plant])
  }

  const goBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-emerald-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={goBack} className="text-emerald-700 hover:text-emerald-800">
                <ArrowLeft className="h-5 w-5 mr-2" />
                {t("backToHome")}
              </Button>
              <div className="flex items-center space-x-2">
                <Leaf className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-bold text-emerald-800">{t("plantShop")}</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <LanguageToggle />
              <Button
                variant="outline"
                className="relative border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {t("cart")} ({cart.length})
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-emerald-600 to-green-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 text-8xl">🌿</div>
          <div className="absolute bottom-10 right-10 text-6xl">🏠</div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">🌱 {t("shopMedicinalPlants")}</h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto text-pretty leading-relaxed">
            {t("shopDescription")}
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Truck className="h-4 w-4 mr-2" />
              {t("freeDelivery")}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Shield className="h-4 w-4 mr-2" />
              {t("qualityGuarantee")}
            </Badge>
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 px-4 py-2">
              <Heart className="h-4 w-4 mr-2" />
              {t("organicGrown")}
            </Badge>
          </div>
        </div>
      </section>

      {/* Plants Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-emerald-800 mb-4">{t("availablePlants")}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">{t("availablePlantsDesc")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {plants.map((plant) => (
              <Card
                key={plant.id}
                className="group hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-emerald-100 bg-white overflow-hidden"
              >
                <div className="aspect-square overflow-hidden relative">
                  <img
                    src={plant.image || "/placeholder.svg"}
                    alt={plant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {!plant.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <Badge variant="destructive" className="text-sm font-semibold">
                        {t("outOfStock")}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-emerald-600 text-white">
                      {Math.round(((plant.originalPrice - plant.price) / plant.originalPrice) * 100)}% {t("off")}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-emerald-800 mb-1">{plant.name}</CardTitle>
                      <p className="text-xs text-gray-500 italic">{plant.scientificName}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{plant.rating}</span>
                      <span className="text-xs text-gray-500">({plant.reviews})</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="space-y-1">
                    {plant.benefits.slice(0, 2).map((benefit, index) => (
                      <p key={index} className="text-xs text-gray-600 leading-relaxed">
                        • {benefit}
                      </p>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>{plant.size}</span>
                    <span className="text-green-600 font-medium">{plant.delivery}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-emerald-700">₹{plant.price}</span>
                      <span className="text-sm text-gray-500 line-through ml-2">₹{plant.originalPrice}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => addToCart(plant)}
                    disabled={!plant.inStock}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold disabled:bg-gray-300"
                  >
                    {plant.inStock ? (
                      <>
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {t("addToCart")}
                      </>
                    ) : (
                      t("outOfStock")
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-emerald-800 mb-2">{t("freeDelivery")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("freeDeliveryDesc")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">{t("qualityGuarantee")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("qualityGuaranteeDesc")}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-teal-600" />
              </div>
              <h3 className="text-lg font-semibold text-teal-800 mb-2">{t("organicGrown")}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{t("organicGrownDesc")}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
