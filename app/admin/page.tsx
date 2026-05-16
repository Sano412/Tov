import { Header } from "@/components/Header";
import { GlassCard } from "@/components/ui/GlassCard";
import { SectionShell } from "@/components/ui/SectionShell";
import { StatusPill } from "@/components/ui/StatusPill";
import { getAdminDashboard } from "@/lib/admin-dashboard";
import { requireSuperAdmin } from "@/lib/auth/guards";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <GlassCard>
      <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
        {label}
      </p>
      <p className="mt-5 text-4xl font-black text-tovlo-text">{value}</p>
    </GlassCard>
  );
}

export default async function AdminPage() {
  const admin = await requireSuperAdmin();
  const dashboard = await getAdminDashboard(admin);

  return (
    <main>
      <Header />

      <SectionShell className="pb-16 pt-8 sm:pt-12">
        <div className="grid gap-5 lg:grid-cols-[260px_1fr]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <GlassCard className="p-5">
              <div className="mb-8">
                <p className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                  Super admin
                </p>
                <h1 className="mt-3 text-3xl font-black leading-[1.05] text-tovlo-text">
                  Platform dashboard
                </h1>
              </div>
              <nav className="grid gap-2" aria-label="Admin dashboard navigation">
                {[
                  "Stats",
                  "Approvals",
                  "Categories",
                  "Bookings",
                  "Featured",
                  "Analytics",
                ].map((item) => (
                  <a
                    className="rounded-3xl border border-tovlo-line/25 bg-tovlo-background/35 px-4 py-3 text-sm font-black text-tovlo-muted transition hover:border-tovlo-yellow/70 hover:text-tovlo-text"
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
            <GlassCard className="bg-tovlo-surface2/70 p-7 sm:p-9">
              <StatusPill>Mock guarded route</StatusPill>
              <div className="mt-5 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h2 className="text-4xl font-black leading-[1.05] text-tovlo-text sm:text-6xl">
                    Tovlo admin
                  </h2>
                  <p className="mt-4 max-w-2xl text-sm font-medium leading-[1.55] text-tovlo-muted">
                    This route is structurally separated from public and business pages. The mock guard
                    returns {admin.name} until real auth is added.
                  </p>
                </div>
                <p className="text-sm font-black text-tovlo-yellow">
                  Updated {dashboard.generatedAtLabel}
                </p>
              </div>
            </GlassCard>

            <section id="stats" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Businesses" value={dashboard.stats.businesses} />
              <StatCard label="Branches" value={dashboard.stats.branches} />
              <StatCard label="Resources" value={dashboard.stats.resources} />
              <StatCard label="Bookings" value={dashboard.stats.bookings} />
            </section>

            <section className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
              <GlassCard id="approvals">
                <StatusPill tone="booked">Pending business approvals</StatusPill>
                <div className="mt-5 grid gap-3">
                  {dashboard.pendingBusinesses.length > 0 ? (
                    dashboard.pendingBusinesses.map((business) => (
                      <div
                        className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                        key={business.id}
                      >
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-black text-tovlo-text">{business.name}</p>
                            <p className="mt-1 text-sm font-medium text-tovlo-muted">
                              {business.slug} · {formatDate(business.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              className="rounded-full border border-tovlo-success/50 px-4 py-2 text-xs font-black text-tovlo-success"
                              type="button"
                            >
                              Approve
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
                      No pending business approvals right now.
                    </p>
                  )}
                </div>
              </GlassCard>

              <GlassCard id="categories">
                <StatusPill>Categories overview</StatusPill>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {dashboard.categories.map((category) => (
                    <div
                      className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                      key={category.id}
                    >
                      <p className="font-black text-tovlo-text">{category.name}</p>
                      <p className="mt-1 text-sm font-medium text-tovlo-muted">
                        {category.slug} · {category.resourceCount} resources
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </section>

            <GlassCard id="bookings" className="overflow-hidden p-0">
              <div className="border-b border-tovlo-line/30 p-6">
                <StatusPill>Recent bookings</StatusPill>
                <h2 className="mt-4 text-3xl font-black text-tovlo-text">
                  Latest platform activity
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-left">
                  <thead className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
                    <tr>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Business</th>
                      <th className="px-6 py-4">Resource</th>
                      <th className="px-6 py-4">Created</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tovlo-line/20">
                    {dashboard.recentBookings.map((booking) => (
                      <tr key={booking.id}>
                        <td className="px-6 py-4">
                          <p className="font-black text-tovlo-text">{booking.customerName}</p>
                          <p className="text-xs font-medium text-tovlo-muted">
                            {booking.customerPhone}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                          {booking.businessName}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                          {booking.resourceName}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                          {formatDate(booking.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <StatusPill
                            tone={booking.status === "CONFIRMED" ? "success" : "neutral"}
                          >
                            {booking.status}
                          </StatusPill>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>

            <section className="grid gap-5 xl:grid-cols-2">
              <GlassCard id="featured">
                <StatusPill>Featured listings placeholder</StatusPill>
                <div className="mt-5 grid gap-3">
                  {dashboard.featuredResources.map((resource) => (
                    <div
                      className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                      key={resource.id}
                    >
                      <p className="font-black text-tovlo-text">{resource.name}</p>
                      <p className="mt-1 text-sm font-medium text-tovlo-muted">
                        {resource.businessName} · {resource.branchName} · {resource.status}
                      </p>
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard id="analytics" className="bg-tovlo-surface2/70">
                <StatusPill>Analytics preview</StatusPill>
                <div className="mt-6 grid gap-4">
                  <div>
                    <p className="text-sm font-black text-tovlo-text">
                      Confirmed recent bookings
                    </p>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-tovlo-background/60">
                      <div
                        className="h-full rounded-full bg-tovlo-success"
                        style={{ width: `${dashboard.analyticsPreview.confirmedBookingShare}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-tovlo-text">
                      Pending recent bookings
                    </p>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-tovlo-background/60">
                      <div
                        className="h-full rounded-full bg-tovlo-yellow"
                        style={{ width: `${dashboard.analyticsPreview.pendingBookingShare}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-black text-tovlo-text">
                      Featured resource share
                    </p>
                    <div className="mt-3 h-3 overflow-hidden rounded-full bg-tovlo-background/60">
                      <div
                        className="h-full rounded-full bg-tovlo-orange"
                        style={{ width: `${dashboard.analyticsPreview.activeResourceShare}%` }}
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </section>
          </div>
        </div>
      </SectionShell>
    </main>
  );
}
