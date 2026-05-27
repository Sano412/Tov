"use client";

import { useActionState } from "react";
import {
  submitAdminBusinessDecision,
  type AdminBusinessDecisionState,
} from "@/app/admin/actions";

type AdminBusinessDecisionFormProps = {
  businessId: string;
};

const initialState: AdminBusinessDecisionState = {
  ok: false,
  message: "",
};

export function AdminBusinessDecisionForm({ businessId }: AdminBusinessDecisionFormProps) {
  const [state, formAction, pending] = useActionState(
    submitAdminBusinessDecision,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-2">
      <input name="businessId" type="hidden" value={businessId} />
      <div className="flex gap-2">
        <button
          className="rounded-full border border-tovlo-success/50 px-4 py-2 text-xs font-black text-tovlo-success transition hover:bg-tovlo-success/10 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          name="decision"
          type="submit"
          value="APPROVE"
        >
          Approve
        </button>
        <button
          className="rounded-full border border-tovlo-booked/50 px-4 py-2 text-xs font-black text-tovlo-booked transition hover:bg-tovlo-booked/10 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={pending}
          name="decision"
          type="submit"
          value="REJECT"
        >
          Reject
        </button>
      </div>
      {state.message && (
        <p
          className={[
            "max-w-[220px] text-xs font-bold leading-[1.45]",
            state.ok ? "text-tovlo-success" : "text-tovlo-booked",
          ].join(" ")}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}
