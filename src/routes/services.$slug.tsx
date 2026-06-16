import { Link } from "@/lib/router";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useI18n } from "@/lib/i18n";
import { services, type Service } from "@/lib/site-data";
import { ArrowRight, CheckCircle2, Clock, IndianRupee, FileText, Upload } from "lucide-react";

const createFileRoute = (_path: string) => (config: unknown) => config;
const notFound = () => new Error("Not found");

const documentDetails: Record<
  string,
  {
    intro: string;
    sections: { title: string; items: string[] }[];
    note: string;
  }
> = {
  "gst-registration": {
    intro: "Keep scanned copies of the following documents ready before starting GST registration.",
    sections: [
      {
        title: "Applicant and owner documents",
        items: [
          "PAN card of proprietor / company / firm",
          "Aadhaar card of proprietor, partners or directors",
          "Passport-size photo of proprietor, partners or directors",
          "Mobile number and email ID linked with Aadhaar",
        ],
      },
      {
        title: "Business documents",
        items: [
          "Business address proof such as electricity bill, property tax receipt or rent agreement",
          "NOC from owner if the premises are rented",
          "Bank passbook, bank statement or cancelled cheque",
          "Partnership deed / incorporation certificate, if applicable",
          "Board resolution or authorization letter for companies, if applicable",
        ],
      },
    ],
    note: "Additional documents may be required depending on business type and GST officer verification.",
  },
  "aadhaar-services": {
    intro: "Aadhaar document requirements change based on the update requested.",
    sections: [
      {
        title: "For address update",
        items: [
          "Existing Aadhaar number or Aadhaar copy",
          "Valid address proof such as electricity bill, bank passbook, ration card, passport or rent agreement",
          "Active mobile number for OTP verification",
        ],
      },
      {
        title: "For name, date of birth or gender update",
        items: [
          "Existing Aadhaar copy",
          "Proof of identity such as PAN card, passport, voter ID or driving licence",
          "Date of birth proof such as birth certificate, school leaving certificate or passport",
          "Supporting gazette / marriage certificate if name change is due to marriage or legal change",
        ],
      },
    ],
    note: "Biometric updates may require the applicant to visit an authorised Aadhaar centre in person.",
  },
  "pan-card": {
    intro: "These documents are required for new PAN, correction and reprint applications.",
    sections: [
      {
        title: "Identity and date of birth proof",
        items: [
          "Aadhaar card",
          "Date of birth proof such as birth certificate, school leaving certificate, passport or Aadhaar",
          "Existing PAN card copy for correction or reprint cases",
          "Proof supporting correction, such as Aadhaar, gazette, marriage certificate or passport",
        ],
      },
      {
        title: "Photo and signature",
        items: [
          "Recent passport-size photograph",
          "Signature on plain white paper",
          "Parent details as per official records",
          "Active mobile number and email ID",
        ],
      },
    ],
    note: "The name and date of birth should match Aadhaar or the selected supporting document.",
  },
  "saat-baara-extract": {
    intro: "For 7/12 extract, accurate land details are more important than a long document list.",
    sections: [
      {
        title: "Land identification details",
        items: [
          "District, taluka and village name",
          "Survey number / Gat number",
          "Owner name as recorded in land records",
          "Old 7/12 extract copy, if available",
        ],
      },
      {
        title: "Applicant details",
        items: [
          "Applicant Aadhaar card or identity proof",
          "Mobile number for status updates",
          "Purpose of extract, such as loan, sale, legal work or personal record",
        ],
      },
    ],
    note: "If land details are unclear, we may ask for village or owner reference details before filing.",
  },
  "land-documents": {
    intro: "Land document services vary by case, but these are the common requirements.",
    sections: [
      {
        title: "Basic land papers",
        items: [
          "Existing 7/12 extract or property card",
          "Mutation / ferfar entry copy, if available",
          "Sale deed, gift deed, partition deed or inheritance document",
          "Index II or registration receipt, where applicable",
        ],
      },
      {
        title: "Applicant and supporting proof",
        items: [
          "Aadhaar card or PAN card of applicant",
          "Death certificate and legal heir documents for inheritance cases",
          "No objection certificate from family members, if required",
          "Property tax receipt or village record reference, if available",
        ],
      },
    ],
    note: "Land cases can require extra papers after revenue office scrutiny.",
  },
  "income-certificate": {
    intro: "Income certificate applications need proof of family identity, residence and income.",
    sections: [
      {
        title: "Applicant and family documents",
        items: [
          "Aadhaar card of applicant",
          "Ration card or family details",
          "Passport-size photograph",
          "Residence proof such as electricity bill, rent agreement or ration card",
        ],
      },
      {
        title: "Income proof",
        items: [
          "Salary slip or employer certificate for salaried applicants",
          "Income tax return, Form 16 or bank statement, if available",
          "Self-declaration affidavit",
          "Talathi / local authority report, if required",
        ],
      },
    ],
    note: "For students, parent or guardian income documents are usually required.",
  },
  "domicile-certificate": {
    intro: "Domicile certificate requires proof that the applicant has been residing in Maharashtra.",
    sections: [
      {
        title: "Identity and birth / education proof",
        items: [
          "Aadhaar card",
          "School leaving certificate or birth certificate",
          "Passport-size photograph",
          "Parent domicile or school record for minor applicants, if applicable",
        ],
      },
      {
        title: "Residence proof",
        items: [
          "Residence proof for the required period, such as electricity bills, ration card or property records",
          "Self-declaration affidavit",
          "Ration card or family details",
          "Talathi / local authority report, if required",
        ],
      },
    ],
    note: "The exact residence period proof can vary by local office and applicant category.",
  },
  "caste-certificate": {
    intro: "Caste certificate applications depend heavily on family and ancestral records.",
    sections: [
      {
        title: "Applicant documents",
        items: [
          "Aadhaar card of applicant",
          "School leaving certificate of applicant",
          "Passport-size photograph",
          "Residence proof",
          "Self-declaration affidavit",
        ],
      },
      {
        title: "Family caste proof",
        items: [
          "Father's school leaving certificate showing caste",
          "Caste certificate of father / brother / close blood relative, if available",
          "Caste validity certificate, if available",
          "Old revenue, school or village record showing caste, if required",
        ],
      },
    ],
    note: "Caste cases may require additional verification documents depending on category and family records.",
  },
  "other-government": {
    intro: "Document requirements depend on the certificate or government application you need.",
    sections: [
      {
        title: "Common documents",
        items: [
          "Aadhaar card",
          "PAN card, voter ID or other identity proof",
          "Passport-size photograph",
          "Address proof",
          "Mobile number and email ID",
        ],
      },
      {
        title: "Service-specific documents",
        items: [
          "Income proof for EWS or non-creamy layer services",
          "Age proof for senior citizen certificate",
          "School or family records for social welfare certificates",
          "Any old certificate or rejection copy, if applying for correction or renewal",
        ],
      },
    ],
    note: "Contact us with the exact document name and we will confirm the checklist before filing.",
  },
};

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => ({
    meta: loaderData
      ? [
          { title: `${loaderData.service.title.en} — SB Consultants` },
          { name: "description", content: loaderData.service.short.en },
          { property: "og:title", content: `${loaderData.service.title.en} — SB Consultants` },
          { property: "og:description", content: loaderData.service.short.en },
        ]
      : [],
  }),
  notFoundComponent: () => (
    <Layout>
      <div className="container-page py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-secondary">Back to services →</Link>
      </div>
    </Layout>
  ),
  component: ServiceDetailPage,
});

export function ServiceDetailPage({ service }: { service: Service }) {
  const { t, lang } = useI18n();
  const details = documentDetails[service.slug];

  return (
    <Layout>
      <section className="hero-gradient text-primary-foreground">
        <div className="container-page py-14 md:py-16">
          <Link to="/services" className="text-xs uppercase tracking-wider text-primary-foreground/70 hover:text-saffron">
            ← {t("nav.services")}
          </Link>
          <div className="mt-4 flex flex-wrap items-start gap-6 md:gap-10">
            <span className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl bg-primary-foreground/10 text-saffron">
              <service.icon className="h-8 w-8" />
            </span>
            <div className="min-w-0 flex-1">
              <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">{service.title[lang]}</h1>
              <p className="mt-3 max-w-2xl text-primary-foreground/85">{service.description[lang]}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-10">
            <div>
              <h2 className="flex items-center gap-2 font-display text-xl font-semibold">
                <FileText className="h-5 w-5 text-secondary" />
                Documents required for {service.title[lang]}
              </h2>
              {details ? (
                <>
                  <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{details.intro}</p>
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {details.sections.map((section) => (
                      <div key={section.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                        <h3 className="font-display text-base font-semibold text-foreground">{section.title}</h3>
                        <ul className="mt-4 space-y-3">
                          {section.items.map((item) => (
                            <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 rounded-lg border border-secondary/20 bg-secondary/5 p-3 text-sm text-muted-foreground">
                    {details.note}
                  </p>
                </>
              ) : (
                <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                  {service.documents.map((d: { en: string; mr: string }, i: number) => (
                    <li key={i} className="flex items-start gap-2.5 rounded-lg border border-border bg-card p-3 text-sm">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{d[lang]}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="font-display text-xl font-semibold">{t("common.faq")}</h2>
              <Accordion type="single" collapsible className="mt-4">
                {service.faq.map((f: { q: { en: string; mr: string }; a: { en: string; mr: string } }, i: number) => (
                  <AccordionItem key={i} value={`q${i}`}>
                    <AccordionTrigger className="text-left">{f.q[lang]}</AccordionTrigger>
                    <AccordionContent>{f.a[lang]}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <span className="text-sm text-muted-foreground">{t("common.govtFees")}</span>
                <span className="font-display text-2xl font-semibold text-primary">
                  {service.fee > 0 ? `₹${service.fee.toLocaleString("en-IN")}` : "On request"}
                </span>
              </div>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-center gap-2"><Clock className="h-4 w-4 text-secondary" /> {service.processingTime[lang]}</li>
                <li className="flex items-center gap-2"><IndianRupee className="h-4 w-4 text-secondary" /> Transparent pricing</li>
                <li className="flex items-center gap-2"><Upload className="h-4 w-4 text-secondary" /> Secure document upload</li>
              </ul>
              <Link to="/apply" className="mt-5 block">
                <Button className="w-full bg-saffron text-saffron-foreground hover:bg-saffron/90">
                  {t("cta.apply")} <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/auth" className="mt-2 block">
                <Button variant="outline" className="w-full">Login to upload documents</Button>
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}
