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

export default async function HostReservationsPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;
  const selectedStatus = params.status || "ALL";

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

  const filteredBookings =
    selectedStatus === "ALL"
      ? bookings
      : bookings.filter(
          (booking) => booking.status === selectedStatus
        );

  const tabs = [
    { label: "All", value: "ALL" },
    { label: "Pending", value: "PENDING" },
    { label: "Confirmed", value: "CONFIRMED" },
    { label: "Cancelled", value: "CANCELLED" },
    { label: "Completed", value: "COMPLETED" }
  ];

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });

  return (
    <HostShell>
      <div className="min-w-0 pb-10">
        {/* HEADER */}
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
            Host
          </p>

          <h1 className="mt-2 text-4xl font-black tracking-tight text-[#172033]">
            Reservations
          </h1>

          <p className="mt-2 text-sm text-[#172033]/60">
            Manage your bookings, approvals, and guest requests.
          </p>
        </div>

        {/* TABS */}
        <div className="mt-6 flex flex-wrap gap-2 border-b border-[#172033]/10 pb-4">
          {tabs.map((tab) => {
            const active = selectedStatus === tab.value;

            return (
              <a
                key={tab.value}
                href={
                  tab.value === "ALL"
                    ? "/host/reservations"
                    : `/host/reservations?status=${tab.value}`
                }
                className={
                  active
                    ? "rounded-xl bg-[#f4ead8] px-4 py-2 text-sm font-black text-[#172033]"
                    : "rounded-xl px-4 py-2 text-sm font-semibold text-[#172033]/60 transition hover:bg-white"
                }
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        {filteredBookings.length === 0 ? (
          <div className="mt-6 rounded-[1.5rem] border border-[#172033]/10 bg-white p-8">
            <h2 className="text-lg font-black text-[#172033]">
              No reservations found
            </h2>

            <p className="mt-2 text-sm text-[#172033]/55">
              Reservations matching this status will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-5 grid gap-3">
            {filteredBookings.map((booking) => {
              const image = booking.listing.photos[0]?.url;

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-[1.35rem] border border-[#172033]/10 bg-white shadow-sm"
                >
                  <div className="grid min-h-[118px] grid-cols-1 items-center gap-4 p-4 xl:grid-cols-[165px_minmax(220px,1fr)_280px_240px_150px]">
                    {/* PHOTO */}
                    <div className="h-[108px] overflow-hidden rounded-[1rem] bg-neutral-200">
                      {image ? (
                        <img
                          src={`/api/image?pathname=${encodeURIComponent(image)}`}
                          alt={booking.listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-[#172033]/35">
                          No photo
                        </div>
                      )}
                    </div>

                    {/* LISTING / GUEST */}
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="truncate text-lg font-black text-[#172033]">
                          {booking.listing.title}
                        </h2>

                                              </div>

                      <p className="mt-1.5 truncate text-xs text-[#172033]/60">
                        Guest: {booking.guest.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#172033]/45">
                        {booking.guest.email}
                      </p>

                      <p className="mt-1.5 text-[10px] text-[#172033]/40">
                        Booking #{booking.id.slice(-8).toUpperCase()}
                      </p>
                    </div>

                    {/* DATES */}
                    <div className="grid grid-cols-2 gap-2">
                      <div className="rounded-[0.9rem] border border-[#172033]/10 bg-[#faf8f4] px-3 py-2.5">
                        <p className="text-[8px] font-black uppercase tracking-wider text-[#172033]/35">
                          Start
                        </p>

                        <p className="mt-1 text-[11px] font-black text-[#172033]">
                          {formatDate(booking.startAt)}
                        </p>
                      </div>

                      <div className="rounded-[0.9rem] border border-[#172033]/10 bg-[#faf8f4] px-3 py-2.5">
                        <p className="text-[8px] font-black uppercase tracking-wider text-[#172033]/35">
                          End
                        </p>

                        <p className="mt-1 text-[11px] font-black text-[#172033]">
                          {formatDate(booking.endAt)}
                        </p>
                      </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="min-w-0">
                      {booking.status === "CONFIRMED" &&
  !booking.cancellationRequested && (
    <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
      Confirmed
    </span>
  )}

{booking.status === "CANCELLED" && (
  <span className="inline-flex rounded-full bg-red-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-red-600">
    Cancelled
  </span>
)}

{booking.status === "COMPLETED" && (
  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-slate-600">
    Completed
  </span>
)}
                      {booking.status === "PENDING" && (
                        <div>
                          <p className="mb-2 text-[9px] font-black uppercase tracking-wider text-[#9a7a45]">
                            Booking request
                          </p>

                          <div className="flex flex-wrap gap-2">
                            <form
                              action={approveBooking.bind(
                                null,
                                booking.id
                              )}
                            >
                              <button
                                type="submit"
                                className="rounded-full bg-[#172033] px-3.5 py-2 text-[11px] font-black text-white"
                              >
                                Approve
                              </button>
                            </form>

                            <form
                              action={declineBooking.bind(
                                null,
                                booking.id
                              )}
                            >
                              <button
                                type="submit"
                                className="rounded-full border border-red-200 bg-white px-3.5 py-2 text-[11px] font-black text-red-600"
                              >
                                Decline
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {booking.status === "CONFIRMED" &&
                        booking.cancellationRequested && (
                          <div className="rounded-[0.9rem] border border-[#c9a96e]/40 bg-[#f4ead8] p-3">
                            <p className="text-[8px] font-black uppercase tracking-wider text-[#9a7a45]">
                              Cancellation requested
                            </p>

                            <p className="mt-1 text-[11px] text-[#172033]/70">
                              Refund:{" "}
                              <span className="font-black text-[#172033]">
                                {booking.cancellationRefundPct}%
                              </span>
                            </p>

                            <div className="mt-2 flex flex-wrap gap-1.5">
                              <form
                                action={approveCancellationRequest.bind(
                                  null,
                                  booking.id
                                )}
                              >
                                <button
                                  type="submit"
                                  className="rounded-full bg-[#172033] px-3 py-1.5 text-[10px] font-black text-white"
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
                                  className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-[10px] font-black text-red-600"
                                >
                                  Decline
                                </button>
                              </form>
                            </div>
                          </div>
                        )}

                      {booking.status === "CONFIRMED" &&
  !booking.cancellationRequested && (
    <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-emerald-700">
      Confirmed
    </span>
  )}


{booking.status === "COMPLETED" && (
  <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-600">
    Completed
  </span>
)}
                    </div>

                    {/* TOTAL */}
                    <div className="min-w-[110px] border-t border-[#172033]/10 pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0 lg:text-right">
                      <p className="text-[8px] font-black uppercase tracking-wider text-[#172033]/35">
                        Total
                      </p>

                      <p className="mt-1 whitespace-nowrap text-lg font-black text-[#172033]">
                        ${booking.total.toFixed(2)}
                      </p>

                      <a
                        href={`/listing/${booking.listing.slug}`}
                        className="mt-1.5 inline-block whitespace-nowrap text-[10px] font-black text-[#9a7a45]"
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
