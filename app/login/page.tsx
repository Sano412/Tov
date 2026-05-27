import { Header } from "@/components/Header";
import { LoginForm } from "@/components/LoginForm";

type LoginPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function getNextPath(value: string | string[] | undefined) {
  const rawValue = Array.isArray(value) ? value[0] : value;

  if (!rawValue || !rawValue.startsWith("/") || rawValue.startsWith("//")) {
    return "/";
  }

  return rawValue;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = (await searchParams) ?? {};
  const nextPath = getNextPath(params.next);

  return (
    <main className="page-shell min-h-screen">
      <Header />
      <section className="mx-auto grid min-h-[72vh] w-full max-w-6xl items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.16em] text-tovlo-yellow">
            Tovlo access
          </p>
          <h1 className="mt-5 text-5xl font-black leading-[1.05] text-tovlo-text sm:text-7xl">
            Sign in to manage bookings.
          </h1>
          <p className="mt-6 max-w-2xl text-base font-medium leading-[1.65] text-tovlo-muted">
            This MVP uses local role access so you can test owner and admin workflows now.
            Production auth can replace this without changing the route separation.
          </p>
        </div>

        <div className="premium-card rounded-card border border-tovlo-line/35 bg-tovlo-surface/95 p-7 shadow-glass sm:p-9">
          <h2 className="text-3xl font-black text-tovlo-text">Demo login</h2>
          <p className="mt-3 text-sm font-medium leading-[1.6] text-tovlo-muted">
            Access code: <span className="font-black text-tovlo-yellow">tovlo-demo</span>
          </p>
          <LoginForm nextPath={nextPath} />
        </div>
      </section>
    </main>
  );
}
