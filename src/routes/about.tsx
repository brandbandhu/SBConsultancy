import { Layout } from "@/components/site/Layout";
import { PageHero } from "@/components/site/PageHero";
import { useI18n } from "@/lib/i18n";
import { ShieldCheck, Users, Heart, Target } from "lucide-react";

const createFileRoute = (_path: string) => (config: unknown) => config;

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — SB Consultants" },
      { name: "description", content: "SB Consultants is a trusted government document and E-Seva consultancy serving Maharashtra." },
      { property: "og:title", content: "About SB Consultants" },
      { property: "og:description", content: "Years of experience helping citizens with government documentation." },
    ],
  }),
  component: AboutPage,
});

export function AboutPage() {
  const { t } = useI18n();
  return (
    <Layout>
      <PageHero
        eyebrow="About us"
        title="A trustworthy partner for government documentation."
        subtitle="SB Consultants helps citizens, students and businesses navigate government paperwork with clarity, speed and security."
      />
      <section className="section">
        <div className="container-page grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-5 text-base leading-relaxed text-foreground/85">
            <p>
              For years, SB Consultants has supported families and businesses across Maharashtra in obtaining the government
              documents they need — quickly, accurately and without the runaround. From a first-time PAN application to
              multi-step land record corrections, we treat every file as if it were our own.
            </p>
            <p>
              Our trained team understands the practical realities of tehsil offices, revenue departments and online E-Seva portals.
              We combine that ground experience with secure digital tools so you can apply, upload and track every step from your phone.
            </p>
            <p>
              We are not affiliated with any government department. We are a private consultancy that prepares your documentation
              correctly the first time, files on your behalf where permitted, and delivers your approved certificates back to you online.
            </p>
          </div>
          <div className="grid gap-4">
            {[
              { icon: ShieldCheck, t: "Integrity first", d: "Transparent fees and clear timelines on every service." },
              { icon: Users, t: "People-friendly", d: "Bilingual support in English and Marathi for every customer." },
              { icon: Target, t: "Specialised", d: "Deep expertise in Maharashtra revenue and E-Seva systems." },
              { icon: Heart, t: "Client-first", d: "Dedicated support before, during and after document delivery." },
            ].map((v) => (
              <div key={v.t} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <v.icon className="h-6 w-6 text-secondary" />
                <h3 className="mt-3 font-display text-base font-semibold">{v.t}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
