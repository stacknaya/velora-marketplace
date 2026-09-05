import { createBooking } from "@/app/actions/bookings";
import Header from "@/components/Header";
import { db } from "@/lib/db";
import BookingForm from "@/components/BookingForm";
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
        where: {
          userId_listingId: {
            userId: user.id,
            listingId: listing.id
          }
        }
      })
    : null;

  const image = listing.photos[0]?.url;

  return (
    <>
      <Header />

      <main className="bg-[#f7f3ec] text-[#172033]">
        <div className="mx-auto max-w-7xl px-6 py-10">

          <div className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#172033] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#e4c994]">
                  {listing.category.replaceAll("_", " ")}
                </span>

                {listing.instantBook && (
                  <span className="rounded-full border border-[#c9a96e]/40 bg-[#fffaf1] px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#9a7a45]">
                    Instant Book
                  </span>
                )}
              </div>

              <h1 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                {listing.title}
              </h1>

              <p className="mt-3 text-[#172033]/60">
                {listing.city}, {listing.state}
                <span className="mx-2">·</span>
                Hosted by {listing.host.name}
              </p>
            </div>

            <form action={toggleFavorite.bind(null, listing.id)}>
              <button className="rounded-full border border-[#172033]/15 bg-white px-5 py-3 text-sm font-black transition hover:border-[#c9a96e]">
                {favorite ? "♥ Saved" : "♡ Save"}
              </button>
            </form>
          </div>

          <div className="overflow-hidden rounded-[2.3rem] border border-[#172033]/10 bg-white shadow-sm">
            <div className="relative aspect-[16/8] bg-neutral-200">
              {image ? (
                <img
                  src={`/api/image?pathname=${encodeURIComponent(image)}`}
                  alt={listing.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[#172033]/35">
                  No photo uploaded
                </div>
              )}

              <div className="absolute bottom-5 left-5 rounded-full bg-white/95 px-4 py-2 text-xs font-black text-[#172033] shadow">
                Premium Velora listing
              </div>
            </div>
          </div>

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_390px]">
            <section>

              <div className="border-b border-[#172033]/10 pb-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                  The experience
                </p>

                <h2 className="mt-2 text-3xl font-black">
                  About this asset
                </h2>

                <p className="mt-5 max-w-3xl text-base leading-8 text-[#172033]/65">
                  {listing.description}
                </p>
              </div>

              <div className="py-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                  Details
                </p>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.5rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Make / Model
                    </span>
                    <p className="mt-2 font-black">
                      {[listing.make, listing.model].filter(Boolean).join(" ") || "—"}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Year
                    </span>
                    <p className="mt-2 font-black">
                      {listing.year || "—"}
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Minimum booking
                    </span>
                    <p className="mt-2 font-black">
                      {listing.minDays} day(s)
                    </p>
                  </div>

                  <div className="rounded-[1.5rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Advance notice
                    </span>
                    <p className="mt-2 font-black">
                      {listing.advanceNoticeHr} hours
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#172033]/10 pt-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                  Your host
                </p>

                <div className="mt-5 flex items-center gap-4 rounded-[1.7rem] border border-[#172033]/10 bg-white p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#172033] text-lg font-black text-[#e4c994]">
                    {listing.host.name?.charAt(0).toUpperCase() || "V"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-black">
                        {listing.host.name}
                      </p>

                      {listing.host.verified && (
                        <span className="rounded-full bg-[#f4ead8] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#9a7a45]">
                          Verified
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-[#172033]/55">
                      Velora host
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <aside className="h-fit rounded-[2rem] border border-[#172033]/10 bg-white p-6 shadow-lg lg:sticky lg:top-28">

              <div className="flex items-end gap-2">
                <span className="text-3xl font-black">
                  ${listing.basePrice.toLocaleString()}
                </span>
                <span className="pb-1 text-sm font-semibold text-[#172033]/50">
                  / {listing.priceUnit}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#172033]/50">
                Security deposit: ${listing.securityDeposit.toLocaleString()}
              </p>

             <BookingForm action={createBooking.bind(null, listing.id)} />
              <p className="mt-4 text-center text-xs leading-5 text-[#172033]/45">
                Your reservation request is submitted securely through Velora.
              </p>

              <div className="mt-6 border-t border-[#172033]/10 pt-5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#172033]/55">
                    Base rate
                  </span>
                  <span className="font-bold">
                    ${listing.basePrice.toLocaleString()} / {listing.priceUnit}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="text-[#172033]/55">
                    Security deposit
                  </span>
                  <span className="font-bold">
                    ${listing.securityDeposit.toLocaleString()}
                  </span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
