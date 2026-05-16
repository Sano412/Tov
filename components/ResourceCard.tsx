import Link from "next/link";
import { formatPrice, getBranchById, type Resource } from "@/lib/mock-data";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";

type ResourceCardProps = {
  resource: Resource;
};

export function ResourceCard({ resource }: ResourceCardProps) {
  const branch = getBranchById(resource.branchId);

  return (
    <Link href={`/resources/${resource.slug}`}>
      <GlassCard className="h-full overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:border-tovlo-yellow/80">
        <div className="h-40 bg-gradient-to-br from-tovlo-surface2 via-tovlo-orange/75 to-tovlo-yellow" />
        <div className="p-6">
          <StatusPill tone={resource.availableNow ? "success" : "neutral"}>
            {resource.availableNow ? "Одоо боломжтой" : "Дараа боломжтой"}
          </StatusPill>
          <h2 className="mt-5 text-2xl font-black text-tovlo-text">
            {resource.name}
          </h2>
          <p className="mt-2 text-sm font-medium text-tovlo-muted">
            {branch?.district} · {branch?.name}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-3xl border border-tovlo-line/35 bg-tovlo-background/40 p-4">
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                Багтаамж
              </p>
              <p className="mt-2 text-sm font-black text-tovlo-text">
                {resource.capacityMin}-{resource.capacityMax} хүн
              </p>
            </div>
            <div className="rounded-3xl border border-tovlo-line/35 bg-tovlo-background/40 p-4">
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
