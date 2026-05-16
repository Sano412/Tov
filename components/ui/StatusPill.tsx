type StatusTone = "accent" | "success" | "booked" | "neutral";

type StatusPillProps = {
  children: React.ReactNode;
  tone?: StatusTone;
};

const toneClasses: Record<StatusTone, string> = {
  accent: "border-tovlo-yellow/35 bg-tovlo-yellow/10 text-tovlo-yellow",
  success: "border-tovlo-success/35 bg-tovlo-success/10 text-tovlo-success",
  booked: "border-tovlo-booked/35 bg-tovlo-booked/10 text-tovlo-booked",
  neutral: "border-tovlo-line/24 bg-tovlo-glass/8 text-tovlo-muted/85",
};

export function StatusPill({ children, tone = "accent" }: StatusPillProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-black uppercase tracking-[0.12em] shadow-innerGlow backdrop-blur-xl",
        toneClasses[tone],
      ].join(" ")}
    >
      {children}
    </span>
  );
}
