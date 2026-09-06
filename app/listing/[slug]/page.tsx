import { createBooking } from "@/app/actions/bookings";
import { toggleFavorite } from "@/app/actions/favorites";
import BookingForm from "@/components/BookingForm";
import Header from "@/components/Header";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

export default async function ListingPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getCurrentUser();

  const listing = await db.listing.findUnique({
    where: { slug },
    include: {
      host: {
        select: {
          name: true,
          verified: true
        }
      },
      photos: {
        orderBy: {
          position: "asc"
        }
      },
      bookings: {
        where: {
          status: {
            in: ["PENDING", "CONFIRMED"]
          }
        },
        select: {
          startAt: true,
          endAt: true
        }
      },
      blockedDates: {
        select: {
          startAt: true,
          endAt: true
        }
      }
    }
  });

  if (!listing) {
    notFound();
  }

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

  const unavailableRanges = [
    ...listing.bookings.map((booking) => ({
      start: booking.startAt.toISOString().split("T")[0],
      end: booking.endAt.toISOString().split("T")[0]
    })),
    ...listing.blockedDates.map((blocked) => ({
      start: blocked.startAt.toISOString().split("T")[0],
      end: blocked.endAt.toISOString().split("T")[0]
    }))
  ];

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] text-[#172033]">
        <div className="mx-auto max-w-[1380px] px-5 py-8 md:px-8 md:py-10">
          {/* Listing heading */}
          <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
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

              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-[#172033]/60">
                <span>
                  {listing.city}, {listing.state}
                </span>

                <span>•</span>

                <span>
                  Hosted by {listing.host.name}
                </span>
              </div>
            </div>

            <form action={toggleFavorite.bind(null, listing.id)}>
              <button
                type="submit"
                className="rounded-full border border-[#172033]/15 bg-white px-5 py-3 text-sm font-black text-[#172033] transition hover:border-[#c9a96e] hover:bg-[#fffaf1]"
              >
                {favorite ? "♥ Saved" : "♡ Save"}
              </button>
            </form>
          </div>

          {/* Hero photo */}
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

          {/* Main content */}
          <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1fr)_480px]">
            {/* Left column */}
            <section className="min-w-0">
              {/* About */}
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

              {/* Details */}
              <div className="py-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                      Details
                    </p>

                    <h2 className="mt-2 text-2xl font-black">
                      Asset information
                    </h2>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-[1.6rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Make / Model
                    </span>

                    <p className="mt-2 font-black">
                      {[listing.make, listing.model]
                        .filter(Boolean)
                        .join(" ") || "—"}
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Year
                    </span>

                    <p className="mt-2 font-black">
                      {listing.year || "—"}
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Minimum booking
                    </span>

                    <p className="mt-2 font-black">
                      {listing.minDays} day
                      {listing.minDays === 1 ? "" : "s"}
                    </p>
                  </div>

                  <div className="rounded-[1.6rem] border border-[#172033]/10 bg-white p-5">
                    <span className="text-[11px] font-black uppercase tracking-widest text-[#172033]/40">
                      Advance notice
                    </span>

                    <p className="mt-2 font-black">
                      {listing.advanceNoticeHr} hours
                    </p>
                  </div>
                </div>
              </div>

              {/* Host */}
              <div className="border-t border-[#172033]/10 pt-8">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                  Your host
                </p>

                <div className="mt-5 flex items-center gap-4 rounded-[1.8rem] border border-[#172033]/10 bg-white p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#172033] text-lg font-black text-[#e4c994]">
                    {listing.host.name?.charAt(0).toUpperCase() || "V"}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
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

            {/* Reservation column */}
            <aside className="h-fit rounded-[2.2rem] border border-[#172033]/10 bg-white p-5 shadow-lg sm:p-6 xl:sticky xl:top-28">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-black">
                      ${listing.basePrice.toLocaleString()}
                    </span>

                    <span className="pb-1 text-sm font-semibold text-[#172033]/50">
                      / {listing.priceUnit}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-[#172033]/50">
                    Security deposit: $
                    {listing.securityDeposit.toLocaleString()}
                  </p>
                </div>

                {listing.instantBook && (
                  <span className="rounded-full bg-[#f4ead8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.14em] text-[#9a7a45]">
                    Instant Book
                  </span>
                )}
              </div>

              <BookingForm
                action={createBooking.bind(null, listing.id)}
                advanceNoticeHr={listing.advanceNoticeHr}
                minDays={listing.minDays}
                unavailableRanges={unavailableRanges}
              />

              <p className="mt-4 text-center text-xs leading-5 text-[#172033]/45">
                Your reservation request is submitted securely through Velora.
              </p>

              <div className="mt-6 border-t border-[#172033]/10 pt-5">
                <div className="flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#172033]/55">
                    Base rate
                  </span>

                  <span className="font-bold">
                    ${listing.basePrice.toLocaleString()} /{" "}
                    {listing.priceUnit}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                  <span className="text-[#172033]/55">
                    Security deposit
                  </span>

                  <span className="font-bold">
                    ${listing.securityDeposit.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="mt-5 rounded-[1.2rem] bg-[#f7f3ec] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.17em] text-[#9a7a45]">
                  Booking protection
                </p>

                <p className="mt-2 text-xs leading-5 text-[#172033]/55">
                  Availability is checked against pending reservations,
                  confirmed bookings, and host-blocked dates.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
