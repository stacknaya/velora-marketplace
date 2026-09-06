"use client";

import { useState } from "react";

export default function BookingForm({
  action,
  unavailableRanges = []
}: {
  action: (formData: FormData) => void;
  unavailableRanges?: {
    start: string;
    end: string;
  }[];
}) {
  const [startDate, setStartDate] = useState("");
  const today = new Date().toISOString().split("T")[0];

  const isDateUnavailable = (date: string) => {
  return unavailableRanges.some((range) => {
    return date >= range.start && date < range.end;
  });
};

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
              onBlur={(e) => {
  if (isDateUnavailable(e.target.value)) {
    setStartDate("");
    alert("That start date is not available.");
  }
}}
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
              onChange={(e) => {
  const endDate = e.target.value;

  const crossesUnavailableRange = unavailableRanges.some((range) => {
    return startDate < range.end && endDate > range.start;
  });

  if (crossesUnavailableRange) {
    e.target.value = "";
    alert("Those dates include unavailable dates. Please choose another end date.");
  }
}}
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
