import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from "@/components/ui/command";
import { services, grUpdates, pdfBooks } from "@/lib/site-data";
import { useI18n } from "@/lib/i18n";
import { FileText, ScrollText, BookOpen, IndianRupee } from "lucide-react";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const { lang, t } = useI18n();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const go = (to: string) => {
    onOpenChange(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder={t("hero.searchPlaceholder")} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading={t("nav.services")}>
          {services.map((s) => (
            <CommandItem key={s.slug} value={`${s.title.en} ${s.title.mr} ${s.short.en}`} onSelect={() => go(`/services/${s.slug}`)}>
              <FileText className="mr-2 h-4 w-4 text-secondary" />
              {s.title[lang]}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t("nav.gr")}>
          {grUpdates.map((g) => (
            <CommandItem key={g.id} value={`${g.title.en} ${g.title.mr}`} onSelect={() => go(`/gr-updates`)}>
              <ScrollText className="mr-2 h-4 w-4 text-secondary" />
              {g.title[lang]}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t("nav.books")}>
          {pdfBooks.map((b) => (
            <CommandItem key={b.id} value={`${b.title.en} ${b.title.mr}`} onSelect={() => go(`/pdf-books`)}>
              <BookOpen className="mr-2 h-4 w-4 text-secondary" />
              {b.title[lang]}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t("nav.pricing")}>
          <CommandItem onSelect={() => go("/pricing")}>
            <IndianRupee className="mr-2 h-4 w-4 text-secondary" />
            {t("nav.pricing")}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
