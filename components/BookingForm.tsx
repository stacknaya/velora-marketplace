"use client";

import { useState } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import "react-day-picker/style.css";

export default function BookingForm({
  action,
advanceNoticeHr = 0,
minDays = 1,
unavailableRanges = []
}: {
  action: (formData: FormData) => void;
  advanceNoticeHr?: number;
  minDays?: number;
  unavailableRanges?: {
    start: string;
    end: string;
  }[];
}) {
 const [range, setRange] = useState<DateRange | undefined>();
  const today = new Date();
today.setHours(0, 0, 0, 0);
  const earliestBookingDate = new Date();
earliestBookingDate.setHours(
  earliestBookingDate.getHours() + advanceNoticeHr
);

const unavailableDates = unavailableRanges.map((range) => ({
  from: new Date(`${range.start}T00:00:00`),
  to: new Date(`${range.end}T00:00:00`)
}));

const formatDate = (date?: Date) => {
  if (!date) return "";
  return date.toISOString().split("T")[0];
};
  const minimumNightsMet = (() => {
  if (!range?.from || !range?.to) return false;

  const difference =
    range.to.getTime() - range.from.getTime();

  const days = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  return days >= minDays;
})();

  return (
    <form action={action}>
      <div className="mt-6 rounded-[1.3rem] border border-[#172033]/15 p-4">
  <DayPicker
    mode="range"
    selected={range}
    onSelect={setRange}
   disabled={[
  { before: earliestBookingDate },
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

{range?.from && range?.to && !minimumNightsMet && (
  <p className="mt-3 text-sm font-semibold text-red-600">
    Minimum booking is {minDays} day{minDays === 1 ? "" : "s"}.
  </p>
)}
</div>
      <button
        type="submit"
disabled={!range?.from || !range?.to || !minimumNightsMet}
        className="mt-5 w-full rounded-[1.2rem] bg-[#172033] px-5 py-4 font-black text-white transition hover:bg-[#24304a] disabled:cursor-not-allowed disabled:opacity-40"
      >
        Reserve
      </button>
    </form>
  );
}
