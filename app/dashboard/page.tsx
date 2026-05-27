import { ResourceCard } from "@/components/ResourceCard";
import { getFeaturedPublicResources } from "@/lib/public-resources";

export const dynamic = "force-dynamic";

const navItems = ["My bookings", "Favorites", "Profile", "Support"];
const stats = [
  ["Upcoming", "2 items"],
  ["Pending", "8 items"],
  ["Completed", "14 items"],
  ["Saved", "98 items"],
];
const rooms = ["Golden VIP", "Cozy Room", "Party Room", "Duet Room", "Family", "Sky Lounge"];
const queue = ["Golden VIP - 20:00", "Cozy Room - pending", "Party Room - saved", "Duet Room - confirmed"];

export default async function DashboardPage() {
  const savedRooms = await getFeaturedPublicResources(3);

  return (
    <main className="page-shell min-h-screen lg:grid lg:grid-cols-[270px_1fr]">
      <aside className="border-b border-tovlo-line/20 bg-tovlo-darker/90 px-5 py-6 lg:min-h-screen lg:border-b-0 lg:border-r lg:px-8">
        <a className="flex items-center gap-2 text-3xl font-black text-tovlo-text" href="/">
          Tovlo
          <span className="h-3 w-3 rounded-full bg-tovlo-orange" />
        </a>
        <nav className="mt-12 flex gap-3 overflow-x-auto lg:block lg:space-y-4">
          {navItems.map((item, index) => (
            <a
              className={[
                "block min-w-max rounded-[18px] px-6 py-3 text-sm font-black",
                index === 0
                  ? "bg-gradient-to-r from-tovlo-orange to-tovlo-yellow text-[#120A04]"
                  : "text-tovlo-muted hover:bg-tovlo-glass/8 hover:text-tovlo-text",
              ].join(" ")}
              href={index === 0 ? "/dashboard" : "#"}
              key={item}
            >
              {item}
            </a>
          ))}
        </nav>
      </aside>

      <section className="px-5 py-10 sm:px-8 lg:px-12">
        <h1 className="text-4xl font-black text-tovlo-text">User dashboard</h1>
        <p className="mt-3 text-base font-medium text-tovlo-muted">
          Dark and light mode dashboard system for MVP concept.
        </p>

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {stats.map(([label, value]) => (
            <div
              className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-7 shadow-glass"
              key={label}
            >
              <p className="text-2xl font-black text-tovlo-text">{label}</p>
              <p className="mt-5 text-sm font-medium text-tovlo-muted">{value}</p>
              <p className="mt-2 text-sm font-medium text-tovlo-muted">Updated now</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 xl:grid-cols-[1fr_315px]">
          <div className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-7 shadow-glass">
            <h2 className="text-3xl font-black text-tovlo-text">Booking timeline</h2>
            <div className="mt-8 space-y-6">
              {rooms.map((room, row) => (
                <div className="grid items-center gap-4 sm:grid-cols-[110px_1fr]" key={room}>
                  <p className="text-sm font-bold text-tovlo-muted">{room}</p>
                  <div className="grid grid-cols-8 gap-3">
                    {Array.from({ length: 8 }).map((_, index) => {
                      const active = (index + row) % 3 === 0;

                      return (
                        <span
                          className={[
                            "h-8 rounded-xl border border-tovlo-line/35",
                            active ? "bg-gradient-to-r from-tovlo-orange to-tovlo-yellow" : "bg-tovlo-surface2/70",
                          ].join(" ")}
                          key={`${room}-${index}`}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-7 shadow-glass">
            <h2 className="text-3xl font-black text-tovlo-text">Action queue</h2>
            <div className="mt-8 space-y-4">
              {queue.map((item) => (
                <div className="field-surface rounded-2xl px-5 py-4 text-sm font-bold text-tovlo-muted" key={item}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-5 xl:grid-cols-3">
          {savedRooms.length > 0 ? (
            savedRooms.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))
          ) : (
            <div className="rounded-card border border-tovlo-line/35 bg-tovlo-surface/90 p-8 text-sm font-bold text-tovlo-muted shadow-glass xl:col-span-3">
              No saved room suggestions are available yet.
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
