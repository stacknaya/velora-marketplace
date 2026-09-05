"use client";

import { useState } from "react";

export default function BookingForm({
  action
}: {
  action: (formData: FormData) => void;
}) {
  const [startDate, setStartDate] = useState("");

  const today = new Date().toISOString().split("T")[0];

  return (
    <form action={action}>
      <div className="mt-6 overflow-hidden rounded-[1.3rem] border border-[#172033]/15">
        <div className="grid grid-cols-2 divide-x divide-[#172033]/10">
          
          <label className="p-4">
            <span className="block text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
              Start
            </span>

            <input
              type="date"
              name="startAt"
              required
              min={today}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 w-full bg-transparent text-sm font-bold outline-none"
            />
          </label>

          <label className="p-4">
            <span className="block text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
              End
            </span>

            <input
              type="date"
              name="endAt"
              required
              min={startDate || today}
              disabled={!startDate}
              className="mt-1 w-full bg-transparent text-sm font-bold outline-none disabled:cursor-not-allowed disabled:opacity-40"
            />
          </label>

        </div>
      </div>

      <button
        type="submit"
        disabled={!startDate}
        className="mt-5 w-full rounded-[1.2rem] bg-[#172033] px-5 py-4 font-black text-white transition hover:bg-[#24304a] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reserve
      </button>
    </form>
  );
}
