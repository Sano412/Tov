import type { HTMLAttributes, ReactNode } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={[
        "rounded-card border border-tovlo-line/22 bg-tovlo-glass/8 p-6 shadow-glass shadow-innerGlow backdrop-blur-2xl",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
