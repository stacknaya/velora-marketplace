"use client";

import { useState } from "react";
import { DayPicker, type DateRange } from "react-day-picker";
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

  const unavailableDates = unavailableRanges.map((item) => {
    const from = new Date(`${item.start}T00:00:00`);
    const end = new Date(`${item.end}T00:00:00`);

    const to = new Date(end);
    to.setDate(to.getDate() - 1);

    return {
      from,
      to: to < from ? from : to
    };
  });

  const formatDate = (date?: Date) => {
    if (!date) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const bookingDays = (() => {
    if (!range?.from || !range?.to) return 0;

    const difference =
      range.to.getTime() - range.from.getTime();

    return Math.ceil(
      difference / (1000 * 60 * 60 * 24)
    );
  })();

  const minimumBookingMet =
    Boolean(range?.from && range?.to) &&
    bookingDays >= minDays;

  return (
    <form action={action}>
      <div className="mt-6 grid gap-6 lg:grid-cols-[210px_1fr]">
        {/* Side legend */}
        <aside className="rounded-[1.8rem] border border-[#172033]/10 bg-[#fffaf1] p-5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9a7a45]">
            Calendar guide
          </p>

          <div className="mt-5 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f1efe9] text-sm font-black text-[#172033]/25">
                1
              </div>
              <div>
                <p className="text-sm font-black text-[#172033]">
                  Past dates
                </p>
                <p className="text-xs text-[#172033]/50">
                  Faded and disabled
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center text-sm font-black text-[#172033] line-through decoration-2 decoration-[#172033]/70">
                14
              </div>
              <div>
                <p className="text-sm font-black text-[#172033]">
                  Unavailable dates
                </p>
                <p className="text-xs text-[#172033]/50">
                  Crossed out
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center text-sm font-black text-[#172033]">
                15
              </div>
              <div>
                <p className="text-sm font-black text-[#172033]">
                  Available dates
                </p>
                <p className="text-xs text-[#172033]/50">
                  Normal style
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#172033] text-sm font-black text-white">
                9
              </div>
              <div>
                <p className="text-sm font-black text-[#172033]">
                  Selected date
                </p>
                <p className="text-xs text-[#172033]/50">
                  Navy circle
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4ead8] text-sm font-black text-[#172033]">
                10
              </div>
              <div>
                <p className="text-sm font-black text-[#172033]">
                  Selected range
                </p>
                <p className="text-xs text-[#172033]/50">
                  Champagne background
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Calendar */}
        <div className="rounded-[1.8rem] border border-[#172033]/10 bg-white p-5 shadow-sm">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={1}
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
              month_grid:
                "w-full border-collapse",
              weekdays:
                "text-[#172033]/45",
              weekday:
                "pb-3 text-center text-[10px] font-black uppercase tracking-[0.12em]",
              week:
                "mt-1",
              day:
                "p-1 text-center",
              day_button:
                "mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-[#172033] transition hover:bg-[#f4ead8]",
              selected:
                "[&>button]:bg-[#172033] [&>button]:text-white",
              range_start:
                "[&>button]:bg-[#172033] [&>button]:text-white [&>button]:rounded-full",
              range_end:
                "[&>button]:bg-[#172033] [&>button]:text-white [&>button]:rounded-full",
              range_middle:
                "[&>button]:bg-[#f4ead8] [&>button]:text-[#172033] [&>button]:rounded-full",
              disabled:
                "cursor-not-allowed"
            }}
          />

          <div className="mt-5 flex flex-wrap gap-5 border-t border-[#172033]/10 pt-4 text-xs font-semibold text-[#172033]/60">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#172033]" />
              Selected
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#f4ead8]" />
              Selected range
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#172033] line-through decoration-2">
                14
              </span>
              Unavailable
            </div>
          </div>

          {range?.from && (
            <div className="mt-5 rounded-[1.3rem] border border-[#172033]/10 bg-[#fffaf1] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#9a7a45]">
                Selected dates
              </p>

              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm font-black text-[#172033]">
                  {range.from.toLocaleDateString()}
                  {range.to
                    ? ` → ${range.to.toLocaleDateString()}`
                    : ""}
                </p>

                {range.to && (
                  <p className="text-sm font-bold text-[#172033]/60">
                    {bookingDays} day
                    {bookingDays === 1 ? "" : "s"}
                  </p>
                )}
              </div>
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

          {range?.from &&
            range?.to &&
            !minimumBookingMet && (
              <p className="mt-3 text-sm font-semibold text-red-600">
                Minimum booking is {minDays} day
                {minDays === 1 ? "" : "s"}.
              </p>
            )}

          <button
            type="submit"
            disabled={
              !range?.from ||
              !range?.to ||
              !minimumBookingMet
            }
            className="mt-5 w-full rounded-[1.2rem] bg-[#172033] px-5 py-4 font-black text-white transition hover:bg-[#24304a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Reserve
          </button>
        </div>
      </div>
    </form>
  );
}
