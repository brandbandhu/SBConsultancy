import { Link } from "@/lib/router";
import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { services } from "@/lib/site-data";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const createFileRoute = (_path: string) => (config: unknown) => config;

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — SB Consultants" },
      { name: "description", content: "Transparent service fees for every government document we process. No hidden charges." },
      { property: "og:title", content: "Transparent Pricing — SB Consultants" },
      { property: "og:description", content: "Clear, flat service fees with no surprises." },
    ],
  }),
  component: PricingPage,
});

export function PricingPage() {
  const { t, lang } = useI18n();
  return (
    <Layout>
      <PageHero
        eyebrow={t("nav.pricing")}
        title="Transparent service fees."
        subtitle="Service charges shown below are SB Consultants processing fees. Statutory government fees, if any, are charged at actuals."
      />
      <section className="section">
        <div className="container-page">
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left">
                <tr>
                  <th className="px-5 py-4 font-display font-semibold">Service</th>
                  <th className="px-5 py-4 font-display font-semibold">Processing time</th>
                  <th className="px-5 py-4 text-right font-display font-semibold">Service fee</th>
                  <th className="px-5 py-4 text-right" />
                </tr>
              </thead>
              <tbody>
                {services.map((s) => (
                  <tr key={s.slug} className="border-t border-border">
                    <td className="px-5 py-4 font-medium text-foreground">{s.title[lang]}</td>
                    <td className="px-5 py-4 text-muted-foreground">{s.processingTime[lang]}</td>
                    <td className="px-5 py-4 text-right font-semibold text-primary">
                      {s.fee > 0 ? `₹${s.fee.toLocaleString("en-IN")}` : "On request"}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <Link to="/services/$slug" params={{ slug: s.slug }}>
                        <Button variant="ghost" size="sm" className="gap-1">View <ArrowRight className="h-3.5 w-3.5" /></Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Card className="mt-8 border-border bg-primary-soft/50 p-6">
            <h3 className="font-display text-lg font-semibold text-primary">What's included in every service</h3>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {[
                "Document review by an experienced consultant",
                "Affidavit and supporting paperwork drafting",
                "Online filing on government portals",
                "Real-time status tracking in your dashboard",
                "Final approved document delivered as PDF",
                "Bilingual customer support (English / मराठी)",
              ].map((x) => (
                <li key={x} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {x}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>
    </Layout>
  );
}
