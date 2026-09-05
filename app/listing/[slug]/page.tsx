import { createBooking } from "@/app/actions/bookings";
import Header from "@/components/Header";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { toggleFavorite } from "@/app/actions/favorites";
import { getCurrentUser } from "@/lib/auth";

export default async function ListingPage({
  params
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const listing = await db.listing.findUnique({
    where: { slug },
    include: {
      host: { select: { name: true, verified: true } },
      photos: { orderBy: { position: "asc" } }
    }
  });

  if (!listing) notFound();

  const favorite = user
    ? await db.favorite.findUnique({
        where: { userId_listingId: { userId: user.id, listingId: listing.id } }
      })
    : null;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-black/50">{listing.category}</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">{listing.title}</h1>
            <p className="mt-2 text-black/60">{listing.city}, {listing.state} · Hosted by {listing.host.name}</p>
          </div>
          <form action={toggleFavorite.bind(null, listing.id)}>
            <button className="rounded-full border border-black/15 px-5 py-3 font-bold">
              {favorite ? "♥ Saved" : "♡ Save"}
            </button>
          </form>
        </div>

        <div className="relative aspect-[16/8] overflow-hidden rounded-[2rem] bg-neutral-200">
          {listing.photos[0]?.url ? (
           <img
  src={`/api/image?pathname=${encodeURIComponent(listing.photos[0].url)}`}
  alt={listing.title}
  className="h-full w-full object-cover"
/>
          ) : (
            <div className="flex h-full items-center justify-center text-black/35">No photo uploaded</div>
          )}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <section>
            <h2 className="text-2xl font-black">About this asset</h2>
            <p className="mt-4 max-w-2xl leading-7 text-black/70">{listing.description}</p>
            <div className="mt-7 grid max-w-2xl gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-5"><span className="text-xs text-black/45">MAKE / MODEL</span><p className="mt-1 font-bold">{[listing.make, listing.model].filter(Boolean).join(" ") || "—"}</p></div>
              <div className="rounded-2xl bg-white p-5"><span className="text-xs text-black/45">YEAR</span><p className="mt-1 font-bold">{listing.year || "—"}</p></div>
              <div className="rounded-2xl bg-white p-5"><span className="text-xs text-black/45">MINIMUM</span><p className="mt-1 font-bold">{listing.minDays} day(s)</p></div>
              <div className="rounded-2xl bg-white p-5"><span className="text-xs text-black/45">NOTICE</span><p className="mt-1 font-bold">{listing.advanceNoticeHr} hours</p></div>
            </div>
          </section>

          <aside className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
            <p><span className="text-3xl font-black">${listing.basePrice.toLocaleString()}</span> / {listing.priceUnit}</p>
            <p className="mt-2 text-sm text-black/50">Security deposit: ${listing.securityDeposit.toLocaleString()}</p>

<form action={createBooking.bind(null, listing.id)}>            <div className="mt-5 grid 
grid-cols-2 gap-2">
              <input type="date" name="startAt" required className="rounded-xl border border-black/15 p-3" />
              <input type="date" name="endAt" required className="rounded-xl border border-black/15 p-3" />
            </div>
            <button className="mt-4 w-full rounded-xl bg-black px-5 py-4 font-bold text-white">
Reserve</button>
</form>
            <p className="mt-3 text-center text-xs text-black/50">Payments arrive in Phase 3.</p>
          </aside>
        </div>
      </main>
    </>
  );
}
