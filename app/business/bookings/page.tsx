import { BusinessBookingDecisionForm } from "@/components/BusinessBookingDecisionForm";
import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireBusinessOwner } from "@/lib/auth/guards";
import { getBusinessDashboard } from "@/lib/business-dashboard";
import { businessNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

export default async function BusinessBookingsPage() {
  const owner = await requireBusinessOwner();
  const dashboard = await getBusinessDashboard(owner);

  return (
    <DashboardShell
      description="Review requests and keep confirmed bookings from overlapping."
      eyebrow="Business"
      navItems={businessNavItems}
      title="Bookings"
    >
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-tovlo-line/30 p-6">
          <StatusPill tone="booked">Pending requests</StatusPill>
          <h2 className="mt-4 text-3xl font-black text-tovlo-text">Needs decision</h2>
        </div>
        <div className="grid gap-3 p-6">
          {dashboard?.pendingBookings.length ? (
            dashboard.pendingBookings.map((booking) => (
              <div
                className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                key={booking.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-tovlo-text">{booking.customerName}</p>
                    <p className="mt-1 text-sm font-medium text-tovlo-muted">
                      {booking.resourceName} · {formatDateTime(booking.startTime)} -{" "}
                      {formatDateTime(booking.endTime)}
                    </p>
                  </div>
                  <BusinessBookingDecisionForm bookingId={booking.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm font-medium text-tovlo-muted">No pending requests right now.</p>
          )}
        </div>
      </GlassCard>

      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-tovlo-line/30 p-6">
          <StatusPill>Today</StatusPill>
          <h2 className="mt-4 text-3xl font-black text-tovlo-text">Schedule</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
              <tr>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Resource</th>
                <th className="px-6 py-4">Time</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tovlo-line/20">
              {dashboard?.todayBookings.length ? (
                dashboard.todayBookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-6 py-4 font-black text-tovlo-text">
                      {booking.customerName}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                      {booking.resourceName}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                      {formatDateTime(booking.startTime)} - {formatDateTime(booking.endTime)}
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill tone={booking.status === "CONFIRMED" ? "success" : "neutral"}>
                        {booking.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-8 text-sm font-bold text-tovlo-muted" colSpan={4}>
                    No bookings scheduled for today.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </DashboardShell>
  );
}
