import HostShell from "@/components/HostShell";
import HostCalendar from "@/components/HostCalendar";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const listings = await db.listing.findMany({
    where: {
      hostId: user.id,
    },
    include: {
      blockedDates: {
        orderBy: {
          startAt: "asc",
        },
      },
      bookings: {
        where: {
          status: {
            in: ["PENDING", "CONFIRMED"],
          },
        },
        orderBy: {
          startAt: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const calendarListings = listings.map((listing) => ({
    id: listing.id,
    title: listing.title,
    slug: listing.slug,

    blockedDates: listing.blockedDates.map((blockedDate) => ({
      id: blockedDate.id,
      startAt: blockedDate.startAt.toISOString(),
      endAt: blockedDate.endAt.toISOString(),
      reason: blockedDate.reason,
    })),

    bookings: listing.bookings.map((booking) => ({
      id: booking.id,
      startAt: booking.startAt.toISOString(),
      endAt: booking.endAt.toISOString(),
      status: booking.status,
    })),
  }));

  return (
    <HostShell>
      <div className="w-full">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#172033]/40">
          Host
        </p>

        <h1 className="mt-1 text-[32px] font-bold tracking-[-0.03em] text-[#172033]">
          Calendar
        </h1>

        <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#172033]/55">
          Manage your listing availability and block dates when your assets are
          unavailable.
        </p>

        <div className="mt-6">
          <HostCalendar listings={calendarListings} />
        </div>
      </div>
    </HostShell>
  );
}
