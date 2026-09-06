import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import {
  approveBooking,
  declineBooking,
  approveCancellationRequest,
  declineCancellationRequest
} from "@/app/actions/bookings";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HostReservationsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const bookings = await db.booking.findMany({
    where: {
      listing: {
        hostId: user.id
      }
    },
    include: {
      guest: {
        select: {
          name: true,
          email: true
        }
      },
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
    <HostShell>
      <div>
        <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
          Host
        </p>

        <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172033]">
          Reservations
        </h1>

        <p className="mt-3 text-[#172033]/60">
          Review guest requests, confirmed bookings, and completed rentals.
        </p>

        {bookings.length === 0 ? (
          <div className="mt-10 rounded-[2rem] border border-[#172033]/10 bg-white p-8">
            <h2 className="text-xl font-black text-[#172033]">
              No reservations yet
            </h2>

            <p className="mt-2 text-[#172033]/55">
              Guest booking requests for your listings will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid gap-6">
            {bookings.map((booking) => {
              const image = booking.listing.photos[0]?.url;

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-[2rem] border border-[#172033]/10 bg-white shadow-sm md:grid md:grid-cols-[240px_1fr]"
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

                        <h2 className="mt-4 text-2xl font-black text-[#172033]">
                          {booking.listing.title}
                        </h2>

                        <p className="mt-1 text-sm text-[#172033]/55">
                          Guest: {booking.guest.name}
                        </p>

                        <p className="mt-1 text-sm text-[#172033]/45">
                          {booking.guest.email}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs font-black uppercase tracking-wider text-[#172033]/40">
                          Total
                        </p>

                        <p className="mt-1 text-2xl font-black text-[#172033]">
                          ${booking.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">
                      <div className="rounded-[1.3rem] border border-[#172033]/10 bg-[#f7f3ec] p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
                          Start
                        </p>

                        <p className="mt-1 font-black text-[#172033]">
                          {booking.startAt.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="rounded-[1.3rem] border border-[#172033]/10 bg-[#f7f3ec] p-4">
                        <p className="text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
                          End
                        </p>

                        <p className="mt-1 font-black text-[#172033]">
                          {booking.endAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {booking.status === "PENDING" && (
  <div className="mt-6 flex flex-wrap gap-3">
    <form action={approveBooking.bind(null, booking.id)}>
      <button
        type="submit"
        className="rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white transition hover:bg-[#24304a]"
      >
        Approve
      </button>
    </form>

    <form action={declineBooking.bind(null, booking.id)}>
      <button
        type="submit"
        className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
      >
        Decline
      </button>
    </form>
  </div>
)}
                    {booking.status === "CONFIRMED" &&
  booking.cancellationRequested && (
    <div className="mt-6 rounded-[1.5rem] border border-[#c9a96e]/50 bg-[#f4ead8] p-5">
      <p className="text-xs font-black uppercase tracking-[0.15em] text-[#9a7a45]">
        Cancellation requested
      </p>

      <p className="mt-2 text-sm text-[#172033]/70">
        Guest refund:{" "}
        <span className="font-black text-[#172033]">
          {booking.cancellationRefundPct}%
        </span>
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <form
          action={approveCancellationRequest.bind(
            null,
            booking.id
          )}
        >
          <button
            type="submit"
            className="rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white transition hover:bg-[#24304a]"
          >
            Approve cancellation
          </button>
        </form>

        <form
          action={declineCancellationRequest.bind(
            null,
            booking.id
          )}
        >
          <button
            type="submit"
            className="rounded-full border border-red-200 bg-white px-5 py-3 text-sm font-black text-red-600 transition hover:bg-red-50"
          >
            Decline cancellation
          </button>
        </form>
      </div>
    </div>
  )}

                    <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[#172033]/10 pt-5">
                      <p className="text-sm text-[#172033]/50">
                        Booking #{booking.id.slice(-8).toUpperCase()}
                      </p>

                      <a
                        href={`/listing/${booking.listing.slug}`}
                        className="text-sm font-black text-[#9a7a45]"
                      >
                        View listing →
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </HostShell>
  );
}
