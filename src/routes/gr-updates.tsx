import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { grUpdates } from "@/lib/site-data";
import { Search, Calendar, Download, FileText } from "lucide-react";
import { useMemo, useState } from "react";

const createFileRoute = (_path: string) => (config: unknown) => config;

export const Route = createFileRoute("/gr-updates")({
  head: () => ({
    meta: [
      { title: "GR & Government Updates — SB Consultants" },
      { name: "description", content: "Latest Government Resolutions and circulars from Maharashtra and Central government departments." },
      { property: "og:title", content: "Government Resolutions & Updates" },
      { property: "og:description", content: "Searchable, filterable GR archive updated regularly." },
    ],
  }),
  component: GRPage,
});

export function GRPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const categories = useMemo(() => Array.from(new Set(grUpdates.map((g) => g.category))), []);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return grUpdates.filter((g) => {
      if (cat !== "all" && g.category !== cat) return false;
      if (!s) return true;
      return `${g.title.en} ${g.title.mr} ${g.description.en} ${g.department.en}`.toLowerCase().includes(s);
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [q, cat]);

  return (
    <Layout>
      <PageHero
        eyebrow={t("nav.gr")}
        title="Government Resolutions & Updates"
        subtitle="Stay current with circulars, notifications and procedural changes that affect your applications."
      />
      <section className="section">
        <div className="container-page">
          <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t("common.search")} className="pl-9" />
            </div>
            <Select value={cat} onValueChange={setCat}>
              <SelectTrigger><SelectValue placeholder={t("common.category")} /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.allCategories")}</SelectItem>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="mt-8 grid gap-4">
            {list.map((g) => (
              <Card key={g.id} className="border-border p-5 shadow-soft transition-all hover:border-secondary/30">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="rounded-full bg-primary-soft px-2.5 py-0.5 font-medium text-primary">{g.category}</span>
                      <span className="text-muted-foreground">{g.department[lang]}</span>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(g.date).toLocaleDateString(lang === "mr" ? "mr-IN" : "en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-base font-semibold text-foreground">{g.title[lang]}</h3>
                    <p className="mt-1.5 text-sm text-muted-foreground">{g.description[lang]}</p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <Button variant="outline" size="sm" className="gap-1.5"><FileText className="h-4 w-4" />View</Button>
                    <Button size="sm" className="gap-1.5"><Download className="h-4 w-4" />PDF</Button>
                  </div>
                </div>
              </Card>
            ))}
            {list.length === 0 && <p className="py-16 text-center text-muted-foreground">No GRs match your filters.</p>}
          </div>
        </div>
      </section>
    </Layout>
  );
}
