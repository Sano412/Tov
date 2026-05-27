import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { getAdminDashboard } from "@/lib/admin-dashboard";
import { requireSuperAdmin } from "@/lib/auth/guards";
import { adminNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const admin = await requireSuperAdmin();
  const dashboard = await getAdminDashboard(admin);

  return (
    <DashboardShell
      description="Generic categories keep Tovlo expandable beyond karaoke later."
      eyebrow="Super admin"
      navItems={adminNavItems}
      title="Categories"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        {dashboard.categories.length > 0 ? (
          dashboard.categories.map((category) => (
            <GlassCard key={category.id}>
              <StatusPill>{category.slug}</StatusPill>
              <h2 className="mt-4 text-3xl font-black text-tovlo-text">{category.name}</h2>
              <p className="mt-3 text-sm font-medium text-tovlo-muted">
                {category.resourceCount} resources
              </p>
            </GlassCard>
          ))
        ) : (
          <GlassCard>
            <h2 className="text-2xl font-black text-tovlo-text">No categories yet.</h2>
            <p className="mt-3 text-sm font-medium text-tovlo-muted">
              Seed or create categories before adding resources.
            </p>
          </GlassCard>
        )}
      </div>
    </DashboardShell>
  );
}
