import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/types";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <Link href={`/listing/${listing.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-200">
        <Image
          src={listing.image}
          alt={listing.title}
          fill
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        {listing.instantBook && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow">
            Instant Book
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold">{listing.title}</h3>
          <p className="mt-1 text-sm text-black/60">{listing.city}, {listing.state}</p>
          <p className="mt-2">
            <span className="font-bold">${listing.price.toLocaleString()}</span>
            <span className="text-sm text-black/60"> / {listing.priceUnit}</span>
          </p>
        </div>
        <div className="text-sm font-semibold">★ {listing.rating}</div>
      </div>
    </Link>
  );
}
