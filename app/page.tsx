import Header from "@/components/Header";
import CategoryBar from "@/components/CategoryBar";
import DbListingCard from "@/components/DbListingCard";
import { db } from "@/lib/db";
import HomeSearch from "@/components/HomeSearch";

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
        <HomeSearch />
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
