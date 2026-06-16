import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "mr";

type Dict = Record<string, { en: string; mr: string }>;

export const dict: Dict = {
  "nav.home": { en: "Home", mr: "मुख्यपृष्ठ" },
  "nav.about": { en: "About", mr: "आमच्याबद्दल" },
  "nav.services": { en: "Services", mr: "सेवा" },
  "nav.gr": { en: "GR Updates", mr: "जीआर अपडेट्स" },
  "nav.books": { en: "PDF Law Books", mr: "पीडीएफ कायदा पुस्तके" },
  "nav.pricing": { en: "Pricing", mr: "किंमत" },
  "nav.contact": { en: "Contact", mr: "संपर्क" },
  "nav.login": { en: "Login", mr: "लॉगिन" },
  "cta.apply": { en: "Apply Now", mr: "आता अर्ज करा" },
  "cta.viewServices": { en: "View Services", mr: "सेवा पहा" },
  "cta.applyDoc": { en: "Apply for Document", mr: "दस्तऐवजासाठी अर्ज करा" },
  "cta.learnMore": { en: "Learn more", mr: "अधिक जाणून घ्या" },

  "hero.badge": { en: "Trusted government document partner", mr: "विश्वासू सरकारी दस्तऐवज भागीदार" },
  "hero.title": { en: "Government documents, made simple.", mr: "सरकारी दस्तऐवज, सोपे केले." },
  "hero.subtitle": {
    en: "From PAN, Aadhaar and GST to 7/12 extracts and certificates — SB Consultants helps you apply, track and receive every document online.",
    mr: "पॅन, आधार आणि जीएसटी पासून ७/१२ उतारा आणि प्रमाणपत्रांपर्यंत — एसबी कन्सल्टंट्स तुम्हाला प्रत्येक दस्तऐवजासाठी ऑनलाइन अर्ज करण्यास, मागोवा घेण्यास आणि प्राप्त करण्यास मदत करते.",
  },
  "hero.searchPlaceholder": { en: "Search services, documents, GRs, books…", mr: "सेवा, दस्तऐवज, जीआर, पुस्तके शोधा…" },
  "hero.stat1": { en: "12,000+ applications processed", mr: "१२,०००+ अर्ज प्रक्रिया केले" },
  "hero.stat2": { en: "9 government services", mr: "९ सरकारी सेवा" },
  "hero.stat3": { en: "100% online & secure", mr: "१००% ऑनलाइन व सुरक्षित" },

  "section.popular.title": { en: "Popular Services", mr: "लोकप्रिय सेवा" },
  "section.popular.sub": { en: "The most-requested government documents we process every day.", mr: "आम्ही दररोज प्रक्रिया करतो सर्वाधिक मागणी असलेले सरकारी दस्तऐवज." },

  "section.how.title": { en: "How it works", mr: "हे कसे कार्य करते" },
  "section.how.sub": { en: "Four simple steps from application to approved document.", mr: "अर्जापासून मंजूर दस्तऐवजापर्यंत चार सोपे टप्पे." },
  "how.1.t": { en: "Select Service", mr: "सेवा निवडा" },
  "how.1.d": { en: "Browse all services and pick the document you need.", mr: "सर्व सेवा पाहा आणि आवश्यक दस्तऐवज निवडा." },
  "how.2.t": { en: "Upload Documents", mr: "दस्तऐवज अपलोड करा" },
  "how.2.d": { en: "Upload your KYC and supporting files securely.", mr: "तुमची केवायसी आणि सहाय्यक फायली सुरक्षितपणे अपलोड करा." },
  "how.3.t": { en: "Admin Verification", mr: "अ‍ॅडमिन पडताळणी" },
  "how.3.d": { en: "Our team verifies your documents and files the application.", mr: "आमची टीम तुमचे दस्तऐवज तपासते आणि अर्ज दाखल करते." },
  "how.4.t": { en: "Get Approved", mr: "मंजुरी मिळवा" },
  "how.4.d": { en: "Download your approved document from your dashboard.", mr: "तुमच्या डॅशबोर्डवरून मंजूर दस्तऐवज डाउनलोड करा." },

  "section.why.title": { en: "Why choose SB Consultants", mr: "एसबी कन्सल्टंट्स का निवडावे" },
  "why.1.t": { en: "Government-trained team", mr: "सरकारी प्रशिक्षित टीम" },
  "why.1.d": { en: "Years of experience filing E-Seva applications across Maharashtra.", mr: "महाराष्ट्रभर ई-सेवा अर्ज दाखल करण्याचा वर्षांचा अनुभव." },
  "why.2.t": { en: "Transparent pricing", mr: "पारदर्शक किंमत" },
  "why.2.d": { en: "Clear service fees with no hidden charges, ever.", mr: "स्पष्ट सेवा शुल्क, कधीही लपलेले शुल्क नाही." },
  "why.3.t": { en: "Secure document handling", mr: "सुरक्षित दस्तऐवज हाताळणी" },
  "why.3.d": { en: "Encrypted storage and strict access controls for your KYC.", mr: "तुमच्या केवायसीसाठी एन्क्रिप्टेड स्टोरेज आणि कठोर नियंत्रण." },
  "why.4.t": { en: "Real-time status", mr: "रिअल-टाइम स्थिती" },
  "why.4.d": { en: "Track every application from pending to approved in one dashboard.", mr: "एका डॅशबोर्डमध्ये प्रत्येक अर्जाचा मागोवा घ्या." },

  "section.gr.title": { en: "Latest GR & Government Updates", mr: "नवीनतम जीआर व सरकारी अपडेट्स" },
  "section.gr.sub": { en: "Government Resolutions and circulars, updated regularly.", mr: "नियमितपणे अद्ययावत सरकारी ठराव आणि परिपत्रके." },
  "section.books.title": { en: "PDF Law Books", mr: "पीडीएफ कायदा पुस्तके" },
  "section.books.sub": { en: "Reference law books available for instant download.", mr: "त्वरित डाउनलोडसाठी संदर्भ कायदा पुस्तके." },

  "section.cta.title": { en: "Have questions about a document?", mr: "दस्तऐवजाबद्दल प्रश्न आहेत?" },
  "section.cta.sub": { en: "Talk to our consultants on WhatsApp or call us directly.", mr: "व्हॉट्सअ‍ॅपवर आमच्या सल्लागारांशी बोला किंवा थेट कॉल करा." },

  "footer.tagline": { en: "Government document & E-Seva consultancy", mr: "सरकारी दस्तऐवज व ई-सेवा सल्लागार" },
  "footer.quick": { en: "Quick Links", mr: "द्रुत दुवे" },
  "footer.servicesH": { en: "Services", mr: "सेवा" },
  "footer.contactH": { en: "Contact", mr: "संपर्क" },
  "footer.rights": { en: "All rights reserved.", mr: "सर्व हक्क राखीव." },

  "common.viewAll": { en: "View all", mr: "सर्व पहा" },
  "common.download": { en: "Download", mr: "डाउनलोड" },
  "common.payDownload": { en: "Pay & Download", mr: "पैसे द्या व डाउनलोड करा" },
  "common.processingTime": { en: "Processing time", mr: "प्रक्रिया वेळ" },
  "common.govtFees": { en: "Service fee", mr: "सेवा शुल्क" },
  "common.required": { en: "Required documents", mr: "आवश्यक दस्तऐवज" },
  "common.faq": { en: "Frequently asked questions", mr: "वारंवार विचारले जाणारे प्रश्न" },
  "common.search": { en: "Search", mr: "शोध" },
  "common.category": { en: "Category", mr: "श्रेणी" },
  "common.date": { en: "Date", mr: "तारीख" },
  "common.price": { en: "Price", mr: "किंमत" },
  "common.allCategories": { en: "All categories", mr: "सर्व श्रेणी" },

  "contact.title": { en: "Get in touch", mr: "संपर्क साधा" },
  "contact.sub": { en: "We typically respond within a few hours on working days.", mr: "कामकाजाच्या दिवशी आम्ही सहसा काही तासांत प्रतिसाद देतो." },
  "contact.name": { en: "Full name", mr: "पूर्ण नाव" },
  "contact.phone": { en: "Phone number", mr: "फोन नंबर" },
  "contact.email": { en: "Email", mr: "ईमेल" },
  "contact.serviceRequired": { en: "Service required", mr: "आवश्यक सेवा" },
  "contact.message": { en: "Message", mr: "संदेश" },
  "contact.send": { en: "Send message", mr: "संदेश पाठवा" },
  "contact.call": { en: "Call us", mr: "आम्हाला कॉल करा" },
  "contact.whatsapp": { en: "WhatsApp", mr: "व्हॉट्सअ‍ॅप" },

  "auth.signin": { en: "Sign in to your account", mr: "तुमच्या खात्यात साइन इन करा" },
  "auth.signup": { en: "Create your account", mr: "तुमचे खाते तयार करा" },
  "auth.continue": { en: "Continue", mr: "सुरू ठेवा" },
  "auth.noAccount": { en: "Don't have an account?", mr: "खाते नाही?" },
  "auth.hasAccount": { en: "Already have an account?", mr: "आधीच खाते आहे?" },
  "auth.phase2": { en: "Customer accounts launch in our next release. Leave your details and we'll notify you.", mr: "ग्राहक खाती आमच्या पुढील आवृत्तीत सुरू होतील. तपशील द्या, आम्ही कळवू." },
};

interface I18nCtx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: keyof typeof dict | string) => string;
}

const Ctx = createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("sb_lang") as Lang | null) : null;
    if (saved === "en" || saved === "mr") setLangState(saved);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("sb_lang", l);
  };

  const t = (key: string) => {
    const entry = (dict as Record<string, { en: string; mr: string }>)[key];
    return entry ? entry[lang] : key;
  };

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
