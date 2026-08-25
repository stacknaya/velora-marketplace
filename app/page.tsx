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
      <main>
        <section className="bg-black text-white">
          <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.25em] text-white/60">Extraordinary rentals</p>
            <h1 className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tight md:text-7xl">
              Rent what ordinary marketplaces can’t offer.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/70">
              Exotic cars, boats, yachts, RVs, aircraft and party rides from verified owners and operators.
            </p>
            <form action="/explore" className="mt-10 grid max-w-5xl gap-2 rounded-3xl bg-white p-2 text-black shadow-2xl md:grid-cols-[1.6fr_1fr_1fr_auto]">
              <input name="location" placeholder="Where are you going?" className="rounded-2xl px-5 py-4 outline-none" />
              <input name="start" type="date" className="rounded-2xl px-5 py-4 outline-none" />
              <select name="category" className="rounded-2xl px-5 py-4 outline-none">
                <option value="">All categories</option>
                <option value="CAR">Exotic cars</option>
                <option value="BOAT">Boats</option>
                <option value="YACHT">Yachts</option>
                <option value="RV">RVs</option>
                <option value="AIRCRAFT">Aircraft</option>
              </select>
              <button className="rounded-2xl bg-black px-7 py-4 font-bold text-white">Search</button>
            </form>
          </div>
        </section>

        <CategoryBar />

        <section className="mx-auto max-w-7xl px-6 pb-20 pt-4">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-black/50">Latest</p>
              <h2 className="mt-2 text-3xl font-black tracking-tight">Marketplace inventory</h2>
            </div>
            <a href="/explore" className="font-semibold underline underline-offset-4">View all</a>
          </div>

          {listings.length === 0 ? (
            <div className="rounded-3xl border border-black/10 bg-white p-8">
              <p className="font-bold">Your real marketplace is empty.</p>
              <p className="mt-2 text-black/55">Create an account and add the first asset.</p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => <DbListingCard key={listing.id} listing={listing} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
