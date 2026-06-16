import {
  FileText, IdCard, CreditCard, Landmark, Home as HomeIcon,
  Receipt, Scroll, Users, FileBadge, type LucideIcon,
} from "lucide-react";

export interface Service {
  slug: string;
  icon: LucideIcon;
  title: { en: string; mr: string };
  short: { en: string; mr: string };
  description: { en: string; mr: string };
  processingTime: { en: string; mr: string };
  fee: number; // INR
  documents: { en: string; mr: string }[];
  faq: { q: { en: string; mr: string }; a: { en: string; mr: string } }[];
}

const faqGeneric = [
  {
    q: { en: "Is the application fully online?", mr: "अर्ज पूर्णपणे ऑनलाइन आहे का?" },
    a: { en: "Yes. You upload documents from your dashboard and we file with the government portal.", mr: "होय. तुम्ही तुमच्या डॅशबोर्डवरून दस्तऐवज अपलोड करता आणि आम्ही सरकारी पोर्टलवर दाखल करतो." },
  },
  {
    q: { en: "Can I track my application?", mr: "मी माझ्या अर्जाचा मागोवा घेऊ शकतो का?" },
    a: { en: "Yes. The customer dashboard shows real-time status: Pending, Under Review, Approved, Rejected or Completed.", mr: "होय. ग्राहक डॅशबोर्ड रिअल-टाइम स्थिती दर्शविते: प्रलंबित, पुनरावलोकनाधीन, मंजूर, नाकारलेले किंवा पूर्ण." },
  },
  {
    q: { en: "How will I get the final document?", mr: "मला अंतिम दस्तऐवज कसा मिळेल?" },
    a: { en: "Once approved, the final PDF is uploaded to your dashboard and is available to download instantly.", mr: "मंजुरीनंतर, अंतिम पीडीएफ तुमच्या डॅशबोर्डवर अपलोड केली जाते आणि त्वरित डाउनलोडसाठी उपलब्ध असते." },
  },
];

export const services: Service[] = [
  {
    slug: "gst-registration", icon: Receipt, fee: 1499,
    title: { en: "GST Registration", mr: "जीएसटी नोंदणी" },
    short: { en: "New GSTIN for proprietors, partnerships and companies.", mr: "व्यापारी, भागीदारी आणि कंपन्यांसाठी नवीन जीएसटीआयएन." },
    description: { en: "End-to-end GST registration including GSTIN allotment, OTP verification and digital certificate download.", mr: "जीएसटीआयएन वाटप, ओटीपी पडताळणी आणि डिजिटल प्रमाणपत्र डाउनलोडसह संपूर्ण जीएसटी नोंदणी." },
    processingTime: { en: "5–7 working days", mr: "५–७ कामकाजाचे दिवस" },
    documents: [
      { en: "PAN card of applicant", mr: "अर्जदाराचे पॅन कार्ड" },
      { en: "Aadhaar card", mr: "आधार कार्ड" },
      { en: "Address proof of business", mr: "व्यवसायाचा पत्ता पुरावा" },
      { en: "Passport-size photograph", mr: "पासपोर्ट साइज फोटो" },
      { en: "Bank account details / cancelled cheque", mr: "बँक खाते तपशील / रद्द केलेला चेक" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "aadhaar-services", icon: IdCard, fee: 199,
    title: { en: "Aadhaar Services", mr: "आधार सेवा" },
    short: { en: "Updates for address, mobile, name and date of birth.", mr: "पत्ता, मोबाइल, नाव आणि जन्मतारीख अद्यतने." },
    description: { en: "Assistance with Aadhaar enrolment, mobile/email linking and demographic corrections through authorised channels.", mr: "अधिकृत माध्यमांद्वारे आधार नोंदणी, मोबाइल/ईमेल लिंकिंग आणि जनसांख्यिकीय दुरुस्तीसाठी मदत." },
    processingTime: { en: "3–10 working days", mr: "३–१० कामकाजाचे दिवस" },
    documents: [
      { en: "Existing Aadhaar (if update)", mr: "विद्यमान आधार (अद्ययावत असल्यास)" },
      { en: "Proof of identity / address", mr: "ओळख / पत्त्याचा पुरावा" },
      { en: "Active mobile number", mr: "सक्रिय मोबाइल नंबर" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "pan-card", icon: CreditCard, fee: 399,
    title: { en: "PAN Card", mr: "पॅन कार्ड" },
    short: { en: "New PAN, corrections and reprint applications.", mr: "नवीन पॅन, दुरुस्ती आणि पुनर्मुद्रण अर्ज." },
    description: { en: "Apply for new PAN, link with Aadhaar, request corrections or reprint of damaged PAN cards.", mr: "नवीन पॅनसाठी अर्ज करा, आधारशी जोडा, खराब पॅन कार्डची दुरुस्ती किंवा पुनर्मुद्रणाची विनंती करा." },
    processingTime: { en: "7–10 working days", mr: "७–१० कामकाजाचे दिवस" },
    documents: [
      { en: "Aadhaar card", mr: "आधार कार्ड" },
      { en: "Date of birth proof", mr: "जन्मतारीख पुरावा" },
      { en: "Passport-size photograph", mr: "पासपोर्ट साइज फोटो" },
      { en: "Signature on white paper", mr: "पांढऱ्या कागदावर स्वाक्षरी" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "saat-baara-extract", icon: Landmark, fee: 299,
    title: { en: "7/12 Extract", mr: "७/१२ उतारा" },
    short: { en: "Official 7/12 extract of agricultural land records.", mr: "शेतजमिनीच्या अधिकृत ७/१२ उताऱ्याची प्रत." },
    description: { en: "Obtain certified 7/12 extracts (Saat-Baara) from the Mahabhulekh records with digital signature.", mr: "डिजिटल स्वाक्षरीसह महाभूलेखच्या नोंदीवरून प्रमाणित ७/१२ उतारा मिळवा." },
    processingTime: { en: "2–4 working days", mr: "२–४ कामकाजाचे दिवस" },
    documents: [
      { en: "Survey / Gat number", mr: "सर्व्हे / गट नंबर" },
      { en: "Village & taluka name", mr: "गाव व तालुक्याचे नाव" },
      { en: "Owner identity proof", mr: "मालकाचा ओळखीचा पुरावा" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "land-documents", icon: HomeIcon, fee: 999,
    title: { en: "Land Documents", mr: "जमीन दस्तऐवज" },
    short: { en: "Mutation, ferfar, property card and land related papers.", mr: "फेरफार, मालमत्ता पत्रक आणि जमीन संबंधित कागदपत्रे." },
    description: { en: "Assistance for mutation entries, ferfar updates, property card extracts and related land documentation.", mr: "फेरफार नोंदी, ​​फेरफार अद्यतने, मालमत्ता पत्रक उतारे आणि संबंधित जमीन कागदपत्रांसाठी मदत." },
    processingTime: { en: "7–15 working days", mr: "७–१५ कामकाजाचे दिवस" },
    documents: [
      { en: "Existing 7/12 extract", mr: "विद्यमान ७/१२ उतारा" },
      { en: "Sale deed / inheritance document", mr: "विक्री खत / वारसा दस्तऐवज" },
      { en: "Identity proof of applicant", mr: "अर्जदाराचा ओळखीचा पुरावा" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "income-certificate", icon: FileText, fee: 349,
    title: { en: "Income Certificate", mr: "उत्पन्न प्रमाणपत्र" },
    short: { en: "Tehsildar-issued income certificate for scholarships and schemes.", mr: "शिष्यवृत्ती व योजनांसाठी तहसीलदार जारी केलेले उत्पन्न प्रमाणपत्र." },
    description: { en: "We prepare the affidavit and supporting papers and file your income certificate application with the tehsil office.", mr: "आम्ही प्रतिज्ञापत्र आणि सहाय्यक कागदपत्रे तयार करतो आणि तहसील कार्यालयाकडे तुमचा उत्पन्न प्रमाणपत्र अर्ज दाखल करतो." },
    processingTime: { en: "10–15 working days", mr: "१०–१५ कामकाजाचे दिवस" },
    documents: [
      { en: "Aadhaar of applicant", mr: "अर्जदाराचे आधार" },
      { en: "Ration card", mr: "रेशन कार्ड" },
      { en: "Salary slip / income proof", mr: "वेतन स्लिप / उत्पन्न पुरावा" },
      { en: "Self-declaration affidavit", mr: "स्वयं-घोषणा प्रतिज्ञापत्र" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "domicile-certificate", icon: FileBadge, fee: 349,
    title: { en: "Domicile Certificate", mr: "अधिवास प्रमाणपत्र" },
    short: { en: "Maharashtra domicile certificate for residence proof.", mr: "निवासाच्या पुराव्यासाठी महाराष्ट्र अधिवास प्रमाणपत्र." },
    description: { en: "Filed through the SETU / Aaple Sarkar portal with all supporting documents and tehsil verification.", mr: "सर्व सहाय्यक दस्तऐवज आणि तहसील पडताळणीसह सेतू / आपले सरकार पोर्टलद्वारे दाखल केले." },
    processingTime: { en: "15–20 working days", mr: "१५–२० कामकाजाचे दिवस" },
    documents: [
      { en: "Aadhaar card", mr: "आधार कार्ड" },
      { en: "School leaving certificate", mr: "शाळा सोडल्याचा दाखला" },
      { en: "Residence proof (15+ years)", mr: "निवास पुरावा (१५+ वर्षे)" },
      { en: "Self-declaration affidavit", mr: "स्वयं-घोषणा प्रतिज्ञापत्र" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "caste-certificate", icon: Users, fee: 499,
    title: { en: "Caste Certificate", mr: "जात प्रमाणपत्र" },
    short: { en: "Caste certificate for SC/ST/OBC/VJNT and other categories.", mr: "अनुसूचित जाती/जमाती/ओबीसी/विजेएनटी व इतर श्रेणींसाठी जात प्रमाणपत्र." },
    description: { en: "Complete documentation, affidavits and tehsildar filing for caste certificates valid for education and government schemes.", mr: "शिक्षण व सरकारी योजनांसाठी वैध जात प्रमाणपत्रांसाठी संपूर्ण कागदपत्रे, प्रतिज्ञापत्रे आणि तहसीलदार दाखल करणे." },
    processingTime: { en: "21–30 working days", mr: "२१–३० कामकाजाचे दिवस" },
    documents: [
      { en: "Father's school leaving certificate", mr: "वडिलांचा शाळा सोडल्याचा दाखला" },
      { en: "Caste validity / proof", mr: "जात वैधता / पुरावा" },
      { en: "Aadhaar of applicant", mr: "अर्जदाराचे आधार" },
      { en: "Self-declaration affidavit", mr: "स्वयं-घोषणा प्रतिज्ञापत्र" },
    ],
    faq: faqGeneric,
  },
  {
    slug: "other-government", icon: Scroll, fee: 0,
    title: { en: "Other Government Documents", mr: "इतर सरकारी दस्तऐवज" },
    short: { en: "Senior citizen, EWS, non-creamy layer and more.", mr: "ज्येष्ठ नागरिक, ईडब्ल्यूएस, नॉन-क्रिमी लेयर आणि अधिक." },
    description: { en: "Contact us for any other E-Seva document not listed above. We handle a wide range of state and central applications.", mr: "वर सूचीबद्ध नसलेल्या इतर कोणत्याही ई-सेवा दस्तऐवजासाठी आमच्याशी संपर्क साधा. आम्ही राज्य व केंद्रीय अर्जांची विस्तृत श्रेणी हाताळतो." },
    processingTime: { en: "Varies by document", mr: "दस्तऐवजानुसार बदलते" },
    documents: [{ en: "Shared on request", mr: "विनंतीनुसार सामायिक" }],
    faq: faqGeneric,
  },
];

export interface GRItem {
  id: string;
  title: { en: string; mr: string };
  department: { en: string; mr: string };
  category: string;
  date: string; // ISO
  description: { en: string; mr: string };
}

export const grUpdates: GRItem[] = [
  {
    id: "gr-2026-001", category: "Revenue", date: "2026-06-02",
    department: { en: "Revenue Department", mr: "महसूल विभाग" },
    title: { en: "Digital signing of 7/12 extracts — updated procedure", mr: "७/१२ उताऱ्यांचे डिजिटल स्वाक्षरी — सुधारित कार्यपद्धती" },
    description: { en: "Revised SOP for issuance of digitally signed 7/12 extracts via Mahabhulekh portal.", mr: "महाभूलेख पोर्टलद्वारे डिजिटल स्वाक्षरीयुक्त ७/१२ उतारे जारी करण्यासाठी सुधारित SOP." },
  },
  {
    id: "gr-2026-002", category: "Social Welfare", date: "2026-05-21",
    department: { en: "Social Justice", mr: "सामाजिक न्याय" },
    title: { en: "Income limit revision for non-creamy layer certificate", mr: "नॉन-क्रिमी लेयर प्रमाणपत्रासाठी उत्पन्न मर्यादा सुधारणा" },
    description: { en: "Annual income ceiling revised for non-creamy layer eligibility in OBC reservations.", mr: "ओबीसी आरक्षणात नॉन-क्रिमी लेयर पात्रतेसाठी वार्षिक उत्पन्न मर्यादा सुधारित." },
  },
  {
    id: "gr-2026-003", category: "Revenue", date: "2026-05-10",
    department: { en: "Revenue Department", mr: "महसूल विभाग" },
    title: { en: "Online mutation entries — Ferfar e-mode rollout", mr: "ऑनलाइन फेरफार नोंदी — फेरफार ई-मोड अंमलबजावणी" },
    description: { en: "All mutation entries to be processed through e-Ferfar in remaining talukas from June 2026.", mr: "जून २०२६ पासून उर्वरित तालुक्यांमध्ये सर्व फेरफार नोंदी ई-फेरफारद्वारे प्रक्रिया केल्या जातील." },
  },
  {
    id: "gr-2026-004", category: "Taxation", date: "2026-04-18",
    department: { en: "GST Council", mr: "जीएसटी परिषद" },
    title: { en: "Simplified GST registration for small businesses", mr: "लहान व्यवसायांसाठी सोपी जीएसटी नोंदणी" },
    description: { en: "New guidelines reduce documentation requirements for proprietorship GST registration.", mr: "नवीन मार्गदर्शक तत्त्वे प्रोप्रायटरशिप जीएसटी नोंदणीसाठी कागदपत्रांची आवश्यकता कमी करतात." },
  },
  {
    id: "gr-2026-005", category: "Identity", date: "2026-03-30",
    department: { en: "UIDAI", mr: "यूआयडीएआय" },
    title: { en: "Mandatory biometric refresh for Aadhaar above 10 years", mr: "१० वर्षांपेक्षा जुन्या आधारसाठी अनिवार्य बायोमेट्रिक रीफ्रेश" },
    description: { en: "All residents whose Aadhaar was generated 10 or more years ago must update biometrics.", mr: "ज्यांचे आधार १० किंवा अधिक वर्षांपूर्वी तयार झाले आहे त्यांनी बायोमेट्रिक अद्यतनित करणे आवश्यक." },
  },
];

export interface PdfBook {
  id: string;
  title: { en: string; mr: string };
  category: string;
  description: { en: string; mr: string };
  price: number;
  pages: number;
}

export const pdfBooks: PdfBook[] = [
  {
    id: "book-mlrc", category: "Land Law", pages: 312, price: 299,
    title: { en: "Maharashtra Land Revenue Code — Practitioner Guide", mr: "महाराष्ट्र जमीन महसूल संहिता — व्यवसायिक मार्गदर्शक" },
    description: { en: "Annotated commentary with case laws and recent amendments.", mr: "केस लॉ आणि अलीकडील सुधारणांसह विवरण." },
  },
  {
    id: "book-gst", category: "Taxation", pages: 256, price: 349,
    title: { en: "GST Compliance Handbook 2026", mr: "जीएसटी अनुपालन हँडबुक २०२६" },
    description: { en: "Quick-reference forms, returns, due dates and notice handling.", mr: "त्वरित-संदर्भ फॉर्म, रिटर्न, देय तारखा आणि नोटीस हाताळणी." },
  },
  {
    id: "book-civil", category: "Civil Law", pages: 480, price: 449,
    title: { en: "Civil Procedure for Government Document Cases", mr: "सरकारी दस्तऐवज प्रकरणांसाठी नागरी कार्यपद्धती" },
    description: { en: "Step-by-step civil court procedure relevant to revenue and certificate matters.", mr: "महसूल आणि प्रमाणपत्र विषयांशी संबंधित न्यायालयीन कार्यपद्धती." },
  },
  {
    id: "book-rti", category: "Public Law", pages: 168, price: 199,
    title: { en: "Right to Information — Filing Manual", mr: "माहितीचा अधिकार — दाखल करण्याचे पुस्तिका" },
    description: { en: "Templates for RTI applications, first appeals and second appeals.", mr: "आरटीआय अर्ज, पहिल्या आवाहन आणि द्वितीय आवाहनासाठी टेम्पलेट्स." },
  },
];

export const documentList = [
  { en: "Aadhaar Card", mr: "आधार कार्ड" },
  { en: "PAN Card", mr: "पॅन कार्ड" },
  { en: "Voter ID", mr: "मतदार ओळखपत्र" },
  { en: "Passport-size Photo", mr: "पासपोर्ट साइज फोटो" },
  { en: "Ration Card", mr: "रेशन कार्ड" },
  { en: "Domicile Certificate", mr: "अधिवास प्रमाणपत्र" },
  { en: "Caste Certificate", mr: "जात प्रमाणपत्र" },
  { en: "Income Certificate", mr: "उत्पन्न प्रमाणपत्र" },
  { en: "School Leaving Certificate", mr: "शाळा सोडल्याचा दाखला" },
  { en: "Bank Passbook / Cancelled Cheque", mr: "बँक पासबुक / रद्द केलेला चेक" },
  { en: "Property Tax Receipt", mr: "मालमत्ता कर पावती" },
  { en: "Electricity Bill", mr: "वीज बिल" },
];

export const COMPANY = {
  name: "SB Consultants",
  phone: "+91 98765 43210",
  whatsapp: "919876543210",
  email: "support@sbconsultants.in",
  address: "Office No. 12, Civic Complex, Pune, Maharashtra 411001",
};
