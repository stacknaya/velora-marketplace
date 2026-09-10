"use client";

import { useMemo, useState, useTransition } from "react";
import { DayPicker, DateRange } from "react-day-picker";
import { useRouter } from "next/navigation";
import {
  blockListingDates,
  unblockListingDates,
} from "@/app/actions/calendar";

type CalendarBooking = {
  id: string;
  startAt: string;
  endAt: string;
  status: string;
};

type CalendarBlockedDate = {
  id: string;
  startAt: string;
  endAt: string;
  reason: string | null;
};

export type CalendarListing = {
  id: string;
  title: string;
  slug: string;
  bookings: CalendarBooking[];
  blockedDates: CalendarBlockedDate[];
};

type HostCalendarProps = {
  listings: CalendarListing[];
};

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function dateOnly(value: string) {
  const date = new Date(value);

  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate()
  );
}

function previousDay(value: string) {
  const date = dateOnly(value);
  date.setDate(date.getDate() - 1);
  return date;
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export default function HostCalendar({
  listings,
}: HostCalendarProps) {
  const router = useRouter();

  const [selectedListingId, setSelectedListingId] = useState(
    listings[0]?.id ?? ""
  );

  const [range, setRange] = useState<DateRange | undefined>();
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const selectedListing = listings.find(
    (listing) => listing.id === selectedListingId
  );

  const today = useMemo(() => startOfDay(new Date()), []);

  const bookingRanges = useMemo(() => {
    if (!selectedListing) return [];

    return selectedListing.bookings
      .filter(
        (booking) =>
          booking.status === "PENDING" ||
          booking.status === "CONFIRMED"
      )
      .map((booking) => ({
        from: dateOnly(booking.startAt),
        to: previousDay(booking.endAt),
      }));
  }, [selectedListing]);

  const blockedRanges = useMemo(() => {
    if (!selectedListing) return [];

    return selectedListing.blockedDates.map((blockedDate) => ({
      from: dateOnly(blockedDate.startAt),
      to: previousDay(blockedDate.endAt),
    }));
  }, [selectedListing]);

  function handleListingChange(listingId: string) {
    setSelectedListingId(listingId);
    setRange(undefined);
    setMessage("");
  }

  function handleBlockDates() {
    if (!selectedListing || !range?.from) {
      setMessage("Select the dates you want to block.");
      return;
    }

    const from = range.from;
    const to = range.to ?? range.from;

    setMessage("");

    startTransition(async () => {
      const result = await blockListingDates(
        selectedListing.id,
        formatDateValue(from),
        formatDateValue(to)
      );

      if (!result.success) {
        setMessage(result.error ?? "Unable to block these dates.");
        return;
      }

      setRange(undefined);
      setMessage("Dates blocked successfully.");
      router.refresh();
    });
  }

  function handleUnblock(blockedDateId: string) {
    setMessage("");

    startTransition(async () => {
      const result = await unblockListingDates(blockedDateId);

      if (!result.success) {
        setMessage(result.error ?? "Unable to unblock these dates.");
        return;
      }

      setMessage("Dates are available again.");
      router.refresh();
    });
  }

  if (listings.length === 0) {
    return (
      <div className="rounded-[22px] border border-[#172033]/10 bg-white p-8">
        <h2 className="text-lg font-semibold text-[#172033]">
          No listings yet
        </h2>

        <p className="mt-2 text-sm leading-6 text-[#172033]/55">
          Create a listing before managing availability.
        </p>

        <a
          href="/host/listings/new"
          className="mt-5 inline-flex rounded-full bg-[#172033] px-5 py-2.5 text-sm font-semibold text-white"
        >
          List an asset
        </a>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      {/* CALENDAR */}
      <div className="rounded-[22px] border border-[#172033]/10 bg-white p-5 md:p-7">
        <div className="flex flex-col gap-4 border-b border-[#172033]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#9a7a45]">
              Manage availability
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#172033]">
              Listing calendar
            </h2>
          </div>

          <label className="w-full sm:w-[260px]">
            <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#172033]/45">
              Listing
            </span>

            <select
              value={selectedListingId}
              onChange={(e) => handleListingChange(e.target.value)}
              className="w-full rounded-[12px] border border-[#172033]/10 bg-[#f7f3ec] px-4 py-3 text-sm font-semibold text-[#172033] outline-none"
            >
              {listings.map((listing) => (
                <option key={listing.id} value={listing.id}>
                  {listing.title}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* LEGEND */}
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-[#172033]/60">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#172033]" />
            Selected
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#e4c994]" />
            Blocked by you
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-[#172033]/20" />
            Reserved
          </div>
        </div>

        {/* DAY PICKER */}
        <div className="mt-6 overflow-x-auto">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            excludeDisabled
            showOutsideDays={false}
            startMonth={
              new Date(today.getFullYear(), today.getMonth(), 1)
            }
            disabled={[
              {
                before: today,
              },
              ...bookingRanges,
              ...blockedRanges,
            ]}
            modifiers={{
              reserved: bookingRanges,
              hostBlocked: blockedRanges,
            }}
            modifiersClassNames={{
              selected:
                "!bg-[#172033] !text-white rounded-full font-semibold",
              range_start:
                "!bg-[#172033] !text-white rounded-full font-semibold",
              range_end:
                "!bg-[#172033] !text-white rounded-full font-semibold",
              range_middle:
                "!bg-[#e4c994]/35 !text-[#172033] rounded-none",
              hostBlocked:
                "!bg-[#e4c994] !text-[#172033] rounded-full line-through",
              reserved:
                "!bg-[#172033]/10 !text-[#172033]/45 rounded-full line-through",
              disabled:
                "opacity-35 cursor-not-allowed",
            }}
            classNames={{
              months: "flex flex-col gap-6",
              month: "space-y-4",
              month_caption:
                "relative flex h-10 items-center justify-center",
              caption_label:
                "text-[15px] font-bold text-[#172033]",
              nav: "absolute inset-x-0 top-0 flex items-center justify-between",
              button_previous:
                "flex h-9 w-9 items-center justify-center rounded-full border border-[#172033]/10 bg-white text-[#172033] hover:bg-[#f7f3ec]",
              button_next:
                "flex h-9 w-9 items-center justify-center rounded-full border border-[#172033]/10 bg-white text-[#172033] hover:bg-[#f7f3ec]",
              month_grid: "w-full border-collapse",
              weekdays: "grid grid-cols-7",
              weekday:
                "py-2 text-center text-[10px] font-bold uppercase tracking-[0.1em] text-[#172033]/35",
              week: "mt-1 grid grid-cols-7",
              day: "flex aspect-square items-center justify-center p-1",
              day_button:
                "flex h-10 w-10 items-center justify-center rounded-full text-[13px] font-medium transition hover:bg-[#f7f3ec]",
              today:
                "font-bold ring-1 ring-inset ring-[#c9a96e] rounded-full",
              outside: "text-[#172033]/20",
            }}
          />
        </div>

        {/* SELECTED RANGE */}
        <div className="mt-6 flex flex-col gap-4 rounded-[16px] bg-[#f7f3ec] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#172033]/40">
              Selected dates
            </p>

            <p className="mt-1 text-sm font-semibold text-[#172033]">
              {range?.from
                ? `${formatDate(range.from)}${
                    range.to && range.to.getTime() !== range.from.getTime()
                      ? ` – ${formatDate(range.to)}`
                      : ""
                  }`
                : "Select an available date or range"}
            </p>
          </div>

          <button
            type="button"
            onClick={handleBlockDates}
            disabled={!range?.from || isPending}
            className="rounded-full bg-[#172033] px-6 py-2.5 text-[12px] font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35"
          >
            {isPending ? "Saving..." : "Block dates"}
          </button>
        </div>

        {message && (
          <p className="mt-3 text-[12px] font-medium text-[#172033]/65">
            {message}
          </p>
        )}
      </div>

      {/* BLOCKED RANGE SIDEBAR */}
      <aside className="rounded-[22px] border border-[#172033]/10 bg-white p-5 md:p-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a7a45]">
          Availability
        </p>

        <h3 className="mt-1 text-lg font-bold text-[#172033]">
          Blocked dates
        </h3>

        <p className="mt-2 text-[13px] leading-5 text-[#172033]/50">
          Dates you manually block will not appear as available to guests.
        </p>

        <div className="mt-5 space-y-3">
          {selectedListing?.blockedDates.length ? (
            selectedListing.blockedDates.map((blockedDate) => {
              const from = dateOnly(blockedDate.startAt);
              const to = previousDay(blockedDate.endAt);

              return (
                <div
                  key={blockedDate.id}
                  className="rounded-[14px] border border-[#c9a96e]/30 bg-[#f4ead8] p-4"
                >
                  <p className="text-[13px] font-semibold text-[#172033]">
                    {formatDate(from)}
                    {from.getTime() !== to.getTime()
                      ? ` – ${formatDate(to)}`
                      : ""}
                  </p>

                  <p className="mt-1 text-[11px] text-[#172033]/50">
                    {blockedDate.reason || "Blocked by host"}
                  </p>

                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => handleUnblock(blockedDate.id)}
                    className="mt-3 text-[12px] font-semibold text-[#172033] underline underline-offset-4 disabled:opacity-40"
                  >
                    Make available
                  </button>
                </div>
              );
            })
          ) : (
            <div className="rounded-[14px] border border-dashed border-[#172033]/15 p-5">
              <p className="text-[13px] font-semibold text-[#172033]">
                No blocked dates
              </p>

              <p className="mt-1 text-[12px] leading-5 text-[#172033]/45">
                Select dates on the calendar when your asset is unavailable.
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-[#172033]/10 pt-5">
          <p className="text-[12px] leading-5 text-[#172033]/50">
            Pending and confirmed reservations are automatically unavailable
            and cannot be manually blocked.
          </p>
        </div>
      </aside>
    </div>
  );
}
