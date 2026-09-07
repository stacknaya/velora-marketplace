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

const RESERVATIONS_PER_PAGE = 6;

export default async function HostReservationsPage({
  searchParams
}: {
  searchParams: Promise<{
    status?: string;
    page?: string;
  }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const params = await searchParams;

  const selectedStatus = params.status || "ALL";

  const requestedPage = Number(params.page || "1");

  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.floor(requestedPage)
      : 1;

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

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBookings.length / RESERVATIONS_PER_PAGE
    )
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex =
    (safePage - 1) * RESERVATIONS_PER_PAGE;

  const visibleBookings = filteredBookings.slice(
    startIndex,
    startIndex + RESERVATIONS_PER_PAGE
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

  const formatCurrency = (amount: number) =>
    amount.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

  const buildPageHref = (page: number) => {
    const pagePart = `page=${page}`;

    if (selectedStatus === "ALL") {
      return `/host/reservations?${pagePart}`;
    }

    return `/host/reservations?status=${selectedStatus}&${pagePart}`;
  };

  return (
    <HostShell>
      <div
  className="min-w-0 pb-12 text-[#172033]"
  style={{
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
  }}
>
        {/* PAGE HEADER */}
        <div>
          <h1 className="text-[36px] font-black leading-tight tracking-[-0.035em]">
            Reservations
          </h1>

          <p className="mt-1.5 text-[15px] font-medium text-[#172033]/55">
            Manage your bookings, approvals, and guest requests.
          </p>
        </div>

        {/* FILTER TABS */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const active =
              selectedStatus === tab.value;

            const href =
              tab.value === "ALL"
                ? "/host/reservations"
                : `/host/reservations?status=${tab.value}`;

            return (
              <a
                key={tab.value}
                href={href}
                className={
                  active
                    ? "rounded-xl bg-[#f4ead8] px-5 py-2.5 text-[14px] font-bold text-[#172033]"
                    : "rounded-xl px-5 py-2.5 text-[14px] font-semibold text-[#172033]/60 transition hover:bg-white hover:text-[#172033]"
                }
              >
                {tab.label}
              </a>
            );
          })}
        </div>

        <div className="mt-4 border-t border-[#172033]/10" />

        {/* EMPTY STATE */}
        {visibleBookings.length === 0 ? (
          <div className="mt-5 rounded-[20px] border border-[#172033]/10 bg-white p-8">
            <h2 className="text-[18px] font-bold">
              No reservations found
            </h2>

            <p className="mt-2 text-[14px] text-[#172033]/55">
              Reservations matching this status will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-4 grid gap-2.5">
            {visibleBookings.map((booking) => {
              const image =
                booking.listing.photos[0]?.url;

              return (
                <div
                  key={booking.id}
                  className="overflow-hidden rounded-[20px] border border-[#172033]/10 bg-white shadow-[0_1px_4px_rgba(23,32,51,0.04)]"
                >
                  <div className="grid grid-cols-1 items-center gap-3 p-3 lg:grid-cols-[118px_minmax(170px,1fr)_205px_175px_125px]">
                    {/* PHOTO */}
                    <div className="h-[88px] overflow-hidden rounded-[13px] bg-neutral-200">
                      {image ? (
                        <img
                          src={`/api/image?pathname=${encodeURIComponent(
                            image
                          )}`}
                          alt={booking.listing.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-[12px] text-[#172033]/35">
                          No photo
                        </div>
                      )}
                    </div>

                    {/* ASSET + GUEST */}
                    <div className="min-w-0">
                      <h2 className="truncate text-[16px] font-semibold leading-tight tracking-[-0.01em]">
                        {booking.listing.title}
                      </h2>

                      <p className="mt-2 truncate text-[13px] font-medium text-[#172033]/60">
                        Guest:{" "}
                        {booking.guest.name || "Guest"}
                      </p>

                      <p className="mt-0.5 truncate text-[13px] text-[#172033]/48">
                        {booking.guest.email}
                      </p>

                      <p className="mt-1 text-[12px] text-[#172033]/40">
                        Booking #
                        {booking.id
                          .slice(-8)
                          .toUpperCase()}
                      </p>
                    </div>

                    {/* DATES */}
<div className="grid grid-cols-2 gap-2">
  <div className="flex items-center gap-3 rounded-[13px] border border-[#172033]/10 bg-white px-3 py-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[#172033]/10">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4 text-[#172033]/70"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    </div>

    <div>
      <p className="whitespace-nowrap text-[12px] font-bold">
        {formatDate(booking.startAt)}
      </p>

      <p className="mt-0.5 text-[10px] font-medium text-[#172033]/45">
        Start
      </p>
    </div>
  </div>

  <div className="flex items-center gap-3 rounded-[13px] border border-[#172033]/10 bg-white px-3 py-2.5">
    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-[#172033]/10">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-4 w-4 text-[#172033]/70"
      >
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </svg>
    </div>

    <div>
      <p className="whitespace-nowrap text-[12px] font-bold">
        {formatDate(booking.endAt)}
      </p>

      <p className="mt-0.5 text-[10px] font-medium text-[#172033]/45">
        End
      </p>
    </div>
  </div>
</div>
                    {/* STATUS / ACTIONS */}
                    <div className="min-w-0">
                      {booking.status ===
                        "PENDING" && (
                        <div>
                          <span className="inline-flex rounded-full bg-[#fbefd8] px-3.5 py-1.5 text-[10px] font-black uppercase tracking-[0.1em] text-[#9a6f24]">
                            Pending
                          </span>

                          <div className="mt-2 flex flex-wrap gap-1.5">
                            <form
                              action={approveBooking.bind(
                                null,
                                booking.id
                              )}
                            >
                              <button
                                type="submit"
                                className="rounded-full bg-[#172033] px-4 py-2 text-[11px] font-bold text-white"
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
                                className="rounded-full border border-red-200 bg-white px-4 py-2 text-[11px] font-bold text-red-600"
                              >
                                Decline
                              </button>
                            </form>
                          </div>
                        </div>
                      )}

                      {booking.status ===
                        "CONFIRMED" &&
                        booking.cancellationRequested && (
                          <div className="rounded-[14px] border border-[#c9a96e]/35 bg-[#f4ead8] px-3 py-2.5">
                            <p className="text-[9px] font-black uppercase tracking-[0.09em] text-[#9a7a45]">
                              Cancellation requested
                            </p>

                            <p className="mt-1 text-[11px] text-[#172033]/65">
                              Refund:{" "}
                              <span className="font-black text-[#172033]">
                                {
                                  booking.cancellationRefundPct
                                }
                                %
                              </span>
                            </p>

                            <div className="mt-2 flex gap-1.5">
                              <form
                                action={approveCancellationRequest.bind(
                                  null,
                                  booking.id
                                )}
                              >
                                <button
                                  type="submit"
                                  className="rounded-full bg-[#172033] px-3 py-1.5 text-[10px] font-bold text-white"
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
                                  className="rounded-full border border-red-200 bg-white px-3 py-1.5 text-[10px] font-bold text-red-600"
                                >
                                  Decline
                                </button>
                              </form>
                            </div>
                          </div>
                        )}

                      {booking.status ===
                        "CONFIRMED" &&
                        !booking.cancellationRequested && (
                          <span className="inline-flex rounded-full bg-emerald-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-emerald-700">
                            Confirmed
                          </span>
                        )}

                      {booking.status ===
                        "CANCELLED" && (
                        <span className="inline-flex rounded-full bg-red-50 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-red-600">
                          Cancelled
                        </span>
                      )}

                      {booking.status ===
                        "COMPLETED" && (
                        <span className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-slate-600">
                          Completed
                        </span>
                      )}
                    </div>

                    {/* TOTAL */}
<div className="border-t border-[#172033]/10 pt-3 lg:border-l lg:border-t-0 lg:pl-4 lg:pt-0">
  <div className="flex items-center justify-between gap-3">
    <div className="text-left">
      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#172033]/40">
        Total
      </p>

      <p className="mt-1 whitespace-nowrap text-[18px] font-black tracking-[-0.02em]">
        {formatCurrency(booking.total)}
      </p>
    </div>

    <a
      href={`/listing/${booking.listing.slug}`}
      aria-label={`View ${booking.listing.title}`}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl font-medium text-[#172033]/65 transition hover:bg-[#f4ead8] hover:text-[#172033]"
    >
      →
    </a>
  </div>
</div>
                </div>
              );
            })}
          </div>
        )}

        {/* PAGINATION */}
        {filteredBookings.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-[#172033]/10 pt-4">
            <p className="text-[13px] font-medium text-[#172033]/50">
              Showing{" "}
              {startIndex + 1}–
              {Math.min(
                startIndex +
                  RESERVATIONS_PER_PAGE,
                filteredBookings.length
              )}{" "}
              of {filteredBookings.length}
            </p>

            <div className="flex items-center gap-2">
              {safePage > 1 && (
                <a
                  href={buildPageHref(
                    safePage - 1
                  )}
                  className="rounded-full border border-[#172033]/10 bg-white px-4 py-2 text-[12px] font-bold"
                >
                  ← Previous
                </a>
              )}

              <span className="rounded-full bg-[#f4ead8] px-4 py-2 text-[12px] font-bold">
                Page {safePage} of {totalPages}
              </span>

              {safePage < totalPages && (
                <a
                  href={buildPageHref(
                    safePage + 1
                  )}
                  className="rounded-full border border-[#172033]/10 bg-white px-4 py-2 text-[12px] font-bold"
                >
                  Next →
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </HostShell>
  );
}
