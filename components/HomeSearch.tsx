"use client";

import { useMemo, useState } from "react";

export default function HomeSearch() {
  const today = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }, []);

  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  function handleStartChange(value: string) {
    setStart(value);

    if (end && value && end < value) {
      setEnd("");
    }
  }

  return (
    <section className="border-b border-[#172033]/10 bg-[#f7f3ec] px-4 py-8 md:px-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        <form
          action="/explore"
          className="grid overflow-hidden rounded-[28px] border border-[#172033]/10 bg-white shadow-[0_8px_30px_rgba(23,32,51,0.08)] md:grid-cols-[1.35fr_1.4fr_1fr_auto]"
        >
          {/* WHERE */}
          <label className="group border-b border-[#172033]/10 px-6 py-4 transition hover:bg-[#f7f3ec] md:border-b-0 md:border-r">
            <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#172033]/50">
              Where
            </span>

            <input
              type="text"
              name="location"
              placeholder="Search destinations"
              className="mt-1.5 w-full bg-transparent text-[14px] font-semibold text-[#172033] outline-none placeholder:font-medium placeholder:text-[#172033]/35"
            />
          </label>

          {/* DATES */}
          <div className="grid grid-cols-2 border-b border-[#172033]/10 md:border-b-0 md:border-r">
            <label className="border-r border-[#172033]/10 px-5 py-4 transition hover:bg-[#f7f3ec]">
              <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#172033]/50">
                Start
              </span>

              <input
                type="date"
                name="start"
                min={today}
                value={start}
                onChange={(e) => handleStartChange(e.target.value)}
                className="mt-1.5 w-full bg-transparent text-[13px] font-semibold text-[#172033] outline-none"
              />
            </label>

            <label className="px-5 py-4 transition hover:bg-[#f7f3ec]">
              <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#172033]/50">
                End
              </span>

              <input
                type="date"
                name="end"
                min={start || today}
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                disabled={!start}
                className="mt-1.5 w-full bg-transparent text-[13px] font-semibold text-[#172033] outline-none disabled:cursor-not-allowed disabled:opacity-40"
              />
            </label>
          </div>

          {/* EXPERIENCE */}
          <label className="border-b border-[#172033]/10 px-6 py-4 transition hover:bg-[#f7f3ec] md:border-b-0 md:border-r">
            <span className="block text-[10px] font-black uppercase tracking-[0.16em] text-[#172033]/50">
              Experience
            </span>

            <select
              name="category"
              defaultValue=""
              className="mt-1.5 w-full cursor-pointer bg-transparent text-[14px] font-semibold text-[#172033] outline-none"
            >
              <option value="">All experiences</option>
<option value="SPECIALTY_VEHICLES">Specialty Vehicles</option>
<option value="WATERCRAFT">Watercraft</option>
<option value="RVS">RVs</option>
<option value="AIR_TAXI">Air Taxi</option>
<option value="PARTY_RIDES">Party Rides</option>
            </select>
          </label>

          {/* SEARCH */}
          <div className="flex items-center justify-center p-3">
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#172033] px-7 text-[14px] font-bold text-white transition hover:bg-[#202c44] md:w-auto"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" />
              </svg>

              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
