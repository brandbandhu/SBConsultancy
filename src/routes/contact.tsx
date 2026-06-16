import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";
import { services, COMPANY } from "@/lib/site-data";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";
import { z } from "zod";

const createFileRoute = (_path: string) => (config: unknown) => config;

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — SB Consultants" },
      { name: "description", content: "Reach SB Consultants by phone, WhatsApp or email. We respond within hours on working days." },
      { property: "og:title", content: "Contact SB Consultants" },
      { property: "og:description", content: "Call, WhatsApp or send us a message." },
    ],
  }),
  component: ContactPage,
});

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(80),
  phone: z.string().trim().min(10, "Enter a valid phone number").max(15),
  email: z.string().trim().email("Enter a valid email").max(120),
  service: z.string().min(1, "Select a service"),
  message: z.string().trim().min(10, "Tell us a bit more").max(1000),
});

export function ContactPage() {
  const { t, lang } = useI18n();
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", message: "" });
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      toast.error(res.error.issues[0]?.message ?? "Please check the form");
      return;
    }
    setBusy(true);
    setTimeout(() => {
      toast.success("Thanks! We'll get back to you shortly.");
      setForm({ name: "", phone: "", email: "", service: "", message: "" });
      setBusy(false);
    }, 600);
  };

  return (
    <Layout>
      <PageHero eyebrow={t("nav.contact")} title={t("contact.title")} subtitle={t("contact.sub")} />

      <section className="section">
        <div className="container-page grid gap-10 lg:grid-cols-[3fr_2fr]">
          <form onSubmit={submit} className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="name" label={t("contact.name")}>
                <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              </Field>
              <Field id="phone" label={t("contact.phone")}>
                <Input id="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
              </Field>
              <Field id="email" label={t("contact.email")}>
                <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              </Field>
              <Field id="service" label={t("contact.serviceRequired")}>
                <Select value={form.service} onValueChange={(v) => setForm({ ...form, service: v })}>
                  <SelectTrigger id="service"><SelectValue placeholder="Select…" /></SelectTrigger>
                  <SelectContent>
                    {services.map((s) => <SelectItem key={s.slug} value={s.slug}>{s.title[lang]}</SelectItem>)}
                  </SelectContent>
                </Select>
              </Field>
            </div>
            <div className="mt-5">
              <Field id="message" label={t("contact.message")}>
                <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
              </Field>
            </div>
            <Button type="submit" disabled={busy} size="lg" className="mt-6 w-full bg-saffron text-saffron-foreground hover:bg-saffron/90 sm:w-auto">
              {busy ? "Sending…" : t("contact.send")}
            </Button>
          </form>

          <aside className="space-y-4">
            <ContactItem icon={Phone} label={t("contact.call")} value={COMPANY.phone} href={`tel:${COMPANY.phone}`} />
            <ContactItem icon={MessageCircle} label={t("contact.whatsapp")} value="Chat with us" href={`https://wa.me/${COMPANY.whatsapp}`} accent="success" />
            <ContactItem icon={Mail} label="Email" value={COMPANY.email} href={`mailto:${COMPANY.email}`} />
            <ContactItem icon={MapPin} label="Office" value={COMPANY.address} />

            <div className="overflow-hidden rounded-2xl border border-border">
              <iframe
                title="Office map"
                src="https://www.openstreetmap.org/export/embed.html?bbox=73.81%2C18.50%2C73.89%2C18.56&amp;layer=mapnik"
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </aside>
        </div>
      </section>
    </Layout>
  );
}

function Field({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-sm font-medium">{label}</Label>
      {children}
    </div>
  );
}

function ContactItem({
  icon: Icon, label, value, href, accent,
}: { icon: typeof Phone; label: string; value: string; href?: string; accent?: "success" }) {
  const inner = (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 shadow-soft transition-colors hover:border-secondary/30">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-lg ${accent === "success" ? "bg-success/15 text-success" : "bg-primary-soft text-primary"}`}>
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-words font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
  return href ? <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer">{inner}</a> : inner;
}
