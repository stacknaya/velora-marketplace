import HostShell from "@/components/HostShell";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";

export default async function SubmittedListingPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  const { id } = await params;
  const listing = await db.listing.findFirst({
    where: { id, hostId: user.id },
    include: { photos: { orderBy: { position: "asc" } } }
  });

  if (!listing) notFound();

  return (
    <HostShell>
      <div className="rounded-[2rem] border border-black/10 bg-white p-8 md:p-10">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">Saved to database</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight">Your listing was submitted.</h1>
        <p className="mt-4 max-w-2xl leading-7 text-black/60">
          {listing.title} is permanently saved in Velora's local database with status <strong>{listing.status.replace("_", " ")}</strong>. Refreshing or restarting the app will not remove it.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl bg-neutral-50 p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-black/40">Location</span>
            <p className="mt-2 font-bold">{listing.city}, {listing.state}</p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-black/40">Price</span>
            <p className="mt-2 font-bold">${listing.basePrice.toLocaleString()} / {listing.priceUnit}</p>
          </div>
          <div className="rounded-2xl bg-neutral-50 p-5">
            <span className="text-xs font-bold uppercase tracking-widest text-black/40">Deposit</span>
            <p className="mt-2 font-bold">${listing.securityDeposit.toLocaleString()}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a href={`/listing/${listing.slug}`} className="rounded-2xl bg-black px-6 py-4 font-bold text-white">View listing</a>
          <a href="/host/dashboard" className="rounded-2xl border border-black/15 px-6 py-4 font-bold">Host dashboard</a>
          <a href="/host/listings/new" className="rounded-2xl border border-black/15 px-6 py-4 font-bold">Add another asset</a>
        </div>
      </div>
    </HostShell>
  );
}
