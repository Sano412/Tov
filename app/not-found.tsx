import { Header } from "@/components/Header";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <main className="page-shell min-h-screen">
      <Header />
      <section className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col items-center justify-center px-5 text-center sm:px-8">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-tovlo-yellow">
          Not found
        </p>
        <h1 className="mt-5 text-5xl font-black leading-[1.05] text-tovlo-text sm:text-7xl">
          This room is not available.
        </h1>
        <p className="mt-6 max-w-2xl text-base font-medium leading-[1.65] text-tovlo-muted">
          The listing may have been removed, hidden, or not approved for public booking yet.
        </p>
        <a className="mt-8" href="/resources">
          <Button>Browse rooms</Button>
        </a>
      </section>
    </main>
  );
}
