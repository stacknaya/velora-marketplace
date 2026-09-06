"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

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
 const [range, setRange] = useState<DateRange | undefined>();
  const today = new Date();
today.setHours(0, 0, 0, 0);

const unavailableDates = unavailableRanges.map((range) => ({
  from: new Date(`${range.start}T00:00:00`),
  to: new Date(`${range.end}T00:00:00`)
}));

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};

  return (
    <form action={action}>
      <div className="mt-6 rounded-[1.3rem] border border-[#172033]/15 p-4">
  <DayPicker
    mode="range"
    selected={range}
    onSelect={setRange}
    disabled={[
      { before: today },
      ...unavailableDates
    ]}
    numberOfMonths={1}
  />

  <input
    type="hidden"
    name="startAt"
    value={formatDate(range?.from)}
  />

  <input
    type="hidden"
    name="endAt"
    value={formatDate(range?.to)}
  />
</div>
      <button
        type="submit"
disabled={!range?.from || !range?.to}
        className="mt-5 w-full rounded-[1.2rem] bg-[#172033] px-5 py-4 font-black text-white transition hover:bg-[#24304a] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reserve
      </button>
    </form>
  );
}
