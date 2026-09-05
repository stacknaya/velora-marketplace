import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import DbListingCard from "@/components/DbListingCard";
import { db } from "@/lib/db";

export default async function Home() {
  const listings = await db.listing.findMany({
    include: { photos: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" },
    take: 6
  });

  return (
    <>
      <Header />

      <main className="bg-[#f7f3ec] text-[#172033]">
        <section className="px-6 pt-6">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] bg-[#172033] text-white">
            <div className="px-6 py-16 md:px-12 md:py-24 lg:px-16">
              <div className="max-w-4xl">
                <div className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.22em] text-[#e4c994]">
                  Premium rentals, reimagined
                </div>

                <h1 className="text-5xl font-black leading-[0.96] tracking-tight md:text-7xl">
                  Your next extraordinary
                  <span className="block text-[#e4c994]">experience starts here.</span>
                </h1>

                <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
                  Discover exotic cars, yachts, boats, aircraft, RVs and party rides
                  from owners and operators across the marketplace.
                </p>
              </div>

              <form
                action="/explore"
                className="mt-12 grid gap-2 rounded-[2rem] bg-white p-3 text-[#172033] shadow-2xl lg:grid-cols-[1.5fr_1fr_1fr_auto]"
              >
                <label className="rounded-2xl px-5 py-3 transition hover:bg-[#f7f3ec]">
                  <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-black/40">
                    Where
                  </span>
                  <input
                    name="location"
                    placeholder="City or destination"
                    className="mt-1 w-full bg-transparent text-sm font-semibold outline-none placeholder:text-black/35"
                  />
                </label>

                <label className="rounded-2xl px-5 py-3 transition hover:bg-[#f7f3ec]">
                  <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-black/40">
                    Date
                  </span>
                  <input
                    name="start"
                    type="date"
                    className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                  />
                </label>

                <label className="rounded-2xl px-5 py-3 transition hover:bg-[#f7f3ec]">
                  <span className="block text-[11px] font-black uppercase tracking-[0.18em] text-black/40">
                    Experience
                  </span>
                  <select
                    name="category"
                    className="mt-1 w-full bg-transparent text-sm font-semibold outline-none"
                  >
                    <option value="">All categories</option>
                    <option value="CAR">Exotic cars</option>
                    <option value="BOAT">Boats</option>
                    <option value="YACHT">Yachts</option>
                    <option value="RV">RVs</option>
                    <option value="AIRCRAFT">Aircraft</option>
                    <option value="PARTY_RIDE">Party rides</option>
                  </select>
                </label>

                <button className="rounded-[1.4rem] bg-[#c9a96e] px-8 py-4 font-black text-[#172033] transition hover:brightness-95">
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mt-6">
          <CategoryBar />
        </section>

        <section className="mx-auto max-w-7xl px-6 py-16">
          <div className="mb-9 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                Curated marketplace
              </p>
              <h2 className="mt-2 text-3xl font-black tracking-tight md:text-4xl">
                Discover something exceptional
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#172033]/55">
                Browse newly listed premium assets and experiences from Velora hosts.
              </p>
            </div>

            <a
              href="/explore"
              className="inline-flex w-fit items-center rounded-full border border-[#172033]/15 bg-white px-5 py-3 text-sm font-bold transition hover:border-[#172033]/30"
            >
              Explore all
            </a>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-[2rem] border border-[#172033]/10 bg-white p-10">
              <p className="text-lg font-black">The marketplace is ready for its first listing.</p>
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
        </section>

        <section className="border-t border-[#172033]/10 bg-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-6 py-14 md:grid-cols-3">
            <div>
              <p className="text-sm font-black">Premium inventory</p>
              <p className="mt-2 text-sm leading-6 text-[#172033]/55">
                From exotic vehicles to private experiences, Velora is built for assets
                beyond ordinary rentals.
              </p>
            </div>

            <div>
              <p className="text-sm font-black">Built around trust</p>
              <p className="mt-2 text-sm leading-6 text-[#172033]/55">
                Host profiles, booking controls and marketplace safeguards create a more
                confident rental experience.
              </p>
            </div>

            <div>
              <p className="text-sm font-black">One marketplace</p>
              <p className="mt-2 text-sm leading-6 text-[#172033]/55">
                Cars, yachts, boats, aircraft, RVs and party rides can all live under one
                Velora account.
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
