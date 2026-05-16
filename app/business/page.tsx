import { Header } from "@/components/Header";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireBusinessOwner } from "@/lib/auth/guards";
import { getBusinessDashboard } from "@/lib/business-dashboard";
import { formatPrice } from "@/lib/format";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

function DashboardStat({
  label,
  value,
  tone = "accent",
}: {
  label: string;
  value: string;
  tone?: "accent" | "success" | "booked" | "neutral";
}) {
  return (
    <GlassCard>
      <StatusPill tone={tone}>{label}</StatusPill>
      <p className="mt-5 text-3xl font-black text-tovlo-text">{value}</p>
    </GlassCard>
  );
}

export default async function BusinessPage() {
  const owner = await requireBusinessOwner();
  const dashboard = await getBusinessDashboard(owner);

  return (
    <main className="page-shell">
      <Header />

      <SectionShell className="pb-16 pt-8 sm:pt-12">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <GlassCard className="bg-tovlo-glassStrong/10 p-5">
              <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Business
                </p>
                <h1 className="mt-3 text-3xl font-black leading-[1.05] text-tovlo-text">
                  Owner dashboard
                </h1>
              </div>
              <nav className="grid gap-2" aria-label="Business dashboard navigation">
                {["Overview", "Bookings", "Resources", "Calendar", "Rules"].map((item) => (
                  <a
                    className="rounded-3xl border border-tovlo-line/22 bg-tovlo-darker/35 px-4 py-3 text-sm font-black text-tovlo-muted/82 transition hover:border-tovlo-yellow/60 hover:bg-tovlo-glass/8 hover:text-tovlo-text"
                    href={`#${item.toLowerCase()}`}
                    key={item}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </GlassCard>
          </aside>

          <div className="space-y-5">
            <GlassCard className="bg-tovlo-glassStrong/10 p-7 sm:p-9">
              <StatusPill>Mock guarded route</StatusPill>
              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-4xl font-black leading-[1.05] text-tovlo-text sm:text-6xl">
                    {dashboard?.business.name ?? "Business not found"}
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm font-medium leading-[1.55] text-tovlo-muted">
                    This route is isolated from public pages and scoped through `requireBusinessOwner()`.
                    Real authentication can replace the mock guard later.
                  </p>
                </div>
                <p className="text-sm font-black text-tovlo-yellow">
                  Updated {dashboard?.generatedAtLabel ?? "--:--"}
                </p>
              </div>
            </GlassCard>

            {!dashboard ? (
              <GlassCard>
                <h2 className="text-2xl font-black text-tovlo-text">
                  No business data available.
                </h2>
                <p className="mt-3 text-sm font-medium text-tovlo-muted">
                  Seed the local database, then refresh this route.
                </p>
              </GlassCard>
            ) : (
              <>
                <section id="overview" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <DashboardStat
                    label="Today bookings"
                    value={String(dashboard.todayBookings.length)}
                    tone="accent"
                  />
                  <DashboardStat
                    label="Pending requests"
                    value={String(dashboard.pendingBookings.length)}
                    tone="booked"
                  />
                  <DashboardStat
                    label="Available now"
                    value={String(dashboard.availableResourcesNow.length)}
                    tone="success"
                  />
                  <DashboardStat
                    label="Estimated revenue"
                    value={`${formatPrice(dashboard.estimatedRevenue)}₮`}
                    tone="neutral"
                  />
                </section>

                <section className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
                  <GlassCard id="bookings" className="overflow-hidden p-0">
                    <div className="border-b border-tovlo-line/30 p-6">
                      <StatusPill>Booking table</StatusPill>
                      <h2 className="mt-4 text-3xl font-black text-tovlo-text">
                        Today bookings
                      </h2>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[720px] border-collapse text-left">
                        <thead className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                          <tr>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Resource</th>
                            <th className="px-6 py-4">Time</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-tovlo-line/20">
                          {dashboard.todayBookings.map((booking) => (
                            <tr key={booking.id}>
                              <td className="px-6 py-4">
                                <p className="font-black text-tovlo-text">
                                  {booking.customerName}
                                </p>
                                <p className="text-xs font-medium text-tovlo-muted">
                                  {booking.customerPhone}
                                </p>
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                                {booking.resourceName}
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                                {formatDateTime(booking.startTime)} -{" "}
                                {formatDateTime(booking.endTime)}
                              </td>
                              <td className="px-6 py-4">
                                <StatusPill
                                  tone={booking.status === "CONFIRMED" ? "success" : "neutral"}
                                >
                                  {booking.status}
                                </StatusPill>
                              </td>
                              <td className="px-6 py-4">
                                <button
                                  className="rounded-full border border-tovlo-line/40 px-4 py-2 text-xs font-black text-tovlo-muted"
                                  type="button"
                                >
                                  View
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>

                  <GlassCard id="calendar">
                    <StatusPill>Calendar preview</StatusPill>
                    <h2 className="mt-4 text-3xl font-black text-tovlo-text">
                      Schedule glance
                    </h2>
                    <div className="mt-6 grid gap-3">
                      {dashboard.todayBookings.slice(0, 5).map((booking) => (
                        <div
                          className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                          key={booking.id}
                        >
                          <p className="text-sm font-black text-tovlo-text">
                            {booking.resourceName}
                          </p>
                          <p className="mt-1 text-xs font-bold text-tovlo-muted">
                            {formatDateTime(booking.startTime)} -{" "}
                            {formatDateTime(booking.endTime)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </section>

                <section className="grid gap-5 xl:grid-cols-2">
                  <GlassCard>
                    <StatusPill tone="booked">Pending booking requests</StatusPill>
                    <div className="mt-5 grid gap-3">
                      {dashboard.pendingBookings.length > 0 ? (
                        dashboard.pendingBookings.map((booking) => (
                          <div
                            className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                            key={booking.id}
                          >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <p className="font-black text-tovlo-text">
                                  {booking.customerName}
                                </p>
                                <p className="mt-1 text-sm font-medium text-tovlo-muted">
                                  {booking.resourceName} · {formatDateTime(booking.startTime)}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <button
                                  className="rounded-full border border-tovlo-success/50 px-4 py-2 text-xs font-black text-tovlo-success"
                                  type="button"
                                >
                                  Confirm
                                </button>
                                <button
                                  className="rounded-full border border-tovlo-booked/50 px-4 py-2 text-xs font-black text-tovlo-booked"
                                  type="button"
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm font-medium text-tovlo-muted">
                          No pending requests right now.
                        </p>
                      )}
                    </div>
                  </GlassCard>

                  <GlassCard id="resources">
                    <StatusPill tone="success">Available resources now</StatusPill>
                    <div className="mt-5 grid gap-3">
                      {dashboard.availableResourcesNow.map((resource) => (
                        <div
                          className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                          key={resource.id}
                        >
                          <p className="font-black text-tovlo-text">{resource.name}</p>
                          <p className="mt-1 text-sm font-medium text-tovlo-muted">
                            {resource.branchName} · {resource.capacityMin}-{resource.capacityMax} pax
                          </p>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </section>

                <GlassCard id="rules" className="bg-tovlo-surface2/70">
                  <StatusPill tone="booked">Extension blocked example</StatusPill>
                  <h2 className="mt-5 text-3xl font-black text-tovlo-text">
                    Extension blocked if next confirmed booking exists.
                  </h2>
                  <p className="mt-4 max-w-3xl text-sm font-medium leading-[1.55] text-tovlo-muted">
                    {dashboard.extensionBlockedExample
                      ? `${dashboard.extensionBlockedExample.resourceName} ends at ${dashboard.extensionBlockedExample.currentEndTime}. A next confirmed slot at ${dashboard.extensionBlockedExample.nextStartTime} would block an extension.`
                      : "No confirmed booking is available for the example yet, but this state is reserved for the later confirmation workflow."}
                  </p>
                </GlassCard>
              </>
            )}
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
