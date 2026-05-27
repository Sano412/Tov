import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireBusinessOwner } from "@/lib/auth/guards";
import { getBusinessDashboard } from "@/lib/business-dashboard";
import { businessNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export default async function BusinessBranchesPage() {
  const owner = await requireBusinessOwner();
  const dashboard = await getBusinessDashboard(owner);

  return (
    <DashboardShell
      description="Branches group resources by location and booking hours."
      eyebrow="Business"
      navItems={businessNavItems}
      title="Branches"
    >
      <div className="grid gap-5 md:grid-cols-2">
        {dashboard?.business.branches.length ? (
          dashboard.business.branches.map((branch) => (
            <GlassCard key={branch.id}>
              <StatusPill>{branch.district}</StatusPill>
              <h2 className="mt-4 text-3xl font-black text-tovlo-text">{branch.name}</h2>
              <p className="mt-3 text-sm font-medium text-tovlo-muted">
                Branch settings and full schedule editing can plug into this page next.
              </p>
            </GlassCard>
          ))
        ) : (
          <GlassCard>
            <h2 className="text-2xl font-black text-tovlo-text">No branches yet.</h2>
            <p className="mt-3 text-sm font-medium text-tovlo-muted">
              Add a branch before publishing resources.
            </p>
          </GlassCard>
        )}
      </div>
    </DashboardShell>
  );
}
