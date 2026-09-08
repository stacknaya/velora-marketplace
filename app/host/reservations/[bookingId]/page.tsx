import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import {
  archiveReservation,
  restoreReservation,
} from "@/app/actions/bookings";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export default async function ReservationDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { bookingId } = await params;

  const booking = await db.booking.findUnique({
    where: {
      id: bookingId,
    },
    include: {
      guest: {
        select: {
          name: true,
          email: true,
        },
      },
      listing: {
        include: {
          photos: {
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });

  if (!booking || booking.listing.hostId !== user.id) {
    notFound();
  }

  const image = booking.listing.photos[0]?.url;

  const statusStyles: Record<string, string> = {
    PENDING: "bg-[#fbefd8] text-[#9a7a45]",
    CONFIRMED: "bg-emerald-50 text-emerald-700",
    CANCELLED: "bg-red-50 text-red-600",
    COMPLETED: "bg-slate-100 text-slate-600",
    DISPUTED: "bg-orange-50 text-orange-700",
  };

  return (
    <HostShell>
      <div className="mx-auto w-full max-w-[1050px]">
        {/* TOP */}
        <div className="mb-6">
          <a
            href="/host/reservations"
            className="mb-4 inline-flex items-center gap-2 text-[13px] font-medium text-[#172033]/60 hover:text-[#172033]"
          >
            <span>←</span>
            Back to reservations
          </a>

          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9a7a45]">
                Reservation
              </p>

              <h1 className="mt-1 text-[32px] font-bold tracking-[-0.03em] text-[#172033]">
                {booking.listing.title}
              </h1>

              <p className="mt-1 text-[13px] text-[#172033]/55">
                Booking #{booking.id}
              </p>
            </div>

            <span
              className={`rounded-full px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] ${
                statusStyles[booking.status] ??
                "bg-slate-100 text-slate-600"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>

        {/* MAIN CARD */}
        <div className="overflow-hidden rounded-[22px] border border-[#172033]/10 bg-white">
          <div className="grid lg:grid-cols-[320px_minmax(0,1fr)]">
            {/* PHOTO */}
            <div className="min-h-[260px] bg-[#f5f3ef]">
              {image ? (
                <img
                  src={`/api/image?pathname=${encodeURIComponent(image)}`}
                  alt={booking.listing.title}
                  className="h-full min-h-[260px] w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[260px] items-center justify-center text-sm text-[#172033]/40">
                  No photo
                </div>
              )}
            </div>

            {/* DETAILS */}
            <div className="p-6 lg:p-8">
              <h2 className="text-[18px] font-semibold text-[#172033]">
                Reservation details
              </h2>

              {/* DATES */}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[14px] border border-[#172033]/10 bg-[#faf8f4] px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#172033]/40">
                    Start
                  </p>

                  <p className="mt-1 text-[14px] font-semibold text-[#172033]">
                    {formatDate(booking.startAt)}
                  </p>
                </div>

                <div className="rounded-[14px] border border-[#172033]/10 bg-[#faf8f4] px-4 py-3">
                  <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#172033]/40">
                    End
                  </p>

                  <p className="mt-1 text-[14px] font-semibold text-[#172033]">
                    {formatDate(booking.endAt)}
                  </p>
                </div>
              </div>

              {/* GUEST */}
              <div className="mt-6 border-t border-[#172033]/10 pt-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#172033]/40">
                  Guest
                </p>

                <p className="mt-2 text-[15px] font-semibold text-[#172033]">
                  {booking.guest.name || "Guest"}
                </p>

                <p className="mt-0.5 text-[13px] text-[#172033]/60">
                  {booking.guest.email}
                </p>
              </div>

              {/* LISTING LINK */}
              <div className="mt-6">
                <a
                  href={`/listing/${booking.listing.slug}`}
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#172033]"
                >
                  View listing
                  <span>›</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="mt-5 rounded-[22px] border border-[#172033]/10 bg-white p-6">
          <h2 className="text-[18px] font-semibold text-[#172033]">
            Payment summary
          </h2>

          <div className="mt-5 space-y-3 text-[13px]">
            <div className="flex justify-between">
              <span className="text-[#172033]/55">Subtotal</span>
              <span className="font-medium text-[#172033]">
                {formatCurrency(booking.subtotal)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#172033]/55">Service fee</span>
              <span className="font-medium text-[#172033]">
                {formatCurrency(booking.serviceFee)}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-[#172033]/55">Taxes</span>
              <span className="font-medium text-[#172033]">
                {formatCurrency(booking.taxes)}
              </span>
            </div>

            <div className="border-t border-[#172033]/10 pt-4">
              <div className="flex items-end justify-between">
                <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#172033]/45">
                  Total
                </span>

                <span className="text-[22px] font-bold text-[#172033]">
                  {formatCurrency(booking.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {(booking.status === "CANCELLED" ||
  booking.status === "COMPLETED") &&
  !booking.archivedByHost && (
    {booking.archivedByHost && (
  <div className="mt-5 rounded-[22px] border border-[#172033]/10 bg-white p-6">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-[16px] font-semibold text-[#172033]">
          Archived reservation
        </h2>

        <p className="mt-1 text-[13px] text-[#172033]/55">
          Restore this reservation to return it to your normal reservation history.
        </p>
      </div>

      <form action={restoreReservation.bind(null, booking.id)}>
        <button
          type="submit"
          className="rounded-full bg-[#172033] px-5 py-2.5 text-[12px] font-semibold text-white hover:opacity-90"
        >
          Restore reservation
        </button>
      </form>
    </div>
  </div>
)}
    <div className="mt-5 rounded-[22px] border border-[#172033]/10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-[16px] font-semibold text-[#172033]">
            Reservation management
          </h2>

          <p className="mt-1 text-[13px] text-[#172033]/55">
            Archive this reservation to remove it from your active reservation list.
          </p>
        </div>

        <form action={archiveReservation.bind(null, booking.id)}>
          <button
            type="submit"
            className="rounded-full border border-[#172033]/15 bg-white px-5 py-2.5 text-[12px] font-semibold text-[#172033] hover:bg-[#f7f3ec]"
          >
            Archive reservation
          </button>
        </form>
      </div>
    </div>
  )}

        {/* CANCELLATION */}
        {booking.cancellationRequested && (
          <div className="mt-5 rounded-[22px] border border-[#c9a96e]/35 bg-[#f4ead8] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9a7a45]">
              Cancellation requested
            </p>

            <p className="mt-2 text-[14px] text-[#172033]/70">
              Guest refund:{" "}
              <span className="font-semibold text-[#172033]">
                {booking.cancellationRefundPct ?? 0}%
              </span>
            </p>
          </div>
        )}
      </div>
    </HostShell>
  );
}
