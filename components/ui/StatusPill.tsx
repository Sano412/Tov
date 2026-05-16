type StatusTone = "accent" | "success" | "booked" | "neutral";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  accent: "border-tovlo-yellow/50 bg-tovlo-yellow/12 text-tovlo-yellow",
  success: "border-tovlo-success/50 bg-tovlo-success/12 text-tovlo-success",
  booked: "border-tovlo-booked/50 bg-tovlo-booked/12 text-tovlo-booked",
  neutral: "border-tovlo-line/45 bg-tovlo-surface2/60 text-tovlo-muted",
};

export function StatusPill({ children, tone = "accent" }: StatusPillProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em]",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
