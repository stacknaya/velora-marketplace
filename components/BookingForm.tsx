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
    modifiers={{
  past: { before: earliestBookingDate },
  unavailable: unavailableDates
}}
    modifiersClassNames={{
  past: "opacity-30 [&>button]:text-[#172033]/30",
  unavailable:
    "[&>button]:text-[#172033] [&>button]:line-through [&>button]:decoration-2 [&>button]:decoration-[#172033]/60"
}}
    numberOfMonths={1}
    classNames={{
  months: "w-full",
  month: "w-full",
  month_caption: "mb-4 flex items-center justify-between",
  caption_label: "text-lg font-black text-[#172033]",
  nav: "flex items-center gap-2",
  button_previous:
    "h-9 w-9 rounded-full border border-[#172033]/10 bg-white text-[#172033] hover:border-[#c9a96e]",
  button_next:
    "h-9 w-9 rounded-full border border-[#172033]/10 bg-white text-[#172033] hover:border-[#c9a96e]",
  month_grid: "w-full border-collapse",
  weekdays: "text-[#172033]/40",
  weekday:
    "pb-2 text-center text-[10px] font-black uppercase tracking-wider",
  week: "mt-1",
  day: "p-1 text-center",
  day_button:
  "mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-[#172033] transition hover:bg-[#f4ead8] hover:text-[#172033]",
  selected:
  "[&>button]:bg-[#172033] [&>button]:text-white",
  range_start:
  "[&>button]:bg-[#172033] [&>button]:text-white [&>button]:rounded-full",
range_end:
  "[&>button]:bg-[#172033] [&>button]:text-white [&>button]:rounded-full",
range_middle:
  "[&>button]:bg-[#f4ead8] [&>button]:text-[#172033] [&>button]:rounded-none",
  disabled:
  "cursor-not-allowed opacity-30 [&>button]:text-[#172033]/30",
     
}}
  />
        <div className="mt-4 flex flex-wrap gap-4 text-xs font-semibold text-[#172033]/55">
  <div className="flex items-center gap-2">
    <span className="h-3 w-3 rounded-full bg-[#172033]" />
    Selected
  </div>

  <div className="flex items-center gap-2">
    <span className="h-3 w-3 rounded-full bg-[#f4ead8]" />
    Selected range
  </div>

  <div className="flex items-center gap-2">
    <span className="h-3 w-3 rounded-full border border-[#172033]/10 bg-white opacity-40" />
    Unavailable
  </div>
</div>
        {range?.from && (
  <div className="mt-4 rounded-[1.2rem] border border-[#172033]/10 bg-[#fffaf1] p-4">
    <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9a7a45]">
      Selected dates
    </p>

    <p className="mt-2 text-sm font-black text-[#172033]">
      {range.from.toLocaleDateString()}
      {range.to ? ` → ${range.to.toLocaleDateString()}` : ""}
    </p>
  </div>
)}

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
