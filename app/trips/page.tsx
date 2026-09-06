import Header from "@/components/Header";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cancelPendingBooking } from "@/app/actions/bookings";

export default async function TripsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const bookings = await db.booking.findMany({
    where: {
      guestId: user.id
    },
    include: {
      listing: {
        include: {
          photos: {
            orderBy: {
              position: "asc"
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    }
  });

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] text-[#172033]">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
            Your reservations
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight">
            Trips
          </h1>

          <p className="mt-3 text-[#172033]/60">
            View your upcoming and past Velora reservations.
          </p>

          {bookings.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-[#172033]/10 bg-white p-8">
              <h2 className="text-xl font-black">
                No trips yet
              </h2>

              <p className="mt-2 text-[#172033]/55">
                Your reservations will appear here after you book an asset.
              </p>

              <a
                href="/explore"
                className="mt-6 inline-block rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white"
              >
                Explore Velora
              </a>
            </div>
          ) : (
            <div className="mt-10 grid gap-6">
              {bookings.map((booking) => {
                const image = booking.listing.photos[0]?.url;

                return (
                  <div
                    key={booking.id}
                    className="overflow-hidden rounded-[2rem] border border-[#172033]/10 bg-white shadow-sm md:grid md:grid-cols-[280px_1fr]"
                  >
                    <div className="aspect-[4/3] bg-neutral-200 md:aspect-auto">
                      {image ? (
                        <img
                          src={`/api/image?pathname=${encodeURIComponent(image)}`}
                          alt={booking.listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full min-h-52 items-center justify-center text-sm text-[#172033]/35">
                          No photo
                        </div>
                      )}
                    </div>

                    <div className="p-6 md:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <span className="rounded-full bg-[#f4ead8] px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.15em] text-[#9a7a45]">
                            {booking.status.replaceAll("_", " ")}
                          </span>

                          <h2 className="mt-4 text-2xl font-black">
                            {booking.listing.title}
                          </h2>

                          <p className="mt-1 text-sm text-[#172033]/55">
                            {booking.listing.city}, {booking.listing.state}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-xs font-black uppercase tracking-wider text-[#172033]/40">
                            Total
                          </p>

                          <p className="mt-1 text-2xl font-black">
                            ${booking.total.toLocaleString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 grid gap-4 sm:grid-cols-2">
                        <div className="rounded-[1.3rem] border border-[#172033]/10 bg-[#f7f3ec] p-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
                            Start
                          </p>

                          <p className="mt-1 font-black">
                            {booking.startAt.toLocaleDateString()}
                          </p>
                        </div>

                        <div className="rounded-[1.3rem] border border-[#172033]/10 bg-[#f7f3ec] p-4">
                          <p className="text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
                            End
                          </p>

                          <p className="mt-1 font-black">
                            {booking.endAt.toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#172033]/10 pt-5">
  <p className="text-sm text-[#172033]/50">
    Booking #{booking.id.slice(-8).toUpperCase()}
  </p>

  <div className="flex items-center gap-3">
    {booking.status === "PENDING" && (
      <form action={cancelPendingBooking.bind(null, booking.id)}>
        <button
          type="submit"
          className="rounded-full border border-red-200 px-4 py-2 text-sm font-black text-red-600 transition hover:bg-red-50"
        >
          Cancel booking
        </button>
      </form>
    )}

    <a
      href={`/listing/${booking.listing.slug}`}
      className="text-sm font-black text-[#9a7a45]"
    >
      View listing →
    </a>
  </div>
</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
