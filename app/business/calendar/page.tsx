import { DashboardShell } from "@/components/DashboardShell";
import { GlassCard } from "@/components/ui/GlassCard";
import { StatusPill } from "@/components/ui/StatusPill";
import { requireBusinessOwner } from "@/lib/auth/guards";
import { getBusinessDashboard } from "@/lib/business-dashboard";
import { businessNavItems } from "@/lib/navigation";

export const dynamic = "force-dynamic";

const hours = ["16:00", "18:00", "20:00", "22:00", "00:00", "02:00"];

function formatHour(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Ulaanbaatar",
  }).format(date);
}

export default async function BusinessCalendarPage() {
  const owner = await requireBusinessOwner();
  const dashboard = await getBusinessDashboard(owner);

  return (
    <DashboardShell
      description="See which resources are occupied across the evening."
      eyebrow="Business"
      navItems={businessNavItems}
      title="Calendar"
    >
      <GlassCard>
        <StatusPill>Today</StatusPill>
        <h2 className="mt-4 text-3xl font-black text-tovlo-text">Schedule heatmap</h2>
        <div className="mt-8 overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[150px_repeat(6,1fr)] gap-3 text-xs font-black uppercase tracking-[0.08em] text-tovlo-yellow">
              <span>Resource</span>
              {hours.map((hour) => (
                <span key={hour}>{hour}</span>
              ))}
            </div>
            <div className="mt-4 grid gap-3">
              {dashboard?.resources.map((resource) => (
                <div className="grid grid-cols-[150px_repeat(6,1fr)] items-center gap-3" key={resource.id}>
                  <p className="truncate text-sm font-black text-tovlo-text">{resource.name}</p>
                  {hours.map((hour) => {
                    const booked = dashboard.todayBookings.some(
                      (booking) =>
                        booking.resourceName === resource.name &&
                        formatHour(booking.startTime) <= hour &&
                        formatHour(booking.endTime) > hour,
                    );

                    return (
                      <span
                        className={[
                          "h-9 rounded-xl border border-tovlo-line/25",
                          booked
                            ? "bg-gradient-to-r from-tovlo-orange to-tovlo-yellow"
                            : "bg-tovlo-glass/8",
                        ].join(" ")}
                        key={`${resource.id}-${hour}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </GlassCard>
    </DashboardShell>
  );
}
