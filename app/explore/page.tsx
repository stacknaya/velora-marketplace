import Header from "@/components/Header";
import DbListingCard from "@/components/DbListingCard";
import { db } from "@/lib/db";

export default async function ExplorePage({
  searchParams
}: {
  searchParams: Promise<{ category?: string; location?: string }>
}) {
  const params = await searchParams;

  const listings = await db.listing.findMany({
    where: {
      ...(params.category ? { category: params.category as any } : {}),
      ...(params.location
        ? {
            OR: [
              { city: { contains: params.location } },
              { state: { contains: params.location } }
            ]
          }
        : {})
    },
    include: { photos: { orderBy: { position: "asc" } } },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <h1 className="text-4xl font-black tracking-tight">Explore</h1>
        <p className="mt-2 text-black/60">Real listings saved in your Velora database.</p>
        {listings.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-black/10 bg-white p-8">
            <p className="font-bold">No saved listings yet.</p>
            <a href="/host/listings/new" className="mt-4 inline-block underline">Create the first listing</a>
          </div>
        ) : (
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => <DbListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </main>
    </>
  );
}
