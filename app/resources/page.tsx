import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { SectionShell } from "@/components/ui/SectionShell";
import {
  getPublicDistricts,
  getPublicResources,
  type PublicResourceFilters,
} from "@/lib/public-resources";

export const dynamic = "force-dynamic";

const featureFilters = [
  ["open-now", "Open now"],
  ["vip", "VIP"],
  ["small-room", "Small room"],
  ["group-room", "Group room"],
  ["food-service", "Food service"],
  ["private-room", "Private room"],
  ["near-me", "Near me"],
] as const;

type ResourcesPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getSingleParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getMultiParam(value: string | string[] | undefined) {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function getNumberParam(value: string | string[] | undefined) {
  const rawValue = getSingleParam(value);
  const parsed = rawValue ? Number(rawValue) : NaN;

  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const params = (await searchParams) ?? {};
  const filters: PublicResourceFilters = {
    district: getSingleParam(params.district) || undefined,
    capacity: getNumberParam(params.capacity),
    maxPrice: getNumberParam(params.maxPrice),
    features: getMultiParam(params.feature),
    limit: 24,
  };
  const [districts, visibleResources] = await Promise.all([
    getPublicDistricts(),
    getPublicResources(filters),
  ]);
  const selectedFeatures = new Set(filters.features ?? []);

  return (
    <main className="page-shell">
      <Header />

      <SectionShell className="pb-8 pt-8">
        <h1 className="text-5xl font-black leading-[1.05] text-tovlo-text">Find a room</h1>
        <p className="mt-4 text-lg font-medium text-tovlo-muted">
          Filter by location, capacity, price, and availability to find a karaoke room that fits tonight.
        </p>

        <form
          action="/resources"
          className="mt-8 rounded-[28px] border border-tovlo-line/35 bg-tovlo-surface/90 p-5 shadow-glass"
        >
          <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1fr_auto]">
            <label className="field-surface rounded-2xl px-5 py-3">
              <span className="text-sm font-black text-tovlo-text">Location</span>
              <select
                className="mt-1 w-full bg-transparent text-xs font-bold text-tovlo-muted outline-none"
                defaultValue={filters.district ?? ""}
                name="district"
              >
                <option value="">All</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </label>
            <label className="field-surface rounded-2xl px-5 py-3">
              <span className="text-sm font-black text-tovlo-text">Capacity</span>
              <select
                className="mt-1 w-full bg-transparent text-xs font-bold text-tovlo-muted outline-none"
                defaultValue={filters.capacity ?? ""}
                name="capacity"
              >
                <option value="">Any</option>
                {[2, 4, 6, 8, 10, 12, 16].map((capacity) => (
                  <option key={capacity} value={capacity}>
                    {capacity} people
                  </option>
                ))}
              </select>
            </label>
            <label className="field-surface rounded-2xl px-5 py-3">
              <span className="text-sm font-black text-tovlo-text">Max price</span>
              <select
                className="mt-1 w-full bg-transparent text-xs font-bold text-tovlo-muted outline-none"
                defaultValue={filters.maxPrice ?? ""}
                name="maxPrice"
              >
                <option value="">Any</option>
                {[40000, 60000, 80000, 100000].map((price) => (
                  <option key={price} value={price}>
                    {price.toLocaleString("mn-MN")} MNT
                  </option>
                ))}
              </select>
            </label>
            <button className="min-h-[72px] rounded-full bg-gradient-to-r from-tovlo-orange to-tovlo-yellow px-8 text-sm font-black text-[#120A04] shadow-glow">
              Search
            </button>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            {featureFilters.map(([value, label]) => (
              <label
                className="field-surface flex min-h-[42px] items-center gap-3 rounded-full px-5 text-sm font-bold text-tovlo-muted"
                key={value}
              >
                <input
                  className="h-4 w-4 accent-tovlo-orange"
                  defaultChecked={selectedFeatures.has(value)}
                  name="feature"
                  type="checkbox"
                  value={value}
                />
                {label}
              </label>
            ))}
          </div>
        </form>
      </SectionShell>

      <SectionShell className="pt-0">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
              {visibleResources.length} rooms found
            </p>
            <h2 className="mt-2 text-3xl font-black text-tovlo-text">Available choices</h2>
          </div>
          <a className="text-sm font-black text-tovlo-yellow" href="/resources">
            Reset filters
          </a>
        </div>

        {visibleResources.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-8 text-sm font-bold text-tovlo-muted shadow-glass">
            No rooms match the current filters. Try a wider capacity or price range.
          </div>
        )}
      </SectionShell>
    </main>
  );
}
