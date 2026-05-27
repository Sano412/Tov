import { Header } from "@/components/Header";
import { GlassCard } from "@/components/ui/GlassCard";
import type { ReactNode } from "react";

type DashboardShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  navItems: {
    label: string;
    href: string;
  }[];
  children: ReactNode;
};

export function DashboardShell({
  eyebrow,
  title,
  description,
  navItems,
  children,
}: DashboardShellProps) {
  return (
    <main className="page-shell">
      <Header />
      <section className="mx-auto w-full max-w-6xl px-5 pb-16 pt-8 sm:px-8 sm:pt-12">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <GlassCard className="bg-tovlo-glassStrong/10 p-5">
              <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                {eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-black leading-[1.05] text-tovlo-text">
                {title}
              </h1>
              <p className="mt-4 text-sm font-medium leading-[1.55] text-tovlo-muted">
                {description}
              </p>
              <nav className="mt-8 grid gap-2" aria-label={`${title} navigation`}>
                {navItems.map((item) => (
                  <a
                    className="rounded-3xl border border-tovlo-line/22 bg-tovlo-darker/35 px-4 py-3 text-sm font-black text-tovlo-muted/82 transition hover:border-tovlo-yellow/60 hover:bg-tovlo-glass/8 hover:text-tovlo-text"
                    href={item.href}
                    key={item.href}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </GlassCard>
          </aside>

          <div className="space-y-5">{children}</div>
        </div>
      </section>
    </main>
  );
}
