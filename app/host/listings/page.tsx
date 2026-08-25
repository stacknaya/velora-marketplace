import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HostListingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const listings = await db.listing.findMany({
    where: { hostId: user.id },
    orderBy: { createdAt: "desc" }
  });

  return (
    <HostShell>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">Inventory</p>
          <h1 className="mt-2 text-4xl font-black tracking-tight">Listings</h1>
        </div>
        <a href="/host/listings/new" className="rounded-xl bg-black px-4 py-3 text-sm font-bold text-white">Create listing</a>
      </div>

      <div className="mt-8 space-y-4">
        {listings.length === 0 ? (
          <div className="rounded-3xl border border-black/10 bg-white p-8">No listings yet.</div>
        ) : listings.map((item) => (
          <div key={item.id} className="rounded-3xl border border-black/10 bg-white p-5">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-black">{item.title}</h2>
                <p className="mt-1 text-sm text-black/50">{item.category} · {item.city}, {item.state}</p>
              </div>
              <div className="flex gap-3">
                <span className="rounded-full bg-neutral-100 px-3 py-2 text-xs font-bold">{item.status.replace("_", " ")}</span>
                <a href={`/listing/${item.slug}`} className="rounded-xl border border-black/15 px-4 py-2 text-sm font-bold">View</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </HostShell>
  );
}
