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
        "rounded-card border border-tovlo-line/55 bg-tovlo-surface/78 p-6 shadow-glass backdrop-blur-xl",
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
