import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getAdminDashboard } from "@/lib/admin-dashboard";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { adminNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export default async function AdminAnalyticsPage() {
  const admin = await requireSuperAdmin();
  const dashboard = await getAdminDashboard(admin);
  const metrics = [
    ["Confirmed recent bookings", dashboard.analyticsPreview.confirmedBookingShare, "success"],
    ["Pending recent bookings", dashboard.analyticsPreview.pendingBookingShare, "yellow"],
    ["Featured resource share", dashboard.analyticsPreview.activeResourceShare, "orange"],
  ] as const;

  return (
    <DashboardShell
      description="Small MVP analytics preview for operational health checks."
      eyebrow="Super admin"
      navItems={adminNavItems}
      title="Analytics"
    >
      <GlassCard>
        <StatusPill>Preview</StatusPill>
        <div className="mt-6 grid gap-5">
          {metrics.map(([label, value, tone]) => (
            <div key={label}>
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-black text-tovlo-text">{label}</p>
                <p className="text-sm font-black text-tovlo-yellow">{value}%</p>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-tovlo-background/60">
                <div
                  className={[
                    "h-full rounded-full",
                    tone === "success"
                      ? "bg-tovlo-success"
                      : tone === "yellow"
                        ? "bg-tovlo-yellow"
                        : "bg-tovlo-orange",
                  ].join(" ")}
                  style={{ width: `${value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </DashboardShell>
  );
}
