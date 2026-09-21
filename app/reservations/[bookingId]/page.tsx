import Header from "@/components/Header";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function BookingDetailsPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { bookingId } = await params;

  const booking = await db.booking.findFirst({
    where: {
      id: bookingId,
      guestId: user.id,
    },
    include: {
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

  if (!booking) {
    notFound();
  }

  const image = booking.listing.photos[0]?.url;

  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec] text-[#172033]">
        <div className="mx-auto max-w-5xl px-6 py-10">
          <a
            href="/trips"
            className="text-sm font-black text-[#9a7a45]"
          >
            ← Back to trips
          </a>

          <div className="mt-6 overflow-hidden rounded-[2rem] border border-[#172033]/10 bg-white shadow-sm">
            {image && (
              <div className="h-72 w-full overflow-hidden">
                <img
                  src={`/api/image?pathname=${encodeURIComponent(image)}`}
                  alt={booking.listing.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <div className="p-6 md:p-10">
              <div className="flex flex-wrap items-start justify-between gap-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9a7a45]">
                    Reservation details
                  </p>

                  <h1 className="mt-2 text-4xl font-black">
                    {booking.listing.title}
                  </h1>

                  <p className="mt-2 text-[#172033]/60">
                    {booking.listing.city}, {booking.listing.state}
                  </p>
                </div>

                <span className="rounded-full bg-[#f4ead8] px-4 py-2 text-xs font-black uppercase tracking-wider text-[#9a7a45]">
                  {booking.status.replaceAll("_", " ")}
                </span>
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Detail
                  label="Start"
                  value={booking.startAt.toLocaleDateString()}
                />

                <Detail
                  label="End"
                  value={booking.endAt.toLocaleDateString()}
                />

                <Detail
                  label="Total"
                  value={`$${booking.total.toLocaleString()}`}
                />

                <Detail
                  label="Booking number"
                  value={`#${booking.id.slice(-8).toUpperCase()}`}
                />

                <Detail
                  label="Payment status"
                  value={booking.stripePaymentStatus ?? "PENDING"}
                />

                <Detail
                  label="Reservation status"
                  value={booking.status.replaceAll("_", " ")}
                />
              </div>

              <div className="mt-8 flex flex-wrap gap-3 border-t border-[#172033]/10 pt-6">
                <a
                  href={`/listing/${booking.listing.slug}`}
                  className="rounded-full border border-[#172033]/15 px-5 py-3 text-sm font-black"
                >
                  View listing
                </a>

                <a
                  href="/messages"
                  className="rounded-full bg-[#172033] px-5 py-3 text-sm font-black text-white"
                >
                  Message host
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-[1.3rem] border border-[#172033]/10 bg-[#f7f3ec] p-5">
      <p className="text-[10px] font-black uppercase tracking-wider text-[#172033]/40">
        {label}
      </p>

      <p className="mt-2 font-black">
        {value}
      </p>
    </div>
  );
}
