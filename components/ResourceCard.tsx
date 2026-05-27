import Link from "next/link";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatPrice } from "@/lib/format";
import type { PublicResource } from "@/lib/public-resources";

type ResourceCardProps = {
  resource: PublicResource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const nextSlot = resource.availableSlots[0] ?? "Choose time";

  return (
    <Link className="group block h-full" href={`/resources/${resource.slug}`}>
      <article className="premium-card card-shine relative h-full overflow-hidden rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-6 shadow-glass">
        <div className="absolute right-[-38px] top-[-34px] h-36 w-36 rounded-full bg-tovlo-yellow/10 blur-3xl" />
        <div className="relative flex h-28 items-start justify-between rounded-[22px] border border-tovlo-line/20 bg-tovlo-glass/8 p-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-[18px] bg-gradient-to-br from-tovlo-orange to-tovlo-yellow shadow-glow">
            <span className="h-5 w-5 rounded-full bg-[#120A04]/85" />
          </div>
          <StatusPill tone={resource.availableNow ? "success" : "neutral"}>
            {resource.availableNow ? "Open" : "Pick time"}
          </StatusPill>
        </div>

        <div className="relative mt-5">
          <h2 className="text-2xl font-black leading-[1.05] text-tovlo-text transition group-hover:text-tovlo-yellow">
            {resource.name}
          </h2>
          <p className="mt-3 text-sm font-medium leading-[1.65] text-tovlo-muted/80">
            {resource.branch.district} branch
          </p>
          <div className="mt-4 space-y-2 text-sm font-medium leading-[1.5] text-tovlo-muted/85">
            <p>
              {resource.capacityMin}-{resource.capacityMax} people
            </p>
            <p>{nextSlot} available</p>
            <p>{formatPrice(resource.pricePerHour)} MNT/hour</p>
          </div>
          <div className="mt-5 rounded-full bg-gradient-to-r from-tovlo-orange to-tovlo-yellow px-5 py-3 text-center text-xs font-black text-[#120A04]">
            View room
          </div>
        </div>
      </article>
    </Link>
  );
}
