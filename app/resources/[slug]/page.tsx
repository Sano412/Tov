import { notFound } from "next/navigation";
import { BookingRequestForm } from "@/components/BookingRequestForm";
import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
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
    <main className="page-shell">
      <Header />

      <SectionShell className="pb-8 pt-8 sm:pt-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:items-start">
          <div>
            <div className="overflow-hidden rounded-hero border border-tovlo-line/25 bg-tovlo-glass/8 shadow-glass backdrop-blur-2xl">
              <div className="relative min-h-[320px] bg-[radial-gradient(circle_at_72%_24%,rgba(250,204,21,0.28),transparent_14rem),linear-gradient(135deg,rgb(var(--color-surface-2-rgb)),rgba(249,115,22,0.82),rgb(var(--color-yellow-rgb)))]">
                <div className="absolute bottom-6 left-6 right-6 rounded-[30px] border border-tovlo-line/25 bg-tovlo-darker/55 p-5 shadow-innerGlow backdrop-blur-xl">
                  <StatusPill tone={resource.availableNow ? "success" : "neutral"}>
                    {resource.availableNow ? "Одоо боломжтой" : "Цаг сонгох"}
                  </StatusPill>
                  <h1 className="mt-5 text-4xl font-black leading-[0.95] text-tovlo-text sm:text-6xl">
                    {resource.name}
                  </h1>
                </div>
              </div>
              <div className="p-6 sm:p-8">
                <p className="max-w-2xl text-base font-medium leading-[1.65] text-tovlo-muted/80 sm:text-lg">
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
                <p className="mt-2 text-sm font-medium leading-[1.55] text-tovlo-muted/78">
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
                <p className="mt-2 text-sm font-medium text-tovlo-muted/78">
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
                <p className="mt-2 text-sm font-medium text-tovlo-muted/78">
                  Public price preview
                </p>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="lg:sticky lg:top-6">
            <StatusPill>Booking request</StatusPill>
            <h2 className="mt-5 text-3xl font-black leading-[1.05] text-tovlo-text">
              Цаг сонгох
            </h2>
            <p className="mt-3 text-sm font-medium leading-[1.65] text-tovlo-muted/78">
              Захиалгын хүсэлт PENDING төлөвтэй үүснэ. Баталгаажуулалт дараагийн phase-д business/admin хэсгээр хийгдэнэ.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {resource.availableSlots.map((slot) => (
                <button
                  className="field-surface rounded-3xl px-4 py-3 text-sm font-black text-tovlo-text transition hover:border-tovlo-yellow/55 hover:text-tovlo-yellow"
                  key={slot}
                  type="button"
                >
                  {slot}
                </button>
              ))}
              {resource.bookedSlots.map((slot) => (
                <button
                  className="cursor-not-allowed rounded-3xl border border-tovlo-booked/35 bg-tovlo-booked/10 px-4 py-3 text-sm font-black text-tovlo-muted/60"
                  disabled
                  key={slot}
                  type="button"
                >
                  {slot} booked
                </button>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-tovlo-booked/30 bg-tovlo-booked/10 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Дүрмийн тэмдэглэл
              </p>
              <p className="mt-3 text-sm font-medium leading-[1.65] text-tovlo-muted/82">
                Дараагийн баталгаажсан booking байвал сунгалт боломжгүй.
              </p>
            </div>

            <BookingRequestForm
              availableSlots={resource.availableSlots}
              resourceSlug={resource.slug}
            />
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
