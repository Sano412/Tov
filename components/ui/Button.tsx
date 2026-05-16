import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-gradient-to-r from-tovlo-orange to-tovlo-yellow text-[#120A04] shadow-glow hover:translate-y-[-1px]",
  secondary:
    "border border-tovlo-line/60 bg-tovlo-surface/70 text-tovlo-text hover:border-tovlo-yellow/80",
  ghost: "text-tovlo-muted hover:bg-tovlo-surface/70 hover:text-tovlo-text",
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
        "inline-flex min-h-12 items-center justify-center rounded-full px-6 py-3 text-sm font-black transition duration-200 focus:outline-none focus:ring-2 focus:ring-tovlo-yellow/80 focus:ring-offset-2 focus:ring-offset-tovlo-background disabled:cursor-not-allowed disabled:opacity-60",
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
