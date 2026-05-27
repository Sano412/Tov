import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-tovlo-orange via-tovlo-softOrange to-tovlo-yellow text-[#120A04] shadow-glow hover:translate-y-[-2px] hover:brightness-110",
  secondary:
    "border border-tovlo-line/28 bg-tovlo-glass/9 text-tovlo-text shadow-innerGlow backdrop-blur-xl hover:border-tovlo-yellow/70 hover:bg-tovlo-glassStrong/12",
  ghost: "text-tovlo-muted/85 hover:bg-tovlo-glass/8 hover:text-tovlo-text",
};

export function Button({
  children,
  className = "",
  variant = "primary",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "premium-button inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-200 focus:outline-none focus:ring-2 focus:ring-tovlo-yellow/80 focus:ring-offset-2 focus:ring-offset-tovlo-background disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      ].join(" ")}
      type={type}
      {...props}
    >
      {children}
    </button>
  );
}
