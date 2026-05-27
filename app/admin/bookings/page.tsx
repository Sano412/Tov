import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getAdminDashboard } from "@/lib/admin-dashboard";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { adminNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

export default async function AdminBookingsPage() {
  const admin = await requireSuperAdmin();
  const dashboard = await getAdminDashboard(admin);

  return (
    <DashboardShell
      description="Monitor recent platform booking activity without mixing it into public pages."
      eyebrow="Super admin"
      navItems={adminNavItems}
      title="Bookings"
    >
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-tovlo-line/30 p-6">
          <StatusPill>Recent bookings</StatusPill>
          <h2 className="mt-4 text-3xl font-black text-tovlo-text">Platform activity</h2>
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
              {dashboard.recentBookings.length > 0 ? (
                dashboard.recentBookings.map((booking) => (
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
                      <StatusPill tone={booking.status === "CONFIRMED" ? "success" : "neutral"}>
                        {booking.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-8 text-sm font-bold text-tovlo-muted" colSpan={5}>
                    No recent bookings yet.
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
