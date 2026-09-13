import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EarningsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const bookings = await db.booking.findMany({
    where: {
      listing: {
        hostId: user.id,
      },
    },
    include: {
      listing: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const confirmedAndCompleted = bookings.filter(
  (booking) =>
    booking.status === "CONFIRMED" ||
    booking.status === "COMPLETED"
);

const grossBookings = confirmedAndCompleted.reduce(
  (sum, booking) => sum + booking.subtotal,
  0
);

const veloraHostFees = confirmedAndCompleted.reduce(
  (sum, booking) => sum + booking.hostFee,
  0
);

const completedEarnings = bookings
  .filter((booking) => booking.status === "COMPLETED")
  .reduce((sum, booking) => sum + booking.hostPayout, 0);

const upcomingPayout = bookings
  .filter(
    (booking) =>
      booking.status === "PENDING" ||
      booking.status === "CONFIRMED"
  )
  .reduce((sum, booking) => sum + booking.hostPayout, 0);
  return (
    <HostShell>
      <div className="w-full">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#172033]/40">
          Host
        </p>

        <h1 className="mt-1 text-[32px] font-bold tracking-[-0.03em] text-[#172033]">
          Earnings
        </h1>

        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#172033]/55">
          Track booking revenue, Velora host fees, and your expected payouts.
        </p>

        {/* SUMMARY */}
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-[22px] border border-[#172033]/10 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#172033]/40">
              Gross bookings
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-[#172033]">
              {money(grossBookings)}
            </p>

            <p className="mt-2 text-[12px] text-[#172033]/45">
              Before Velora host fee
            </p>
          </div>

          <div className="rounded-[22px] border border-[#172033]/10 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#172033]/40">
              Velora host fees
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-[#172033]">
              {money(veloraHostFees)}
            </p>

            <p className="mt-2 text-[12px] text-[#172033]/45">
              5% host commission
            </p>
          </div>

          <div className="rounded-[22px] border border-[#172033]/10 bg-white p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#172033]/40">
              Completed earnings
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-[#172033]">
              {money(completedEarnings)}
            </p>

            <p className="mt-2 text-[12px] text-[#172033]/45">
              Completed reservations only
            </p>
          </div>

          <div className="rounded-[22px] border border-[#c9a96e]/30 bg-[#f4ead8] p-6">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#9a7a45]">
              Upcoming payout
            </p>

            <p className="mt-3 text-3xl font-bold tracking-tight text-[#172033]">
              {money(upcomingPayout)}
            </p>

            <p className="mt-2 text-[12px] text-[#172033]/50">
              Pending and confirmed reservations
            </p>
          </div>
        </div>

        {/* BOOKING HISTORY */}
        <div className="mt-7 overflow-hidden rounded-[22px] border border-[#172033]/10 bg-white">
          <div className="border-b border-[#172033]/10 px-6 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#9a7a45]">
              Earnings activity
            </p>

            <h2 className="mt-1 text-xl font-bold text-[#172033]">
              Booking earnings
            </h2>
          </div>

          {bookings.length === 0 ? (
            <div className="p-8">
              <p className="font-semibold text-[#172033]">
                No earnings yet
              </p>

              <p className="mt-2 text-sm text-[#172033]/50">
                Booking earnings will appear here after guests reserve your
                listings.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#172033]/10">
              {bookings.map((booking) => (
                <div
                  key={booking.id}
                  className="grid gap-5 px-6 py-5 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-[#172033]">
                      {booking.listing.title}
                    </p>

                    <p className="mt-1 text-[12px] text-[#172033]/45">
                      {formatDate(booking.startAt)} –{" "}
                      {formatDate(booking.endAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#172033]/35">
                      Booking
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#172033]">
                      {money(booking.subtotal)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#172033]/35">
                      Velora fee
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#172033]">
                      {money(booking.hostFee)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#172033]/35">
                      Host payout
                    </p>

                    <p className="mt-1 text-sm font-semibold text-[#172033]">
                      {money(booking.hostPayout)}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
                      booking.status === "CONFIRMED"
                        ? "bg-[#172033] text-white"
                        : booking.status === "COMPLETED"
                        ? "bg-[#e4c994] text-[#172033]"
                        : booking.status === "CANCELLED"
                        ? "bg-red-50 text-red-700"
                        : "bg-[#f7f3ec] text-[#172033]/60"
                    }`}
                  >
                    {booking.status.replaceAll("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <p className="mt-4 text-[11px] leading-5 text-[#172033]/40">
          Earnings shown here are booking records. Actual payment processing
          and payout release will be connected separately.
        </p>
      </div>
    </HostShell>
  );
}
