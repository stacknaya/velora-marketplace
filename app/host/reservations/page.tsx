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

        <p className="mt-2 text-[#172033]/60">
          Manage bookings, approvals, and guest requests.
        </p>

        {bookings.length === 0 ? (
          <div className="mt-8 rounded-[1.5rem] border border-[#172033]/10 bg-white p-7">
            <h2 className="text-xl font-black text-[#172033]">
              No reservations yet
            </h2>

            <p className="mt-2 text-[#172033]/55">
              Guest booking requests for your listings will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-3">
            {bookings.map((booking) => {
              const image = booking.listing.photos[0]?.url;

              return (
                <div
                  key={booking.id}
                  className="rounded-[1.5rem] border border-[#172033]/10 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
                    {/* IMAGE */}
                    <div className="h-[130px] w-full shrink-0 overflow-hidden rounded-[1.2rem] bg-neutral-200 xl:w-[180px]">
                      {image ? (
                        <img
                          src={`/api/image?pathname=${encodeURIComponent(image)}`}
                          alt={booking.listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#172033]/35">
                          No photo
                        </div>
                      )}
                    </div>

                    {/* LISTING + GUEST */}
                    <div className="min-w-[210px] flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-xl font-black text-[#172033]">
                          {booking.listing.title}
                        </h2>

                        <span className="rounded-full bg-[#f4ead8] px-3 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#9a7a45]">
                          {booking.status.replaceAll("_", " ")}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-[#172033]/60">
                        Guest: {booking.guest.name}
                      </p>

                      <p className="mt-1 text-sm text-[#172033]/45">
                        {booking.guest.email}
                      </p>

                      <p className="mt-3 text-xs text-[#172033]/45">
                        Booking #{booking.id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    {/* DATES */}
                    <div className="grid min-w-[300px] grid-cols-2 gap-3">
                      <div className="rounded-[1rem] border border-[#172033]/10 bg-[#f7f3ec] px-4 py-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[#172033]/40">
                          Start
                        </p>

                        <p className="mt-1 text-sm font-black text-[#172033]">
                          {booking.startAt.toLocaleDateString()}
                        </p>
                      </div>

                      <div className="rounded-[1rem] border border-[#172033]/10 bg-[#f7f3ec] px-4 py-3">
                        <p className="text-[9px] font-black uppercase tracking-wider text-[#172033]/40">
                          End
                        </p>

                        <p className="mt-1 text-sm font-black text-[#172033]">
                          {booking.endAt.toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="min-w-[220px]">
                      {booking.status === "PENDING" && (
                        <div>
                          <p className="mb-2 text-[10px] font-black uppercase tracking-[0.12em] text-[#9a7a45]">
                            Booking request
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <form action={approveBooking.bind(null, booking.id)}>
                              <button
                                type="submit"
                                className="rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white transition hover:bg-[#24304a]"
                              >
                                Approve
                              </button>
                            </form>

                            <form action={declineBooking.bind(null, booking.id)}>
                              <button
                                type="submit"
                                className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-600 transition hover:bg-red-50"
                              >
                                Decline
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {booking.status === "CONFIRMED" &&
                        booking.cancellationRequested && (
                          <div className="rounded-[1rem] border border-[#c9a96e]/40 bg-[#f4ead8] p-3">
                            <p className="text-[9px] font-black uppercase tracking-[0.12em] text-[#9a7a45]">
                              Cancellation requested
                            </p>

                            <p className="mt-1 text-sm text-[#172033]/70">
                              Guest refund:{" "}
                              <span className="font-black text-[#172033]">
                                {booking.cancellationRefundPct}%
                              </span>
                            </p>

                            <div className="mt-3 flex flex-wrap gap-2">
                              <form
                                action={approveCancellationRequest.bind(
                                  null,
                                  booking.id
                                )}
                              >
                                <button
                                  type="submit"
                                  className="rounded-full bg-[#172033] px-4 py-2 text-xs font-black text-white"
                                >
                                  Approve
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
                                  className="rounded-full border border-red-200 bg-white px-4 py-2 text-xs font-black text-red-600"
                                >
                                  Decline
                                </button>
                              </form>
                            </div>
                          </div>
                        )}

                      {booking.status === "CONFIRMED" &&
                        !booking.cancellationRequested && (
                          <span className="inline-block rounded-full bg-green-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-green-700">
                            Confirmed
                          </span>
                        )}

                      {booking.status === "CANCELLED" && (
                        <span className="inline-block rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-red-600">
                          Cancelled
                        </span>
                      )}

                      {booking.status === "COMPLETED" && (
                        <span className="inline-block rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* TOTAL */}
                    <div className="min-w-[120px] text-left xl:text-right">
                      <p className="text-[9px] font-black uppercase tracking-wider text-[#172033]/40">
                        Total
                      </p>

                      <p className="mt-1 text-xl font-black text-[#172033]">
                        ${booking.total.toFixed(2)}
                      </p>

                      <a
                        href={`/listing/${booking.listing.slug}`}
                        className="mt-2 inline-block text-xs font-black text-[#9a7a45]"
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
