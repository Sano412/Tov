import { Header } from "@/components/Header";
import { ResourceCard } from "@/components/ResourceCard";
import { Button } from "@/components/ui/Button";
import { SectionShell } from "@/components/ui/SectionShell";
import { getFeaturedPublicResources } from "@/lib/public-resources";

export const dynamic = "force-dynamic";

const heroSearch = ["Sukhbaatar", "Today", "8-12 people"];
const heroCards = [
  { name: "Cozy", opacity: "opacity-55", rotate: "-rotate-[8deg]", top: "top-16", left: "left-0" },
  { name: "Party", opacity: "opacity-75", rotate: "-rotate-[2deg]", top: "top-5", left: "left-16" },
  { name: "Golden VIP", opacity: "opacity-100", rotate: "rotate-[4deg]", top: "top-24", left: "left-32" },
];

function HeroRoomCard({
  name,
  opacity,
  rotate,
  top,
  left,
}: {
  name: string;
  opacity: string;
  rotate: string;
  top: string;
  left: string;
}) {
  return (
    <div
      className={[
        "premium-card absolute h-80 w-[340px] rounded-card border border-tovlo-line/35 bg-tovlo-surface/95 p-6 shadow-glass",
        opacity,
        rotate,
        top,
        left,
      ].join(" ")}
    >
      <div className="absolute right-4 top-5 h-36 w-36 rounded-full bg-tovlo-yellow/10 blur-3xl" />
      <div className="relative h-14 w-14 rounded-[18px] bg-gradient-to-br from-tovlo-orange to-tovlo-yellow" />
      <div className="relative mt-16">
        <p className="text-2xl font-black text-tovlo-text">{name}</p>
        <p className="mt-5 text-sm font-medium text-tovlo-muted">20:00 available</p>
        <p className="mt-2 text-sm font-medium text-tovlo-muted">80,000 MNT/hour</p>
        <p className="mt-2 text-sm font-medium text-tovlo-muted">8-12 people</p>
      </div>
    </div>
  );
}

export default async function Home() {
  const featuredResources = await getFeaturedPublicResources(6);

  return (
    <main className="page-shell">
      <Header />

      <SectionShell className="pb-8 pt-14 sm:pt-20">
        <div className="grid min-h-[620px] gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="reveal-block">
            <p className="text-sm font-black uppercase tracking-[0.16em] text-tovlo-yellow">
              Tovlo karaoke MVP
            </p>
            <h1 className="mt-12 max-w-3xl text-5xl font-black leading-[1.05] text-tovlo-text sm:text-7xl">
              Find the right karaoke room
              <span className="block text-tovlo-orange">and book the night.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-xl font-medium leading-[1.65] text-tovlo-muted">
              Compare capacity, price, and open time in one place. Send a request and let the
              venue confirm it before your reservation becomes final.
            </p>

            <div className="mt-12 rounded-[30px] border border-tovlo-line/35 bg-tovlo-surface/90 p-4 shadow-glass">
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
                {heroSearch.map((item) => (
                  <div
                    className="field-surface flex min-h-[58px] items-center rounded-[18px] px-5 text-base font-black text-tovlo-text"
                    key={item}
                  >
                    {item}
                  </div>
                ))}
                <a href="/resources">
                  <Button className="min-h-[58px] w-full px-8">Search</Button>
                </a>
              </div>
            </div>
          </div>

          <div className="room-stack relative hidden min-h-[720px] lg:block">
            {heroCards.map((card) => (
              <HeroRoomCard key={card.name} {...card} />
            ))}
            <div className="premium-card absolute bottom-20 left-24 w-[360px] rounded-card border border-tovlo-line/35 bg-tovlo-surface/95 p-7 shadow-glass">
              <p className="text-2xl font-black text-tovlo-text">Tonight pick</p>
              <div className="mt-6 space-y-2 text-sm font-medium leading-[1.55] text-tovlo-muted">
                <p>Golden VIP Room</p>
                <p>Capacity: 10 people</p>
                <p>Next available: 20:00</p>
                <p>Price: 80,000 MNT/hour</p>
              </div>
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell className="pb-16 pt-0">
        <div className="mb-7 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
              Featured rooms
            </p>
            <h2 className="mt-3 text-3xl font-black text-tovlo-text sm:text-5xl">
              Tonight&apos;s featured rooms.
            </h2>
          </div>
          <a className="hidden text-sm font-black text-tovlo-yellow sm:block" href="/resources">
            View all
          </a>
        </div>
        {featuredResources.length > 0 ? (
          <div className="hero-carousel overflow-hidden py-2">
            <div className="hero-carousel-track flex w-max gap-5">
              {[...featuredResources, ...featuredResources].map((resource, index) => (
                <div className="w-[330px] shrink-0" key={`${resource.id}-${index}`}>
                  <ResourceCard resource={resource} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-8 text-sm font-bold text-tovlo-muted shadow-glass">
            No public rooms are available yet.
          </div>
        )}
      </SectionShell>
    </main>
  );
}
