import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import DbListingCard from "@/components/DbListingCard";
import { db } from "@/lib/db";

export default async function Home() {
  const listings = await db.listing.findMany({
    include: {
      photos: {
        orderBy: {
          position: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 6,
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] text-[#172033]">
        {/* SEARCH */}
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
                    className="mt-1.5 w-full bg-transparent text-[13px] font-semibold text-[#172033] outline-none"
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
                  <option value="CAR">Exotic cars</option>
                  <option value="BOAT">Boats</option>
                  <option value="YACHT">Yachts</option>
                  <option value="RV">RVs</option>
                  <option value="AIRCRAFT">Aircraft</option>
                  <option value="PARTY_RIDE">Party rides</option>
                </select>
              </label>

              {/* SEARCH BUTTON */}
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

        {/* CATEGORIES */}
        <section className="border-b border-[#172033]/10 bg-white">
          <CategoryBar />
        </section>

        {/* LISTINGS */}
        <section className="mx-auto max-w-7xl px-6 py-10 md:py-12">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                Velora experiences
              </p>

              <h1 className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
                Extraordinary rentals
              </h1>

              <p className="mt-2 max-w-xl text-[14px] leading-6 text-[#172033]/55">
                Discover premium cars, yachts, boats, aircraft, RVs and
                unforgettable experiences.
              </p>
            </div>

            <a
              href="/explore"
              className="hidden shrink-0 rounded-full border border-[#172033]/15 bg-white px-5 py-2.5 text-[13px] font-bold transition hover:border-[#172033]/30 sm:inline-flex"
            >
              Explore all
            </a>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-[24px] border border-[#172033]/10 bg-white p-10">
              <p className="text-lg font-black">
                The marketplace is ready for its first listing.
              </p>

              <p className="mt-2 text-[#172033]/55">
                Create a host account and add your first premium asset.
              </p>

              <a
                href="/host/listings/new"
                className="mt-6 inline-flex rounded-full bg-[#172033] px-6 py-3 font-bold text-white"
              >
                List an asset
              </a>
            </div>
          ) : (
            <div className="grid gap-x-6 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <DbListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}

          <div className="mt-10 sm:hidden">
            <a
              href="/explore"
              className="inline-flex rounded-full border border-[#172033]/15 bg-white px-5 py-3 text-sm font-bold"
            >
              Explore all
            </a>
          </div>
        </section>

        {/* TRUST SECTION */}
        <section className="border-t border-[#172033]/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-12 md:grid-cols-3">
            <div>
              <p className="text-sm font-black">Premium inventory</p>

              <p className="mt-2 text-sm leading-6 text-[#172033]/55">
                Discover distinctive vehicles, vessels and experiences from
                Velora hosts.
              </p>
            </div>

            <div>
              <p className="text-sm font-black">Built around trust</p>

              <p className="mt-2 text-sm leading-6 text-[#172033]/55">
                Profiles, booking controls and marketplace safeguards help
                create a more confident rental experience.
              </p>
            </div>

            <div>
              <p className="text-sm font-black">One destination</p>

              <p className="mt-2 text-sm leading-6 text-[#172033]/55">
                Exotic cars, yachts, aircraft, RVs and party rides together
                in one premium marketplace.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
