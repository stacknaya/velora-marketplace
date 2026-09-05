import Link from "next/link";

export default function DbListingCard({
  listing
}: {
  listing: {
    slug: string;
    title: string;
    city: string;
    state: string;
    basePrice: number;
    priceUnit: string;
    instantBook: boolean;
    photos: { url: string }[];
  }
}) {
  const image = listing.photos[0]?.url;

  return (
    <Link href={`/listing/${listing.slug}`} className="group block">
      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-neutral-200">
        {image ? (
          <img
  src={`/api/image?pathname=${encodeURIComponent(image)}`}
  alt={listing.title}
  className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
/>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/35">No photo yet</div>
        )}
        {listing.instantBook && (
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-bold shadow">Instant Book</span>
        )}
      </div>
      <div className="mt-4">
        <h3 className="font-bold">{listing.title}</h3>
        <p className="mt-1 text-sm text-black/60">{listing.city}, {listing.state}</p>
        <p className="mt-2"><span className="font-bold">${listing.basePrice.toLocaleString()}</span><span className="text-sm text-black/60"> / {listing.priceUnit}</span></p>
      </div>
    </Link>
  );
}
