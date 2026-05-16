import Link from "next/link";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { formatPrice } from "@/lib/format";
import type { PublicResource } from "@/lib/public-resources";

type ResourceCardProps = {
  resource: PublicResource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  return (
    <Link className="group block h-full" href={`/resources/${resource.slug}`}>
      <GlassCard className="card-shine h-full overflow-hidden p-0 transition duration-300 hover:-translate-y-1 hover:border-tovlo-yellow/55 hover:bg-tovlo-glassStrong/12">
        <div className="relative h-44 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-tovlo-surface2 via-tovlo-orange/70 to-tovlo-yellow" />
          <div className="absolute inset-x-6 bottom-5 rounded-3xl border border-tovlo-line/25 bg-tovlo-darker/55 px-4 py-3 shadow-innerGlow backdrop-blur-xl">
            <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
              {resource.branch.district}
            </p>
            <p className="mt-1 text-sm font-bold text-tovlo-text/90">
              {resource.branch.name}
            </p>
          </div>
        </div>
        <div className="relative p-6">
          <StatusPill tone={resource.availableNow ? "success" : "neutral"}>
            {resource.availableNow ? "Одоо боломжтой" : "Дараа боломжтой"}
          </StatusPill>
          <h2 className="mt-5 text-2xl font-black leading-[1.05] text-tovlo-text transition group-hover:text-tovlo-yellow">
            {resource.name}
          </h2>
          <p className="mt-3 line-clamp-2 text-sm font-medium leading-[1.55] text-tovlo-muted/75">
            {resource.description}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="field-surface rounded-3xl p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Багтаамж
              </p>
              <p className="mt-2 text-sm font-black text-tovlo-text">
                {resource.capacityMin}-{resource.capacityMax} хүн
              </p>
            </div>
            <div className="field-surface rounded-3xl p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Үнэ
              </p>
              <p className="mt-2 text-sm font-black text-tovlo-text">
                {formatPrice(resource.pricePerHour)}₮
              </p>
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}
