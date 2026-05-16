import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatPrice } from "@/lib/format";
import {
  getPublicResourceBySlug,
  getPublicResourceSlugs,
  getSimilarPublicResources,
} from "@/lib/public-resources";

type ResourceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const slugs = await getPublicResourceSlugs();

  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { slug } = await params;
  const resource = await getPublicResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const similarResources = await getSimilarPublicResources(resource, 3);

  return (
    <main>
      <Header />

      <SectionShell className="pb-8 pt-8 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_380px] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-hero border border-tovlo-line/50 bg-tovlo-surface/80 shadow-glass backdrop-blur-xl">
              <div className="min-h-[320px] bg-[radial-gradient(circle_at_72%_24%,rgba(250,204,21,0.26),transparent_14rem),linear-gradient(135deg,var(--color-surface-2),rgba(249,115,22,0.82),var(--color-yellow))]" />
              <div className="p-6 sm:p-8">
                <StatusPill tone={resource.availableNow ? "success" : "neutral"}>
                  {resource.availableNow ? "Одоо боломжтой" : "Цаг сонгох"}
                </StatusPill>
                <h1 className="mt-6 text-5xl font-black leading-[0.95] text-tovlo-text sm:text-7xl">
                  {resource.name}
                </h1>
                <p className="mt-5 max-w-2xl text-base font-medium leading-[1.55] text-tovlo-muted sm:text-lg">
                  {resource.description}
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <GlassCard>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Салбар
                </p>
                <p className="mt-3 text-lg font-black text-tovlo-text">
                  {resource.branch.name}
                </p>
                <p className="mt-2 text-sm font-medium text-tovlo-muted">
                  {resource.branch.district} · {resource.branch.address}
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Багтаамж
                </p>
                <p className="mt-3 text-lg font-black text-tovlo-text">
                  {resource.capacityMin}-{resource.capacityMax} хүн
                </p>
                <p className="mt-2 text-sm font-medium text-tovlo-muted">
                  {resource.branch.businessName}
                </p>
              </GlassCard>
              <GlassCard>
                <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Үнэ
                </p>
                <p className="mt-3 text-lg font-black text-tovlo-text">
                  {formatPrice(resource.pricePerHour)}₮ / цаг
                </p>
                <p className="mt-2 text-sm font-medium text-tovlo-muted">
                  Public price preview
                </p>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="lg:sticky lg:top-6">
            <StatusPill>Booking panel UI</StatusPill>
            <h2 className="mt-5 text-3xl font-black leading-[1.05] text-tovlo-text">
              Цаг сонгох
            </h2>
            <p className="mt-3 text-sm font-medium leading-[1.55] text-tovlo-muted">
              Одоогоор захиалга илгээх үйлдэл идэвхгүй. Энэ нь public UI preview.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {resource.availableSlots.map((slot) => (
                <button
                  className="rounded-3xl border border-tovlo-success/50 bg-tovlo-success/10 px-4 py-3 text-sm font-black text-tovlo-text transition hover:border-tovlo-yellow"
                  key={slot}
                  type="button"
                >
                  {slot}
                </button>
              ))}
              {resource.bookedSlots.map((slot) => (
                <button
                  className="cursor-not-allowed rounded-3xl border border-tovlo-booked/50 bg-tovlo-booked/10 px-4 py-3 text-sm font-black text-tovlo-muted opacity-70"
                  disabled
                  key={slot}
                  type="button"
                >
                  {slot} booked
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Дүрмийн тэмдэглэл
              </p>
              <p className="mt-3 text-sm font-medium leading-[1.55] text-tovlo-muted">
                Дараагийн баталгаажсан booking байвал сунгалт боломжгүй.
              </p>
            </div>

            <Button className="mt-6 w-full">Захиалгын хүсэлт илгээх</Button>
          </GlassCard>
        </div>
      </SectionShell>

      {similarResources.length > 0 && (
        <SectionShell
          className="pb-16 pt-4"
          eyebrow="Similar resources"
          title="Төстэй өрөөнүүд."
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {similarResources.map((similarResource) => (
              <ResourceCard key={similarResource.id} resource={similarResource} />
            ))}
          </div>
        </SectionShell>
      )}
    </main>
  );
}
