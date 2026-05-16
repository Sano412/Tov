import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { getPublicDistricts, getPublicResources } from "@/lib/public-resources";

export default async function ResourcesPage() {
  const [districts, visibleResources] = await Promise.all([
    getPublicDistricts(),
    getPublicResources(24),
  ]);

  return (
    <main>
      <Header />

      <SectionShell className="pb-8 pt-8 sm:pt-14">
        <div className="max-w-3xl">
          <StatusPill>Public resources</StatusPill>
          <h1 className="mt-7 text-5xl font-black leading-[0.95] text-tovlo-text sm:text-7xl">
            Караоке өрөөнүүд.
          </h1>
          <p className="mt-6 text-base font-medium leading-[1.55] text-tovlo-muted sm:text-lg">
            Байршил, багтаамж, үнэ болон боломжит цагийн мэдээллээр өрөөгөө сонгоно. Өгөгдөл Prisma-аас уншигдаж, database хоосон үед mock fallback ашиглана.
          </p>
        </div>
      </SectionShell>

      <SectionShell className="pt-0">
        <GlassCard className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto]">
            <label className="rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Хайх
              </span>
              <input
                className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none placeholder:text-tovlo-muted/65"
                placeholder="Өрөө, салбар, дүүрэг"
                type="search"
              />
            </label>
            <label className="rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Дүүрэг
              </span>
              <select className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none">
                <option>Бүгд</option>
                {districts.map((district) => (
                  <option key={district}>{district}</option>
                ))}
              </select>
            </label>
            <label className="rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Багтаамж
              </span>
              <select className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none">
                <option>Бүгд</option>
                <option>4-6 хүн</option>
                <option>6-8 хүн</option>
                <option>10+ хүн</option>
              </select>
            </label>
            <label className="rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
              <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Үнэ
              </span>
              <select className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none">
                <option>Бүгд</option>
                <option>40,000₮ хүртэл</option>
                <option>40,000-60,000₮</option>
                <option>60,000₮ дээш</option>
              </select>
            </label>
            <label className="flex min-h-16 items-center gap-3 rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
              <input className="h-4 w-4 accent-tovlo-orange" type="checkbox" />
              <span className="text-sm font-black text-tovlo-text">Одоо боломжтой</span>
            </label>
          </div>
        </GlassCard>
      </SectionShell>

      <SectionShell className="pt-0">
        {visibleResources.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visibleResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <GlassCard className="text-center">
            <StatusPill tone="neutral">Empty</StatusPill>
            <h2 className="mt-5 text-3xl font-black text-tovlo-text">
              Тохирох өрөө олдсонгүй.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm font-medium leading-[1.55] text-tovlo-muted">
              Шүүлтүүрээ өөрчлөөд дахин хайж үзээрэй. Бодит хайлт дараагийн фазад нэмэгдэнэ.
            </p>
          </GlassCard>
        )}
      </SectionShell>
    </main>
  );
}
