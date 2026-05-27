"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/login/actions";

type LoginFormProps = {
  nextPath: string;
};

const initialState: LoginState = {
  ok: false,
  message: "",
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input name="next" type="hidden" value={nextPath} />

      <label className="field-surface block rounded-2xl px-5 py-4">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
          Role
        </span>
        <select
          className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none"
          name="role"
          required
        >
          <option value="BUSINESS_OWNER">Business owner</option>
          <option value="SUPER_ADMIN">Super admin</option>
        </select>
      </label>

      <label className="field-surface block rounded-2xl px-5 py-4">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
          Demo access code
        </span>
        <input
          className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none placeholder:text-tovlo-muted/55"
          name="accessCode"
          placeholder="tovlo-demo"
          required
          type="password"
        />
      </label>

      {state.message && (
        <p className="rounded-2xl border border-tovlo-booked/35 bg-tovlo-booked/10 px-4 py-3 text-sm font-bold text-tovlo-booked">
          {state.message}
        </p>
      )}

      <button
        className="premium-button inline-flex min-h-14 w-full items-center justify-center rounded-full bg-gradient-to-r from-tovlo-orange to-tovlo-yellow px-6 py-3 text-sm font-black text-[#120A04] shadow-glow transition duration-200 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
