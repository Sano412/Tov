import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { logoutAction } from "@/app/login/actions";
import { getCurrentSession } from "@/lib/auth/session";

export async function Header() {
  const session = await getCurrentSession();

  return (
    <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8">
      <a className="group flex items-center gap-2 text-3xl font-black text-tovlo-text" href="/">
        Tovlo
        <span
          className="h-3 w-3 rounded-full bg-tovlo-orange shadow-[0_0_22px_rgba(249,115,22,0.7)] transition group-hover:scale-125"
          aria-hidden="true"
        />
      </a>
      <nav className="hidden items-center gap-6 sm:flex" aria-label="Main navigation">
        <a className="text-sm font-bold text-tovlo-muted/85 transition hover:text-tovlo-text" href="/">
          Explore
        </a>
        <a
          className="text-sm font-bold text-tovlo-muted/85 transition hover:text-tovlo-text"
          href="/resources"
        >
          Rooms
        </a>
        <a
          className="text-sm font-bold text-tovlo-muted/85 transition hover:text-tovlo-text"
          href="/dashboard"
        >
          My bookings
        </a>
        <a
          className="text-sm font-bold text-tovlo-muted/85 transition hover:text-tovlo-text"
          href={session?.role === "SUPER_ADMIN" ? "/admin" : "/business"}
        >
          {session?.role === "SUPER_ADMIN" ? "Admin" : "Business"}
        </a>
      </nav>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        {session ? (
          <form action={logoutAction}>
            <Button className="hidden sm:inline-flex" variant="secondary" type="submit">
              Logout
            </Button>
          </form>
        ) : (
          <a href="/login">
            <Button className="hidden sm:inline-flex">Login</Button>
          </a>
        )}
      </div>
    </header>
  );
}
