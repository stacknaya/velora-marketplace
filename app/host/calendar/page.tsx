import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function CalendarPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const listings = await db.listing.findMany({
    where: { hostId: user.id },
    include: { blockedDates: true }
  });

  return (
    <HostShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">Host</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Calendar</h1>
      <div className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
        <p className="max-w-2xl leading-7 text-black/60">
          Availability records are now stored in the database. The interactive block-date editor is the next calendar UI pass.
        </p>
        <div className="mt-6 space-y-3">
          {listings.map((listing) => (
            <div key={listing.id} className="rounded-2xl bg-neutral-50 p-4">
              <strong>{listing.title}</strong>
              <p className="mt-1 text-sm text-black/50">{listing.blockedDates.length} blocked date range(s)</p>
            </div>
          ))}
        </div>
      </div>
    </HostShell>
  );
}
