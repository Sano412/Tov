import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusPill } from "@/components/ui/StatusPill";

const foundationItems = [
  "Public booking experience first",
  "Generic resource model later",
  "Warm dark design tokens",
];

export default function Home() {
  return (
    <main>
      <Header />

      <SectionShell className="pb-8 pt-8 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <GlassCard className="rounded-hero p-7 sm:p-10">
            <StatusPill>Phase 1 foundation</StatusPill>
            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[0.95] text-tovlo-text sm:text-7xl">
              Tovlo booking starts with karaoke rooms.
            </h1>
            <p className="mt-6 max-w-2xl text-base font-medium leading-[1.55] text-tovlo-muted sm:text-lg">
              A mobile-first public homepage foundation for a premium, friendly booking app. The MVP stays focused on karaoke while the product language remains ready for future reservable resources.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button>Explore placeholder</Button>
              <Button variant="ghost">View foundation</Button>
            </div>
          </GlassCard>

          <GlassCard className="grid content-between gap-8 bg-tovlo-surface2/70">
            <div>
              <StatusPill tone="neutral">No booking logic yet</StatusPill>
              <h2 className="mt-5 text-3xl font-black leading-[1.05] text-tovlo-text">
                Clean public surface only.
              </h2>
              <p className="mt-4 text-sm font-medium leading-[1.55] text-tovlo-muted sm:text-base">
                This page is only the user-facing foundation: header, hero placeholder, and MVP explanation. Business tools and platform controls belong in future separated routes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-3xl border border-tovlo-line/40 bg-tovlo-background/45 p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Accent
                </p>
                <p className="mt-2 text-xl font-black text-tovlo-text">Orange</p>
              </div>
              <div className="rounded-3xl border border-tovlo-line/40 bg-tovlo-background/45 p-4">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Theme
                </p>
                <p className="mt-2 text-xl font-black text-tovlo-text">Warm dark</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </SectionShell>

      <SectionShell
        className="pt-6"
        eyebrow="MVP"
        title="Karaoke first, generic underneath."
      >
        <div id="mvp" className="grid gap-4 md:grid-cols-3">
          {foundationItems.map((item) => (
            <GlassCard key={item} className="min-h-40">
              <div className="mb-8 h-12 w-12 rounded-2xl bg-gradient-to-br from-tovlo-orange to-tovlo-yellow shadow-glow" />
              <h3 className="text-xl font-black text-tovlo-text">{item}</h3>
              <p className="mt-3 text-sm font-medium leading-[1.55] text-tovlo-muted">
                Foundation copy and structure only. Detailed booking workflows will come in a later phase.
              </p>
            </GlassCard>
          ))}
        </div>
      </SectionShell>

      <SectionShell id="foundation" className="pb-16 pt-4">
        <GlassCard>
          <p className="text-sm font-black uppercase tracking-[0.12em] text-tovlo-yellow">
            Foundation boundary
          </p>
          <p className="mt-4 max-w-3xl text-lg font-medium leading-[1.55] text-tovlo-muted">
            Tovlo will grow through small phases. This first pass establishes the public visual base, shared UI primitives, and dark design tokens without adding data models, dashboards, payments, maps, reviews, or booking behavior.
          </p>
        </GlassCard>
      </SectionShell>
    </main>
  );
}
