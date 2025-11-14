"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

type Language = "en" | "hi"

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const translations = {
  en: {
    // Navigation
    home: "Home",
    about: "About",
    herbs: "Herbs",
    "plant-scanner": "Plant Scanner",
    "symptom-filter": "Symptom Filter",
    ayush: "AYUSH",
    contact: "Contact",

    // Hero Section
    heroTitle: "Sanjeevani Garden",
    heroSubtitle: "A Digital Herbal Experience for Wellness & Learning",
    exploreHerbs: "Explore Herbs",
    learnMore: "Learn More",

    // About Section
    aboutMission: "About Our Mission",
    aboutTitle: "About Sanjeevani Garden",
    aboutDescription:
      "Discover the ancient wisdom of herbal medicine through our comprehensive digital platform. We bridge traditional knowledge with modern accessibility, making wellness education available to everyone.",
    educational: "Educational",
    educationalDesc: "Learn about medicinal plants, their properties, and traditional uses in various healing systems.",
    wellnessFocused: "Wellness Focused",
    wellnessDesc: "Promote holistic health through natural remedies and time-tested healing practices.",
    ayushInspired: "AYUSH Inspired",
    ayushDesc: "Based on the principles of Ayurveda, Yoga, Unani, Siddha, and Homeopathy systems.",

    // Herbs Section
    herbalCollection: "Herbal Collection",
    medicinalHerbs: "Medicinal Herbs",
    herbsDescription: "Explore our collection of powerful medicinal plants and discover their healing properties.",

    // Herb Names and Benefits
    tulsi: "Tulsi",
    tulsiBenefit: "Boosts immunity and reduces stress",
    tulsiDesc:
      "Known as Holy Basil, Tulsi is revered for its adaptogenic properties and ability to enhance respiratory health.",

    neem: "Neem",
    neemBenefit: "Natural antibacterial and antifungal",
    neemDesc: "A powerful natural purifier, Neem supports skin health and helps maintain blood sugar levels.",

    ashwagandha: "Ashwagandha",
    ashwagandhaBenefit: "Reduces anxiety and improves strength",
    ashwagandhaDesc: "An ancient adaptogen that helps the body manage stress while boosting energy and vitality.",

    aloeVera: "Aloe Vera",
    aloeVeraBenefit: "Soothes skin and aids digestion",
    aloeVeraDesc: "A versatile healing plant known for its cooling properties and digestive benefits.",

    turmeric: "Turmeric",
    turmericBenefit: "Anti-inflammatory and antioxidant",
    turmericDesc: "The golden spice with powerful anti-inflammatory compounds that support joint and brain health.",

    brahmi: "Brahmi",
    brahmiBenefit: "Enhances memory and cognitive function",
    brahmiDesc: "A brain tonic that improves memory, concentration, and overall cognitive performance.",

    // AYUSH Section
    traditionalSystems: "Traditional Systems",
    ayushSystems: "AYUSH Systems",
    ayushSystemsDesc: "Discover the five pillars of traditional medicine that form the foundation of holistic healing.",

    ayurveda: "Ayurveda",
    ayurvedaDesc: "Ancient Indian system of medicine focusing on balance of mind, body, and spirit",

    yoga: "Yoga",
    yogaDesc: "Physical, mental, and spiritual practices for holistic wellness",

    unani: "Unani",
    unaniDesc: "Traditional medicine system based on Greek philosophy and Islamic practices",

    siddha: "Siddha",
    siddhaDesc: "Ancient Tamil system of medicine using minerals, metals, and herbs",

    homeopathy: "Homeopathy",
    homeopathyDesc: "System of alternative medicine using highly diluted substances",

    // Contact Section
    contactUs: "Contact Us",
    getInTouch: "Get In Touch",
    contactDescription: "Have questions about herbal medicine or want to learn more? We'd love to hear from you.",
    contactForm: "Contact Form",
    contactFormDesc: "Send us a message and we'll get back to you as soon as possible.",
    name: "Name",
    email: "Email",
    message: "Message",
    sendMessage: "Send Message",
    phone: "Phone",
    location: "Location",

    // Footer
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    aboutUs: "About Us",
    allRightsReserved: "All rights reserved",

    // Language Toggle
    switchToHindi: "हिंदी",
    switchToEnglish: "English",

    // Herb Modal
    description: "Description",
    healthBenefits: "Health Benefits",
    howToUse: "How to Use",
    knowMore: "Know More",
    clickToLearnMore: "Click to learn more",

    // Detailed Herb Benefits
    tulsiBoostsImmunity: "Boosts immune system and fights infections",
    tulsiReducesStress: "Reduces stress and anxiety levels",
    tulsiImprovesRespiratory: "Improves respiratory health and breathing",
    tulsiAntiInflammatory: "Has anti-inflammatory properties",
    tulsiRegulatesBloodSugar: "Helps regulate blood sugar levels",

    neemAntibacterial: "Powerful antibacterial and antifungal properties",
    neemSkinHealth: "Promotes healthy skin and treats skin conditions",
    neemDentalCare: "Supports oral health and dental hygiene",
    neemBloodPurifier: "Acts as a natural blood purifier",
    neemPestControl: "Natural pest control and insect repellent",

    ashwagandhaReducesStress: "Reduces cortisol levels and manages stress",
    ashwagandhaBoostsEnergy: "Increases energy levels and reduces fatigue",
    ashwagandhaImprovesStrength: "Enhances physical strength and muscle mass",
    ashwagandhaEnhancesCognition: "Improves cognitive function and focus",
    ashwagandhaBalancesHormones: "Helps balance hormones naturally",

    aloeVeraSkinHealing: "Accelerates wound healing and skin repair",
    aloeVeraDigestiveHealth: "Supports digestive health and gut healing",
    aloeVeraAntiInflammatory: "Reduces inflammation and soothes irritation",
    aloeVeraMoisturizing: "Provides deep moisturization for skin",
    aloeVeraWoundHealing: "Promotes faster healing of cuts and burns",

    turmericAntiInflammatory: "Powerful anti-inflammatory compound curcumin",
    turmericAntioxidant: "Rich in antioxidants that fight free radicals",
    turmericJointHealth: "Supports joint health and reduces arthritis pain",
    turmericDigestiveAid: "Aids digestion and improves gut health",
    turmericImmuneSupport: "Strengthens immune system function",

    brahmiEnhancesMemory: "Improves memory retention and recall",
    brahmiReducesAnxiety: "Reduces anxiety and promotes calmness",
    brahmiImprovesConcentration: "Enhances focus and concentration",
    brahmiNeuroprotective: "Protects brain cells from damage",
    brahmiStressRelief: "Provides natural stress relief",

    // Usage Instructions
    tulsiUsage1: "Chew 2-3 fresh tulsi leaves daily on empty stomach",
    tulsiUsage2: "Prepare tulsi tea by boiling leaves in water for 5 minutes",
    tulsiUsage3: "Add tulsi powder to warm milk before bedtime",
    tulsiUsage4: "Use tulsi essential oil for aromatherapy and stress relief",

    neemUsage1: "Apply neem oil directly to affected skin areas",
    neemUsage2: "Chew neem leaves or take neem capsules for internal benefits",
    neemUsage3: "Use neem paste as a natural face mask twice weekly",
    neemUsage4: "Boil neem leaves in water for a medicinal bath",

    ashwagandhaUsage1: "Take 300-500mg ashwagandha powder with warm milk",
    ashwagandhaUsage2: "Consume ashwagandha capsules 30 minutes before meals",
    ashwagandhaUsage3: "Mix ashwagandha powder in smoothies or protein shakes",
    ashwagandhaUsage4: "Take consistently for 2-3 months for best results",

    aloeVeraUsage1: "Apply fresh aloe vera gel directly to skin",
    aloeVeraUsage2: "Drink 2-4 oz of aloe vera juice daily for digestive health",
    aloeVeraUsage3: "Use aloe vera gel as a natural moisturizer after shower",
    aloeVeraUsage4: "Apply to sunburns and minor cuts for healing",

    turmericUsage1: "Add 1 tsp turmeric powder to warm milk (golden milk)",
    turmericUsage2: "Include turmeric in cooking curries and soups",
    turmericUsage3: "Make turmeric paste with water for topical application",
    turmericUsage4: "Take turmeric supplements with black pepper for absorption",

    brahmiUsage1: "Take brahmi powder with ghee or honey twice daily",
    brahmiUsage2: "Prepare brahmi tea by steeping dried leaves in hot water",
    brahmiUsage3: "Apply brahmi oil to scalp for hair and brain health",
    brahmiUsage4: "Take brahmi capsules consistently for cognitive benefits",

    // Shopping Section
    "buy-plants": "Buy Plants",
    shopNow: "Shop Now",
    buyMedicinalPlants: "Buy Medicinal Plants",
    buyPlantsDescription:
      "Get fresh, organic medicinal plants delivered directly to your home at affordable prices. All plants come with care instructions and quality guarantee.",
    shopMedicinalPlants: "Shop Medicinal Plants",
    freeDelivery: "Free Delivery",
    freeDeliveryDesc: "Free home delivery on all orders above ₹500",
    freshPlants: "Fresh Plants",
    freshPlantsDesc: "Freshly grown organic plants with quality assurance",
    affordablePrices: "Affordable Prices",
    affordablePricesDesc: "Best prices for premium quality medicinal plants",
    qualityGuarantee: "Quality Guarantee",
    qualityGuaranteeDesc: "100% satisfaction guarantee or money back",
    organicGrown: "Organic Grown",
    organicGrownDesc: "Naturally grown without harmful chemicals or pesticides",

    // Shop Page
    plantShop: "Plant Shop",
    backToHome: "Back to Home",
    cart: "Cart",
    shopDescription:
      "Discover our premium collection of medicinal plants, carefully grown and delivered fresh to your doorstep with complete care instructions.",
    availablePlants: "Available Plants",
    availablePlantsDesc:
      "Choose from our wide selection of authentic medicinal plants, each with detailed information about benefits and care instructions.",

    // Plant Details
    mediumPot: "Medium Pot (6 inch)",
    largePot: "Large Pot (8 inch)",
    smallPot: "Small Pot (4 inch)",
    off: "OFF",
    outOfStock: "Out of Stock",
    addToCart: "Add to Cart",

    // Additional Plants
    mintPlant: "Mint Plant",
    mintBenefit: "Aids digestion and freshens breath",
    mintDigestive: "Improves digestive health naturally",
    mintRefreshing: "Provides natural freshness and cooling",

    gingerPlant: "Ginger Plant",
    gingerBenefit: "Reduces nausea and aids digestion",
    gingerDigestive: "Powerful digestive aid and stomach soother",
    gingerAntiNausea: "Natural remedy for nausea and motion sickness",

    // Plant Scanner
    plantScanner: "Plant Scanner",
    plantScannerDesc: "Upload a plant image to identify it and learn about its medicinal uses",
    scanning: "Scanning...",
    scanPlant: "Scan Plant",
    plantIdentified: "Plant Identified",
    uses: "Uses",
    prototypeNote: "This is a prototype feature. Results may vary.",

    // Symptom Filter
    symptomFilter: "Symptom Filter",
    symptomFilterDesc: "Find plants that can help with specific health symptoms",
    enterSymptom: "Enter your symptom (e.g., cough, fever, headache)",
    commonSymptoms: "Common Symptoms",
    search: "Search",
    searching: "Searching...",
    foundPlants: "Plants Found",
    availableInShop: "Available in Shop",
    noPlantsFound: "No plants found for this symptom",
    tryDifferentSymptom: "Try a different symptom or search term",

    // Section Descriptions
    identifyPlants: "Identify Plants",
    plantScannerSectionDesc: "Upload a photo of any plant to instantly identify it and discover its medicinal properties and traditional uses.",
    findPlantsForSymptoms: "Find Plants for Your Symptoms",
    symptomFilterSectionDesc: "Search for medicinal plants that can help with specific health conditions like cough, fever, headache, and more.",
  },
  hi: {
    // Navigation
    home: "होम",
    about: "हमारे बारे में",
    herbs: "जड़ी-बूटियां",
    "plant-scanner": "पौधा स्कैनर",
    "symptom-filter": "लक्षण फिल्टर",
    ayush: "आयुष",
    contact: "संपर्क",

    // Hero Section
    heroTitle: "संजीवनी गार्डन",
    heroSubtitle: "कल्याण और शिक्षा के लिए एक डिजिटल हर्बल अनुभव",
    exploreHerbs: "जड़ी-बूटियों का अन्वेषण करें",
    learnMore: "और जानें",

    // About Section
    aboutMission: "हमारे मिशन के बारे में",
    aboutTitle: "संजीवनी गार्डन के बारे में",
    aboutDescription:
      "हमारे व्यापक डिजिटल प्लेटफॉर्म के माध्यम से हर्बल चिकित्सा की प्राचीन बुद्धि की खोज करें। हम पारंपरिक ज्ञान को आधुनिक पहुंच के साथ जोड़ते हैं, कल्याण शिक्षा को सभी के लिए उपलब्ध कराते हैं।",
    educational: "शैक्षिक",
    educationalDesc: "औषधीय पौधों, उनके गुणों और विभिन्न उपचार प्रणालियों में पारंपरिक उपयोगों के बारे में जानें।",
    wellnessFocused: "कल्याण केंद्रित",
    wellnessDesc: "प्राकृतिक उपचार और समय-परीक्षित उपचार प्रथाओं के माध्यम से समग्र स्वास्थ्य को बढ़ावा दें।",
    ayushInspired: "आयुष प्रेरित",
    ayushDesc: "आयुर्वेद, योग, यूनानी, सिद्ध और होम्योपैथी प्रणालियों के सिद्धांतों पर आधारित।",

    // Herbs Section
    herbalCollection: "हर्बल संग्रह",
    medicinalHerbs: "औषधीय जड़ी-बूटियां",
    herbsDescription: "शक्तिशाली औषधीय पौधों के हमारे संग्रह का अन्वेषण करें और उनके उपचार गुणों की खोज करें।",

    // Herb Names and Benefits
    tulsi: "तुलसी",
    tulsiBenefit: "प्रतिरक्षा बढ़ाती है और तनाव कम करती है",
    tulsiDesc: "पवित्र तुलसी के रूप में जानी जाती है, तुलसी अपने अनुकूलनकारी गुणों और श्वसन स्वास्थ्य बढ़ाने की क्षमता के लिए पूजनीय है।",

    neem: "नीम",
    neemBenefit: "प्राकृतिक जीवाणुरोधी और कवकरोधी",
    neemDesc:
      "एक शक्तिशाली प्राकृतिक शुद्धकर्ता, नीम त्वचा के स्वास्थ्य का समर्थन करता है और रक्त शर्करा के स्तर को बनाए रखने में मदद करता है।",

    ashwagandha: "अश्वगंधा",
    ashwagandhaBenefit: "चिंता कम करता है और शक्ति बढ़ाता है",
    ashwagandhaDesc: "एक प्राचीन अनुकूलनकारी जो शरीर को तनाव प्रबंधन में मदद करता है और ऊर्जा और जीवन शक्ति बढ़ाता है।",

    aloeVera: "एलोवेरा",
    aloeVeraBenefit: "त्वचा को शांत करता है और पाचन में सहायता करता है",
    aloeVeraDesc: "एक बहुमुखी उपचार पौधा जो अपने शीतलन गुणों और पाचन लाभों के लिए जाना जाता है।",

    turmeric: "हल्दी",
    turmericBenefit: "सूजन-रोधी और एंटीऑक्सीडेंट",
    turmericDesc: "शक्तिशाली सूजन-रोधी यौगिकों के साथ सुनहरा मसाला जो जोड़ों और मस्तिष्क के स्वास्थ्य का समर्थन करता है।",

    brahmi: "ब्राह्मी",
    brahmiBenefit: "स्मृति और संज्ञानात्मक कार्य बढ़ाती है",
    brahmiDesc: "एक मस्तिष्क टॉनिक जो स्मृति, एकाग्रता और समग्र संज्ञानात्मक प्रदर्शन में सुधार करता है।",

    // AYUSH Section
    traditionalSystems: "पारंपरिक प्रणालियां",
    ayushSystems: "आयुष प्रणालियां",
    ayushSystemsDesc: "पारंपरिक चिकित्सा के पांच स्तंभों की खोज करें जो समग्र उपचार की नींव बनाते हैं।",

    ayurveda: "आयुर्वेद",
    ayurvedaDesc: "मन, शरीर और आत्मा के संतुलन पर केंद्रित प्राचीन भारतीय चिकित्सा प्रणाली",

    yoga: "योग",
    yogaDesc: "शारीरिक, मानसिक और आध्यात्मिक अभ्यास के लिए समग्र कल्याण",

    unani: "यूनानी",
    unaniDesc: "ग्रीक दर्शन और इस्लामी प्रथाओं पर आधारित पारंपरिक चिकित्सा प्रणाली",

    siddha: "सिद्ध",
    siddhaDesc: "खनिज, धातु और जड़ी-बूटियों का उपयोग करने वाली प्राचीन तमिल चिकित्सा प्रणाली",

    homeopathy: "होम्योपैथी",
    homeopathyDesc: "अत्यधिक पतले पदार्थों का उपयोग करने वाली वैकल्पिक चिकित्सा प्रणाली",

    // Contact Section
    contactUs: "संपर्क करें",
    getInTouch: "संपर्क में रहें",
    contactDescription: "हर्बल चिकित्सा के बारे में प्रश्न हैं या और जानना चाहते हैं? हम आपसे सुनना पसंद करेंगे।",
    contactForm: "संपर्क फॉर्म",
    contactFormDesc: "हमें एक संदेश भेजें और हम जल्द से जल्द आपसे संपर्क करेंगे।",
    name: "नाम",
    email: "ईमेल",
    message: "संदेश",
    sendMessage: "संदेश भेजें",
    phone: "फोन",
    location: "स्थान",

    // Footer
    privacyPolicy: "गोपनीयता नीति",
    termsOfService: "सेवा की शर्तें",
    aboutUs: "हमारे बारे में",
    allRightsReserved: "सभी अधिकार सुरक्षित",

    // Language Toggle
    switchToHindi: "हिंदी",
    switchToEnglish: "English",

    // Herb Modal
    description: "विवरण",
    healthBenefits: "स्वास्थ्य लाभ",
    howToUse: "उपयोग की विधि",
    knowMore: "और जानें",
    clickToLearnMore: "और जानने के लिए क्लिक करें",

    // Detailed Herb Benefits
    tulsiBoostsImmunity: "प्रतिरक्षा प्रणाली को बढ़ाती है और संक्रमण से लड़ती है",
    tulsiReducesStress: "तनाव और चिंता के स्तर को कम करती है",
    tulsiImprovesRespiratory: "श्वसन स्वास्थ्य और सांस लेने में सुधार करती है",
    tulsiAntiInflammatory: "सूजन-रोधी गुण रखती है",
    tulsiRegulatesBloodSugar: "रक्त शर्करा के स्तर को नियंत्रित करने में मदद करती है",

    neemAntibacterial: "शक्तिशाली जीवाणुरोधी और कवकरोधी गुण",
    neemSkinHealth: "स्वस्थ त्वचा को बढ़ावा देता है और त्वचा की स्थितियों का इलाज करता है",
    neemDentalCare: "मौखिक स्वास्थ्य और दंत स्वच्छता का समर्थन करता है",
    neemBloodPurifier: "प्राकृतिक रक्त शुद्धकर्ता के रूप में कार्य करता है",
    neemPestControl: "प्राकृतिक कीट नियंत्रण और कीट प्रतिरोधी",

    ashwagandhaReducesStress: "कॉर्टिसोल के स्तर को कम करता है और तनाव का प्रबंधन करता है",
    ashwagandhaBoostsEnergy: "ऊर्जा के स्तर को बढ़ाता है और थकान कम करता है",
    ashwagandhaImprovesStrength: "शारीरिक शक्ति और मांसपेशियों को बढ़ाता है",
    ashwagandhaEnhancesCognition: "संज्ञानात्मक कार्य और फोकस में सुधार करता है",
    ashwagandhaBalancesHormones: "हार्मोन को प्राकृतिक रूप से संतुलित करने में मदद करता है",

    aloeVeraSkinHealing: "घाव भरने और त्वचा की मरम्मत को तेज़ करता है",
    aloeVeraDigestiveHealth: "पाचन स्वास्थ्य और आंत के उपचार का समर्थन करता है",
    aloeVeraAntiInflammatory: "सूजन कम करता है और जलन को शांत करता है",
    aloeVeraMoisturizing: "त्वचा के लिए गहरी नमी प्रदान करता है",
    aloeVeraWoundHealing: "कटने और जलने के तेज़ उपचार को बढ़ावा देता है",

    turmericAntiInflammatory: "शक्तिशाली सूजन-रोधी यौगिक करक्यूमिन",
    turmericAntioxidant: "एंटीऑक्सीडेंट से भरपूर जो मुक्त कणों से लड़ता है",
    turmericJointHealth: "जोड़ों के स्वास्थ्य का समर्थन करता है और गठिया के दर्द को कम करता है",
    turmericDigestiveAid: "पाचन में सहायता करता है और आंत के स्वास्थ्य में सुधार करता है",
    turmericImmuneSupport: "प्रतिरक्षा प्रणाली के कार्य को मजबूत करता है",

    brahmiEnhancesMemory: "स्मृति प्रतिधारण और याददाश्त में सुधार करती है",
    brahmiReducesAnxiety: "चिंता कम करती है और शांति को बढ़ावा देती है",
    brahmiImprovesConcentration: "फोकस और एकाग्रता बढ़ाती है",
    brahmiNeuroprotective: "मस्तिष्क कोशिकाओं को नुकसान से बचाती है",
    brahmiStressRelief: "प्राकृतिक तनाव राहत प्रदान करती है",

    // Shopping Section
    "buy-plants": "पौधे खरीदें",
    shopNow: "अभी खरीदारी करें",
    buyMedicinalPlants: "औषधीय पौधे खरीदें",
    buyPlantsDescription:
      "किफायती दामों पर ताज़े, जैविक औषधीय पौधे सीधे अपने घर पर मंगवाएं। सभी पौधों के साथ देखभाल के निर्देश और गुणवत्ता की गारंटी आती है।",
    shopMedicinalPlants: "औषधीय पौधों की खरीदारी करें",
    freeDelivery: "मुफ्त डिलीवरी",
    freeDeliveryDesc: "₹500 से अधिक के सभी ऑर्डर पर मुफ्त होम डिलीवरी",
    freshPlants: "ताज़े पौधे",
    freshPlantsDesc: "गुणवत्ता आश्वासन के साथ ताज़े उगाए गए जैविक पौधे",
    affordablePrices: "किफायती दाम",
    affordablePricesDesc: "प्रीमियम गुणवत्ता वाले औषधीय पौधों के लिए सबसे अच्छे दाम",
    qualityGuarantee: "गुणवत्ता की गारंटी",
    qualityGuaranteeDesc: "100% संतुष्टि की गारंटी या पैसे वापस",
    organicGrown: "जैविक रूप से उगाए गए",
    organicGrownDesc: "हानिकारक रसायन या कीटनाशकों के बिना प्राकृतिक रूप से उगाए गए",

    // Shop Page
    plantShop: "पौधों की दुकान",
    backToHome: "होम पर वापस जाएं",
    cart: "कार्ट",
    shopDescription:
      "औषधीय पौधों के हमारे प्रीमियम संग्रह की खोज करें, जो सावधानीपूर्वक उगाए गए हैं और पूर्ण देखभाल निर्देशों के साथ आपके दरवाज़े पर ताज़े पहुंचाए जाते हैं।",
    availablePlants: "उपलब्ध पौधे",
    availablePlantsDesc:
      "प्रामाणिक औषधीय पौधों के हमारे व्यापक चयन में से चुनें, प्रत्येक के साथ लाभ और देखभाल निर्देशों की विस्तृत जानकारी।",

    // Plant Details
    mediumPot: "मध्यम गमला (6 इंच)",
    largePot: "बड़ा गमला (8 इंच)",
    smallPot: "छोटा गमला (4 इंच)",
    off: "छूट",
    outOfStock: "स्टॉक में नहीं",
    addToCart: "कार्ट में जोड़ें",

    // Additional Plants
    mintPlant: "पुदीना का पौधा",
    mintBenefit: "पाचन में सहायता करता है और सांस को तरोताज़ा करता है",
    mintDigestive: "प्राकृतिक रूप से पाचन स्वास्थ्य में सुधार करता है",
    mintRefreshing: "प्राकृतिक ताज़गी और शीतलता प्रदान करता है",

    gingerPlant: "अदरक का पौधा",
    gingerBenefit: "मतली कम करता है और पाचन में सहायता करता है",
    gingerDigestive: "शक्तिशाली पाचन सहायक और पेट को शांत करने वाला",
    gingerAntiNausea: "मतली और मोशन सिकनेस के लिए प्राकृतिक उपचार",

    // Plant Scanner
    plantScanner: "पौधा स्कैनर",
    plantScannerDesc: "पौधे की छवि अपलोड करें और उसकी पहचान करके उसके औषधीय उपयोग के बारे में जानें",
    scanning: "स्कैनिंग...",
    scanPlant: "पौधा स्कैन करें",
    plantIdentified: "पौधा पहचाना गया",
    uses: "उपयोग",
    prototypeNote: "यह एक प्रोटोटाइप सुविधा है। परिणाम भिन्न हो सकते हैं।",

    // Symptom Filter
    symptomFilter: "लक्षण फिल्टर",
    symptomFilterDesc: "विशिष्ट स्वास्थ्य लक्षणों के साथ मदद करने वाले पौधे खोजें",
    enterSymptom: "अपना लक्षण दर्ज करें (जैसे, खांसी, बुखार, सिरदर्द)",
    commonSymptoms: "सामान्य लक्षण",
    search: "खोजें",
    searching: "खोज रहे हैं...",
    foundPlants: "पौधे मिले",
    availableInShop: "दुकान में उपलब्ध",
    noPlantsFound: "इस लक्षण के लिए कोई पौधे नहीं मिले",
    tryDifferentSymptom: "कोई अलग लक्षण या खोज शब्द आज़माएं",

    // Section Descriptions
    identifyPlants: "पौधों की पहचान करें",
    plantScannerSectionDesc: "किसी भी पौधे की तस्वीर अपलोड करें और तुरंत उसकी पहचान करके उसके औषधीय गुणों और पारंपरिक उपयोगों की खोज करें।",
    findPlantsForSymptoms: "अपने लक्षणों के लिए पौधे खोजें",
    symptomFilterSectionDesc: "खांसी, बुखार, सिरदर्द और अन्य विशिष्ट स्वास्थ्य स्थितियों में मदद करने वाले औषधीय पौधों की खोज करें।",
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")

  const t = (key: string): string => {
    return translations[language][key as keyof (typeof translations)[typeof language]] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
