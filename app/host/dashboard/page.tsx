import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HostDashboard() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?error=Please+sign+in+to+access+the+host+dashboard");

  const listings = await db.listing.findMany({
    where: { hostId: user.id },
    orderBy: { createdAt: "desc" }
  });

  const bookingCount = await db.booking.count({
    where: { listing: { hostId: user.id } }
  });

  return (
    <HostShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">Dashboard</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Welcome, {user.name.split(" ")[0]}.</h1>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl bg-black p-6 text-white">
          <p className="text-sm text-white/50">Total earnings</p>
          <p className="mt-2 text-3xl font-black">$0</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/50">Bookings</p>
          <p className="mt-2 text-3xl font-black">{bookingCount}</p>
        </div>
        <div className="rounded-3xl border border-black/10 bg-white p-6">
          <p className="text-sm text-black/50">Saved assets</p>
          <p className="mt-2 text-3xl font-black">{listings.length}</p>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-black/10 bg-white p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-black">Your listings</h2>
          <a href="/host/listings/new" className="rounded-xl bg-black px-4 py-3 text-sm font-bold text-white">Add asset</a>
        </div>
        {listings.length === 0 ? (
          <p className="mt-5 text-black/50">You have not created a listing yet.</p>
        ) : (
          <div className="mt-5 space-y-3">
            {listings.map((item) => (
              <div key={item.id} className="flex flex-col justify-between gap-3 rounded-2xl bg-neutral-50 p-4 md:flex-row md:items-center">
                <div>
                  <p className="font-bold">{item.title}</p>
                  <p className="mt-1 text-sm text-black/50">{item.category} · {item.city}, {item.state}</p>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <span>{item.status.replace("_", " ")}</span>
                  <strong>${item.basePrice.toLocaleString()}/{item.priceUnit}</strong>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </HostShell>
  );
}
