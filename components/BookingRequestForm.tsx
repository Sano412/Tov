"use client";

import { useActionState } from "react";
import {
  submitBookingRequest,
  type BookingRequestState,
} from "@/app/resources/[slug]/actions";

type BookingRequestFormProps = {
  resourceSlug: string;
  availableSlots: string[];
};

const initialState: BookingRequestState = {
  ok: false,
  message: "",
};

const today = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Ulaanbaatar",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
}).format(new Date());

function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) {
    return null;
  }

  return <p className="mt-2 text-xs font-bold text-tovlo-booked">{errors[0]}</p>;
}

export function BookingRequestForm({
  resourceSlug,
  availableSlots,
}: BookingRequestFormProps) {
  const [state, formAction, pending] = useActionState(submitBookingRequest, initialState);
  const slotOptions = availableSlots.length > 0 ? availableSlots : ["18:00", "19:00", "20:00"];

  return (
    <form action={formAction} className="mt-6 space-y-4">
      <input name="resourceSlug" type="hidden" value={resourceSlug} />

      <label className="block rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
          Нэр
        </span>
        <input
          className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none placeholder:text-tovlo-muted/65"
          name="customerName"
          placeholder="Таны нэр"
          required
        />
        <FieldError errors={state.fieldErrors?.customerName} />
      </label>

      <label className="block rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
          Утас
        </span>
        <input
          className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none placeholder:text-tovlo-muted/65"
          inputMode="tel"
          name="customerPhone"
          placeholder="99112233"
          required
        />
        <FieldError errors={state.fieldErrors?.customerPhone} />
      </label>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="block rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
            Өдөр
          </span>
          <input
            className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none"
            defaultValue={today}
            min={today}
            name="date"
            required
            type="date"
          />
          <FieldError errors={state.fieldErrors?.date} />
        </label>

        <label className="block rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
          <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
            Эхлэх цаг
          </span>
          <select
            className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none"
            name="startTime"
            required
          >
            {slotOptions.map((slot) => (
              <option key={slot}>{slot}</option>
            ))}
          </select>
          <FieldError errors={state.fieldErrors?.startTime} />
        </label>
      </div>

      <label className="block rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
          Үргэлжлэх цаг
        </span>
        <select
          className="mt-2 w-full bg-transparent text-sm font-black text-tovlo-text outline-none"
          defaultValue="2"
          name="durationHours"
          required
        >
          {[1, 2, 3, 4, 5, 6].map((hour) => (
            <option key={hour} value={hour}>
              {hour} цаг
            </option>
          ))}
        </select>
        <FieldError errors={state.fieldErrors?.durationHours} />
      </label>

      <label className="block rounded-3xl border border-tovlo-line/35 bg-tovlo-background/45 px-4 py-3">
        <span className="text-[11px] font-black uppercase tracking-[0.12em] text-tovlo-yellow">
          Тэмдэглэл
        </span>
        <textarea
          className="mt-2 min-h-20 w-full resize-none bg-transparent text-sm font-medium text-tovlo-text outline-none placeholder:text-tovlo-muted/65"
          name="note"
          placeholder="Хүсвэл нэмэлт мэдээлэл бичнэ үү"
        />
        <FieldError errors={state.fieldErrors?.note} />
      </label>

      {state.message && (
        <p
          className={[
            "rounded-3xl border px-4 py-3 text-sm font-bold leading-[1.55]",
            state.ok
              ? "border-tovlo-success/50 bg-tovlo-success/10 text-tovlo-success"
              : "border-tovlo-booked/50 bg-tovlo-booked/10 text-tovlo-booked",
          ].join(" ")}
        >
          {state.message}
        </p>
      )}

      <button
        className="inline-flex min-h-12 w-full items-center justify-center rounded-full bg-gradient-to-r from-tovlo-orange to-tovlo-yellow px-6 py-3 text-sm font-black text-[#120A04] shadow-glow transition duration-200 hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "Илгээж байна..." : "Захиалгын хүсэлт илгээх"}
      </button>
    </form>
  );
}
