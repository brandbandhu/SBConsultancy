import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/lib/i18n";
import { services } from "@/lib/site-data";
import { ArrowRight, CheckCircle2, Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — SB Consultants" },
      { name: "description", content: "Browse all government document services: GST, Aadhaar, PAN, 7/12 extract, income, domicile, caste and more." },
      { property: "og:title", content: "Government Document Services" },
      { property: "og:description", content: "Apply online for all major E-Seva documents." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return services;
    return services.filter((sv) =>
      `${sv.title.en} ${sv.title.mr} ${sv.short.en} ${sv.short.mr}`.toLowerCase().includes(s)
    );
  }, [q]);

  return (
    <Layout>
      <PageHero
        eyebrow={t("nav.services")}
        title="All government document services in one place."
        subtitle="Select a service to view requirements, processing time, fees and start your application."
      >
        <div className="relative max-w-xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-primary-foreground/60" />
          <Input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder={t("common.search")}
            className="border-primary-foreground/20 bg-primary-foreground/10 pl-9 text-primary-foreground placeholder:text-primary-foreground/55"
          />
        </div>
      </PageHero>

      <section className="section">
        <div className="container-page">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((s) => (
              <Card key={s.slug} className="flex h-full flex-col border-border p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-card">
                <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-primary-soft text-primary">
                  <s.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-lg font-semibold">{s.title[lang]}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.short[lang]}</p>
                <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span>{t("common.processingTime")}: <span className="font-medium text-foreground">{s.processingTime[lang]}</span></span>
                  <span>{t("common.govtFees")}: <span className="font-medium text-secondary">₹{s.fee.toLocaleString("en-IN")}</span></span>
                </div>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                    Documents required
                  </p>
                  <ul className="mt-3 space-y-2">
                    {s.documents.slice(0, 4).map((doc) => (
                      <li key={doc.en} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                        <span>{doc[lang]}</span>
                      </li>
                    ))}
                  </ul>
                  {s.documents.length > 4 && (
                    <p className="mt-2 text-xs font-medium text-secondary">
                      +{s.documents.length - 4} more on detail page
                    </p>
                  )}
                </div>
                <div className="mt-auto pt-5">
                  <Link to="/services/$slug" params={{ slug: s.slug }}>
                    <Button variant="outline" className="w-full justify-between">
                      {t("cta.learnMore")} <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          {list.length === 0 && (
            <p className="py-16 text-center text-muted-foreground">No services match your search.</p>
          )}
        </div>
      </section>
    </Layout>
  );
}
