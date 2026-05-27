import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireBusinessOwner } from "@/lib/auth/guards";
import { getBusinessDashboard } from "@/lib/business-dashboard";
import { formatPrice } from "@/lib/format";
import { businessNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export default async function BusinessResourcesPage() {
  const owner = await requireBusinessOwner();
  const dashboard = await getBusinessDashboard(owner);

  return (
    <DashboardShell
      description="Manage the reservable resources that customers can discover and request."
      eyebrow="Business"
      navItems={businessNavItems}
      title="Resources"
    >
      <GlassCard className="overflow-hidden p-0">
        <div className="border-b border-tovlo-line/30 p-6">
          <StatusPill>Inventory</StatusPill>
          <h2 className="mt-4 text-3xl font-black text-tovlo-text">Rooms and resources</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] border-collapse text-left">
            <thead className="text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Capacity</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-tovlo-line/20">
              {dashboard?.resources.length ? (
                dashboard.resources.map((resource) => (
                  <tr key={resource.id}>
                    <td className="px-6 py-4 font-black text-tovlo-text">{resource.name}</td>
                    <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                      {resource.branchName}
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                      {resource.capacityMin}-{resource.capacityMax} people
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-tovlo-muted">
                      {formatPrice(resource.pricePerHour)} MNT/hour
                    </td>
                    <td className="px-6 py-4">
                      <StatusPill tone={resource.status === "ACTIVE" ? "success" : "neutral"}>
                        {resource.status}
                      </StatusPill>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-6 py-8 text-sm font-bold text-tovlo-muted" colSpan={5}>
                    No resources have been added yet.
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
