import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, Languages, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { SearchDialog } from "./SearchDialog";
import logoUrl from "@/assets/logo.png";

const navItems = [
  { to: "/", key: "nav.home" },
  { to: "/about", key: "nav.about" },
  { to: "/services", key: "nav.services" },
  { to: "/gr-updates", key: "nav.gr" },
  { to: "/pdf-books", key: "nav.books" },
  { to: "/pricing", key: "nav.pricing" },
  { to: "/contact", key: "nav.contact" },
] as const;

export function Header() {
  const { t, lang, setLang } = useI18n();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src={logoUrl}
              alt="SB Consultants logo"
              width={56}
              height={56}
              className="h-14 w-14 shrink-0 object-contain"
            />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                activeProps={{ className: "text-primary bg-primary-soft" }}
                inactiveProps={{ className: "text-foreground/70 hover:text-primary hover:bg-muted" }}
                className="rounded-md px-3 py-2 text-sm font-medium transition-colors"
              >
                {t(n.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setSearch(true)} aria-label="Search">
              <Search className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLang(lang === "en" ? "mr" : "en")}
              className="hidden gap-1.5 sm:inline-flex"
              aria-label="Toggle language"
            >
              <Languages className="h-4 w-4" />
              {lang === "en" ? "मराठी" : "English"}
            </Button>
            <Link to="/auth" className="hidden sm:inline-flex">
              <Button variant="outline" size="sm">{t("nav.login")}</Button>
            </Link>
            <Link to="/apply" className="hidden sm:inline-flex">
              <Button size="sm" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                {t("cta.apply")}
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {open && (
          <div className="border-t border-border bg-background lg:hidden">
            <div className="container-page flex flex-col gap-1 py-3">
              {navItems.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  activeProps={{ className: "text-primary bg-primary-soft" }}
                  inactiveProps={{ className: "text-foreground/80" }}
                  className="rounded-md px-3 py-2.5 text-sm font-medium"
                  onClick={() => setOpen(false)}
                >
                  {t(n.key)}
                </Link>
              ))}
              <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                <Button variant="outline" size="sm" onClick={() => setLang(lang === "en" ? "mr" : "en")} className="gap-1.5">
                  <Languages className="h-4 w-4" />
                  {lang === "en" ? "मराठी" : "English"}
                </Button>
                <Link to="/auth" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm">{t("nav.login")}</Button>
                </Link>
                <Link to="/apply" onClick={() => setOpen(false)}>
                  <Button size="sm" className="bg-saffron text-saffron-foreground hover:bg-saffron/90">
                    {t("cta.apply")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
      <SearchDialog open={search} onOpenChange={setSearch} />
    </>
  );
}
