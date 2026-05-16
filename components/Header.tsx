import { Button } from "@/components/ui/Button";

export function Header() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <a className="flex items-center gap-2 text-2xl font-black text-tovlo-text" href="/">
        Tovlo
        <span className="h-2.5 w-2.5 rounded-full bg-tovlo-orange" aria-hidden="true" />
      </a>
      <nav className="hidden items-center gap-2 sm:flex" aria-label="Main navigation">
        <a className="rounded-full px-4 py-2 text-sm font-bold text-tovlo-muted transition hover:text-tovlo-text" href="#how-it-works">
          Яаж ажиллах вэ
        </a>
        <a className="rounded-full px-4 py-2 text-sm font-bold text-tovlo-muted transition hover:text-tovlo-text" href="#featured">
          Өрөөнүүд
        </a>
        <a className="rounded-full px-4 py-2 text-sm font-bold text-tovlo-muted transition hover:text-tovlo-text" href="#rules">
          Дүрэм
        </a>
      </nav>
      <Button className="hidden sm:inline-flex" variant="secondary">
        Товлох
      </Button>
    </header>
  );
}
