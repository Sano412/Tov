import type { ReactNode, SectionHTMLAttributes } from "react";

type SectionShellProps = SectionHTMLAttributes<HTMLElement> & {
  children: ReactNode;
  eyebrow?: string;
  title?: string;
};

export function SectionShell({
  children,
  className = "",
  eyebrow,
  title,
  ...props
}: SectionShellProps) {
  return (
    <section
      className={["mx-auto w-full max-w-6xl px-5 py-12 sm:px-8", className].join(" ")}
      {...props}
    >
      {(eyebrow || title) && (
        <div className="mb-7 max-w-3xl">
          {eyebrow && (
            <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-tovlo-yellow">
              {eyebrow}
            </p>
          )}
          {title && (
            <h2 className="text-3xl font-black leading-[1.05] text-tovlo-text sm:text-5xl">
              {title}
            </h2>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
