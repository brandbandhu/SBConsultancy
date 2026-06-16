import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useI18n } from "@/lib/i18n";
import { services, grUpdates, pdfBooks } from "@/lib/site-data";
import {
  ArrowRight, Search, ShieldCheck, FileCheck2, UserCheck, Download,
  Award, Lock, Clock, BadgeCheck, Phone, MessageCircle, IndianRupee,
  Calendar, BookOpen,
} from "lucide-react";
import { useState } from "react";
import { SearchDialog } from "@/components/site/SearchDialog";
import heroImg from "@/assets/hero-documents.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SB Consultants — Government Document & E-Seva Consultancy" },
      { name: "description", content: "Apply for PAN, Aadhaar, GST, 7/12 extract, income, domicile and caste certificates online. Trusted by thousands across Maharashtra." },
      { property: "og:title", content: "SB Consultants — Government Document Services" },
      { property: "og:description", content: "From application to approved document — government services made simple." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const { t, lang } = useI18n();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <Layout>
      {/* Hero */}
      <section className="hero-gradient text-primary-foreground">
        <div className="container-page grid items-center gap-10 py-14 md:py-20 lg:grid-cols-2">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
              <BadgeCheck className="h-3.5 w-3.5 text-saffron" />
              {t("hero.badge")}
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-[1.1] sm:text-5xl md:text-6xl">
              {t("hero.title")}
            </h1>
            <p className="mt-5 max-w-xl text-base text-primary-foreground/85 md:text-lg">
              {t("hero.subtitle")}
            </p>

            <button
              onClick={() => setSearchOpen(true)}
              className="mt-7 flex w-full max-w-xl items-center gap-3 rounded-xl border border-primary-foreground/15 bg-primary-foreground/10 px-4 py-3.5 text-left text-sm text-primary-foreground/80 backdrop-blur hover:bg-primary-foreground/15"
            >
              <Search className="h-4 w-4 shrink-0 text-saffron" />
              <span className="truncate">{t("hero.searchPlaceholder")}</span>
              <kbd className="ml-auto hidden rounded border border-primary-foreground/20 px-1.5 py-0.5 text-[10px] sm:inline-block">⌘K</kbd>
            </button>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/apply">
                <Button size="lg" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                  {t("cta.applyDoc")}
                  <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/services">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  {t("cta.viewServices")}
                </Button>
              </Link>
            </div>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-primary-foreground/15 pt-6 text-xs sm:text-sm">
              <div>
                <dt className="text-primary-foreground/60">12k+</dt>
                <dd className="mt-1 font-medium">{t("hero.stat1").replace("12,000+ ", "").replace("१२,०००+ ", "")}</dd>
              </div>
              <div>
                <dt className="text-primary-foreground/60">9</dt>
                <dd className="mt-1 font-medium">{t("hero.stat2").replace("9 ", "").replace("९ ", "")}</dd>
              </div>
              <div>
                <dt className="text-primary-foreground/60">100%</dt>
                <dd className="mt-1 font-medium">{t("hero.stat3").replace("100% ", "").replace("१००% ", "")}</dd>
              </div>
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-primary-foreground/5 blur-2xl" />
            <img
              src={heroImg}
              alt="Government documents with official seals and a fountain pen"
              width={1536} height={1024}
              className="relative rounded-2xl shadow-card"
            />
          </div>
        </div>
      </section>
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />

      {/* Popular Services */}
      <section className="section bg-surface">
        <div className="container-page">
          <SectionHeader title={t("section.popular.title")} subtitle={t("section.popular.sub")} action={<Link to="/services" className="text-sm font-medium text-secondary hover:text-primary">{t("common.viewAll")} →</Link>} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {services.slice(0, 8).map((s) => (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }}>
                <Card className="group h-full border-border p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-card">
                  <span className="inline-grid h-11 w-11 place-items-center rounded-lg bg-primary-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-base font-semibold text-foreground">{s.title[lang]}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{s.short[lang]}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3 text-xs">
                    <span className="font-medium text-secondary">₹{s.fee.toLocaleString("en-IN")}</span>
                    <span className="text-muted-foreground">{s.processingTime[lang]}</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="section">
        <div className="container-page">
          <SectionHeader title={t("section.how.title")} subtitle={t("section.how.sub")} />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FileCheck2, t: t("how.1.t"), d: t("how.1.d") },
              { icon: ShieldCheck, t: t("how.2.t"), d: t("how.2.d") },
              { icon: UserCheck, t: t("how.3.t"), d: t("how.3.d") },
              { icon: Download, t: t("how.4.t"), d: t("how.4.d") },
            ].map((step, i) => (
              <div key={i} className="relative rounded-2xl border border-border bg-card p-6 shadow-soft">
                <span className="absolute -top-3 left-6 inline-flex h-7 min-w-7 items-center justify-center rounded-full bg-saffron px-2 text-xs font-semibold text-saffron-foreground">
                  Step {i + 1}
                </span>
                <step.icon className="h-7 w-7 text-secondary" />
                <h3 className="mt-4 font-display text-base font-semibold">{step.t}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{step.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section bg-primary text-primary-foreground">
        <div className="container-page">
          <h2 className="max-w-2xl font-display text-3xl font-semibold sm:text-4xl">{t("section.why.title")}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Award, t: t("why.1.t"), d: t("why.1.d") },
              { icon: IndianRupee, t: t("why.2.t"), d: t("why.2.d") },
              { icon: Lock, t: t("why.3.t"), d: t("why.3.d") },
              { icon: Clock, t: t("why.4.t"), d: t("why.4.d") },
            ].map((item, i) => (
              <div key={i} className="rounded-2xl border border-primary-foreground/15 bg-primary-foreground/5 p-6">
                <item.icon className="h-7 w-7 text-saffron" />
                <h3 className="mt-4 font-display text-base font-semibold">{item.t}</h3>
                <p className="mt-1.5 text-sm text-primary-foreground/75">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GR + Books preview */}
      <section className="section bg-surface">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title={t("section.gr.title")} subtitle={t("section.gr.sub")} action={<Link to="/gr-updates" className="text-sm font-medium text-secondary hover:text-primary">{t("common.viewAll")} →</Link>} />
            <div className="mt-6 space-y-3">
              {grUpdates.slice(0, 4).map((g) => (
                <div key={g.id} className="flex items-start gap-4 rounded-xl border border-border bg-card p-4 shadow-soft">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <Calendar className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wider text-secondary">{g.department[lang]} · {new Date(g.date).toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                    <p className="mt-1 font-display text-sm font-semibold leading-snug text-foreground">{g.title[lang]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title={t("section.books.title")} subtitle={t("section.books.sub")} action={<Link to="/pdf-books" className="text-sm font-medium text-secondary hover:text-primary">{t("common.viewAll")} →</Link>} />
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {pdfBooks.slice(0, 4).map((b) => (
                <Card key={b.id} className="border-border p-4 shadow-soft">
                  <span className="inline-grid h-10 w-10 place-items-center rounded-lg bg-saffron/15 text-saffron">
                    <BookOpen className="h-4 w-4" />
                  </span>
                  <p className="mt-3 text-xs uppercase tracking-wider text-secondary">{b.category}</p>
                  <h3 className="mt-1 font-display text-sm font-semibold leading-snug text-foreground line-clamp-2">{b.title[lang]}</h3>
                  <p className="mt-3 text-sm font-semibold text-primary">₹{b.price}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section">
        <div className="container-page">
          <div className="overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-card md:p-12">
            <div className="grid items-center gap-8 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="font-display text-2xl font-semibold text-foreground md:text-3xl">{t("section.cta.title")}</h2>
                <p className="mt-2 max-w-xl text-muted-foreground">{t("section.cta.sub")}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="tel:+919876543210">
                  <Button size="lg" variant="outline" className="gap-2"><Phone className="h-4 w-4" />{t("contact.call")}</Button>
                </a>
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                  <Button size="lg" className="gap-2 bg-success text-success-foreground hover:bg-success/90">
                    <MessageCircle className="h-4 w-4" />{t("contact.whatsapp")}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4">
      <div className="min-w-0">
        <h2 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 max-w-2xl text-muted-foreground">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
