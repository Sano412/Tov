import { notFound } from "next/navigation";
import { BookingRequestForm } from "@/components/BookingRequestForm";
import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { formatPrice } from "@/lib/format";
import {
  getPublicResourceBySlug,
  getSimilarPublicResources,
} from "@/lib/public-resources";

export const dynamic = "force-dynamic";

type ResourceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ResourceDetailPage({ params }: ResourceDetailPageProps) {
  const { slug } = await params;
  const resource = await getPublicResourceBySlug(slug);

  if (!resource) {
    notFound();
  }

  const similarResources = await getSimilarPublicResources(resource, 3);
  const allSlots = [...resource.availableSlots, ...resource.bookedSlots].slice(0, 6);

  return (
    <main className="page-shell">
      <Header />

      <SectionShell className="pb-10 pt-8">
        <h1 className="text-5xl font-black leading-[1.05] text-tovlo-text">{resource.name}</h1>
        <p className="mt-4 text-lg font-semibold text-tovlo-muted">
          {resource.branch.district} branch | {resource.capacityMin}-{resource.capacityMax} people |{" "}
          {formatPrice(resource.pricePerHour)} MNT/hour
        </p>

        <div className="mt-9 grid gap-9 lg:grid-cols-[1fr_420px] lg:items-start">
          <div>
            <div className="relative flex min-h-[450px] items-center overflow-hidden rounded-[34px] border border-tovlo-line/35 bg-tovlo-surface/90 p-8 shadow-glass sm:p-12">
              <div className="absolute right-20 top-16 h-[420px] w-[420px] rounded-full bg-tovlo-orange/20 blur-3xl" />
              <div className="absolute left-8 top-8 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-tovlo-orange to-tovlo-yellow text-3xl font-black text-[#120A04] shadow-glow">
                K
              </div>
              <div className="relative mt-24">
                <p className="text-4xl font-black text-tovlo-text sm:text-5xl">
                  Room preview
                </p>
                <p className="mt-6 max-w-xl text-base font-medium leading-[1.65] text-tovlo-muted">
                  {resource.description}
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              {[
                ["Branch", resource.branch.name],
                ["Capacity", `${resource.capacityMin}-${resource.capacityMax} people`],
                ["Price", `${formatPrice(resource.pricePerHour)} MNT/hour`],
              ].map(([label, value]) => (
                <div
                  className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-6 shadow-glass"
                  key={label}
                >
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                    {label}
                  </p>
                  <p className="mt-4 text-lg font-black text-tovlo-text">{value}</p>
                </div>
              ))}
            </div>
          </div>

          <aside className="rounded-[34px] border border-tovlo-line/35 bg-tovlo-surface/95 p-8 shadow-glass lg:sticky lg:top-6">
            <h2 className="text-3xl font-black text-tovlo-text">Booking request</h2>
            <div className="mt-7 space-y-4">
              {["Today", resource.availableSlots[0] ?? "Choose time", "2 hours", `${resource.capacityMax} people`].map(
                (item) => (
                  <div
                    className="field-surface rounded-2xl px-6 py-4 text-base font-black text-tovlo-text"
                    key={item}
                  >
                    {item}
                  </div>
                ),
              )}
            </div>

            <h3 className="mt-8 text-xl font-black text-tovlo-text">Available time</h3>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {allSlots.map((slot, index) => {
                const selected = index === 2;
                const booked = resource.bookedSlots.includes(slot);

                return (
                  <button
                    className={[
                      "min-h-[42px] rounded-full border px-4 text-sm font-black transition",
                      selected
                        ? "border-tovlo-line/35 bg-gradient-to-r from-tovlo-orange to-tovlo-yellow text-[#120A04]"
                        : booked
                          ? "cursor-not-allowed border-tovlo-booked/35 bg-tovlo-booked/10 text-tovlo-muted/55"
                          : "border-tovlo-line/35 bg-tovlo-surface2/70 text-tovlo-text hover:border-tovlo-yellow",
                    ].join(" ")}
                    disabled={booked}
                    key={slot}
                    type="button"
                  >
                    {slot}
                  </button>
                );
              })}
            </div>

            <BookingRequestForm availableSlots={resource.availableSlots} resourceSlug={resource.slug} />
          </aside>
        </div>
      </SectionShell>

      {similarResources.length > 0 && (
        <SectionShell className="pb-16 pt-0">
          <h2 className="mb-7 text-3xl font-black text-tovlo-text sm:text-5xl">
            Similar rooms.
          </h2>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {similarResources.map((similarResource) => (
              <ResourceCard key={similarResource.id} resource={similarResource} />
            ))}
          </div>
        </SectionShell>
      )}
    </main>
  );
}
