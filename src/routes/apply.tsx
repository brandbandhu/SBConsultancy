import { createFileRoute, Link } from "@tanstack/react-router";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { services } from "@/lib/site-data";

export const Route = createFileRoute("/apply")({
  head: () => ({
    meta: [
      { title: "Apply for a Document — SB Consultants" },
      { name: "description", content: "Start your government document application with SB Consultants." },
    ],
  }),
  component: ApplyPage,
});

function ApplyPage() {
  const { t, lang } = useI18n();
  return (
    <Layout>
      <PageHero eyebrow={t("cta.apply")} title="Pick the document you need to apply for." subtitle="Tap a service to view requirements, fees and start your application." />
      <section className="section">
        <div className="container-page">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <Link key={s.slug} to="/services/$slug" params={{ slug: s.slug }}>
                <div className="group flex h-full items-start gap-4 rounded-2xl border border-border bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:border-secondary/30 hover:shadow-card">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-soft text-primary">
                    <s.icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-display text-base font-semibold">{s.title[lang]}</h3>
                    <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{s.short[lang]}</p>
                    <p className="mt-2 text-xs text-secondary">{s.fee > 0 ? `₹${s.fee.toLocaleString("en-IN")}` : "On request"} · {s.processingTime[lang]}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10 rounded-2xl border border-border bg-surface p-6 text-center">
            <p className="text-sm text-muted-foreground">Online application + document upload launches with the customer dashboard in our next release.</p>
            <Link to="/contact" className="mt-3 inline-block">
              <Button variant="outline">Talk to a consultant</Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
