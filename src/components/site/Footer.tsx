import { Link } from "@tanstack/react-router";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { services, COMPANY } from "@/lib/site-data";
import logoUrl from "@/assets/logo.png";

export function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="mt-16 border-t border-border bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2.5">
            <img
              src={logoUrl}
              alt="SB Consultants logo"
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 rounded-md object-contain"
            />
            <span className="font-display text-lg font-semibold">SB Consultants</span>
          </div>
          <p className="mt-3 text-sm text-primary-foreground/75">{t("footer.tagline")}</p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
            {t("footer.quick")}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              ["/", "nav.home"], ["/about", "nav.about"], ["/pricing", "nav.pricing"],
              ["/gr-updates", "nav.gr"], ["/pdf-books", "nav.books"], ["/contact", "nav.contact"],
            ].map(([to, key]) => (
              <li key={to}>
                <Link to={to} className="text-primary-foreground/75 hover:text-saffron">{t(key)}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
            {t("footer.servicesH")}
          </h4>
          <ul className="mt-4 space-y-2 text-sm">
            {services.slice(0, 7).map((s) => (
              <li key={s.slug}>
                <Link to="/services/$slug" params={{ slug: s.slug }} className="text-primary-foreground/75 hover:text-saffron">
                  {s.title[lang]}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-primary-foreground/90">
            {t("footer.contactH")}
          </h4>
          <ul className="mt-4 space-y-3 text-sm text-primary-foreground/80">
            <li className="flex gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /><span>{COMPANY.address}</span></li>
            <li className="flex gap-2.5"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /><a href={`tel:${COMPANY.phone}`} className="hover:text-saffron">{COMPANY.phone}</a></li>
            <li className="flex gap-2.5"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /><a href={`mailto:${COMPANY.email}`} className="hover:text-saffron">{COMPANY.email}</a></li>
            <li className="flex gap-2.5"><MessageCircle className="mt-0.5 h-4 w-4 shrink-0 text-saffron" /><a href={`https://wa.me/${COMPANY.whatsapp}`} target="_blank" rel="noreferrer" className="hover:text-saffron">WhatsApp</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-primary-foreground/65 sm:flex-row">
          <p>© {new Date().getFullYear()} SB Consultants. {t("footer.rights")}</p>
          <p>Designed for trustworthy government service delivery.</p>
        </div>
      </div>
    </footer>
  );
}
