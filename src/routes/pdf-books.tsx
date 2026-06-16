import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { pdfBooks, documentList } from "@/lib/site-data";
import { Search, BookOpen, Download, CheckCircle2 } from "lucide-react";
import { useMemo, useState } from "react";

const createFileRoute = (_path: string) => (config: unknown) => config;

export const Route = createFileRoute("/pdf-books")({
  head: () => ({
    meta: [
      { title: "PDF Law Books — SB Consultants" },
      { name: "description", content: "Reference law books on land law, GST, civil procedure and RTI — available for instant download." },
      { property: "og:title", content: "PDF Law Books" },
      { property: "og:description", content: "Pay and download practitioner-grade law references." },
    ],
  }),
  component: BooksPage,
});

export function BooksPage() {
  const { t, lang } = useI18n();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const categories = useMemo(() => Array.from(new Set(pdfBooks.map((b) => b.category))), []);
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return pdfBooks.filter((b) => {
      if (cat !== "all" && b.category !== cat) return false;
      if (!s) return true;
      return `${b.title.en} ${b.title.mr} ${b.description.en} ${b.category}`.toLowerCase().includes(s);
    });
  }, [q, cat]);

  return (
    <Layout>
      <PageHero
        eyebrow={t("nav.books")}
        title="Practitioner-grade law books, instantly downloadable."
        subtitle="Curated PDF references on land law, GST, civil procedure and RTI — pay once, download anytime."
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

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {list.map((b) => (
              <Card key={b.id} className="flex h-full flex-col border-border p-6 shadow-soft">
                <span className="inline-grid h-12 w-12 place-items-center rounded-xl bg-saffron/15 text-saffron">
                  <BookOpen className="h-6 w-6" />
                </span>
                <p className="mt-4 text-xs uppercase tracking-wider text-secondary">{b.category} · {b.pages} pages</p>
                <h3 className="mt-1.5 font-display text-base font-semibold text-foreground">{b.title[lang]}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{b.description[lang]}</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
                  <span className="font-display text-lg font-semibold text-primary">₹{b.price}</span>
                  <Button size="sm" className="gap-1.5 bg-saffron text-saffron-foreground hover:bg-saffron/90">
                    <Download className="h-4 w-4" />{t("common.payDownload")}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Common document list reference */}
      <section className="section bg-surface">
        <div className="container-page">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Common Document Checklist</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            A quick reference list of documents typically requested across most government applications.
          </p>
          <div className="mt-8 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {documentList.map((d, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-lg border border-border bg-card px-4 py-3 text-sm">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                {d[lang]}
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
