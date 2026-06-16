import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, subtitle, children }: { eyebrow?: string; title: string; subtitle?: string; children?: ReactNode }) {
  return (
    <section className="hero-gradient text-primary-foreground">
      <div className="container-page py-16 md:py-20">
        {eyebrow && (
          <span className="inline-flex items-center rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs font-medium uppercase tracking-wider">
            {eyebrow}
          </span>
        )}
        <h1 className="mt-4 max-w-3xl font-display text-3xl font-semibold leading-tight sm:text-4xl md:text-5xl">
          {title}
        </h1>
        {subtitle && <p className="mt-4 max-w-2xl text-base text-primary-foreground/80 md:text-lg">{subtitle}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
