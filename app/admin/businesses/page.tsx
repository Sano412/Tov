import { AdminBusinessDecisionForm } from "@/components/AdminBusinessDecisionForm";
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

export default async function AdminBusinessesPage() {
  const admin = await requireSuperAdmin();
  const dashboard = await getAdminDashboard(admin);

  return (
    <DashboardShell
      description="Approve or reject businesses before their resources can appear publicly."
      eyebrow="Super admin"
      navItems={adminNavItems}
      title="Businesses"
    >
      <GlassCard>
        <StatusPill tone="booked">Pending approvals</StatusPill>
        <div className="mt-5 grid gap-3">
          {dashboard.pendingBusinesses.length > 0 ? (
            dashboard.pendingBusinesses.map((business) => (
              <div
                className="rounded-3xl border border-tovlo-line/30 bg-tovlo-background/40 p-4"
                key={business.id}
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-black text-tovlo-text">{business.name}</p>
                    <p className="mt-1 text-sm font-medium text-tovlo-muted">
                      {business.slug} · {formatDate(business.createdAt)}
                    </p>
                  </div>
                  <AdminBusinessDecisionForm businessId={business.id} />
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
    </DashboardShell>
  );
}
