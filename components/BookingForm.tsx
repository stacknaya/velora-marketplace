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

  const bookingDays = (() => {
    if (!range?.from || !range?.to) return 0;

    const difference = range.to.getTime() - range.from.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  })();

  const minimumNightsMet =
    range?.from && range?.to
      ? bookingDays >= minDays
      : false;

  return (
    <form action={action}>
      <div className="mt-6 rounded-[1.8rem] border border-[#172033]/10 bg-white p-5 shadow-sm">
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
            past:
              "[&>button]:bg-[#f1efe9] [&>button]:text-[#172033]/25 [&>button]:opacity-100",
            unavailable:
              "!opacity-100 [&>button]:!text-[#172033] [&>button]:line-through [&>button]:decoration-2 [&>button]:decoration-[#172033]/70"
          }}
          numberOfMonths={1}
          classNames={{
            months: "w-full",
            month: "w-full",

            month_caption:
              "mb-5 flex items-center justify-between",

            caption_label:
              "text-xl font-black text-[#172033]",

            nav:
              "flex items-center gap-2",

            button_previous:
              "flex h-10 w-10 items-center justify-center rounded-full border border-[#172033]/10 bg-white text-[#172033] shadow-sm transition hover:border-[#c9a96e] hover:bg-[#fffaf1]",

            button_next:
              "flex h-10 w-10 items-center justify-center rounded-full border border-[#172033]/10 bg-white text-[#172033] shadow-sm transition hover:border-[#c9a96e] hover:bg-[#fffaf1]",
