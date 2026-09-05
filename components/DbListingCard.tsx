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
    <Link
      href={`/listing/${listing.slug}`}
      className="group block overflow-hidden rounded-[2rem] border border-[#172033]/10 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
        {image ? (
          <img
            src={`/api/image?pathname=${encodeURIComponent(image)}`}
            alt={listing.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-black/35">
            No photo yet
          </div>
        )}

        <button
          type="button"
          aria-label="Save listing"
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-lg shadow-sm transition hover:scale-105"
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          ♡
        </button>

        {listing.instantBook && (
          <span className="absolute left-4 top-4 rounded-full bg-[#172033] px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#e4c994] shadow">
            Instant Book
          </span>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-black text-[#172033]">
              {listing.title}
            </h3>

            <p className="mt-1 text-sm font-medium text-[#172033]/55">
              {listing.city}, {listing.state}
            </p>
          </div>

          <div className="rounded-full bg-[#f7f3ec] px-3 py-1 text-xs font-black text-[#9a7a45]">
            Premium
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between border-t border-[#172033]/10 pt-4">
          <div>
            <span className="text-2xl font-black text-[#172033]">
              ${listing.basePrice.toLocaleString()}
            </span>
            <span className="ml-1 text-sm font-medium text-[#172033]/50">
              / {listing.priceUnit}
            </span>
          </div>

          <span className="text-sm font-bold text-[#9a7a45]">
            View details →
          </span>
        </div>
      </div>
    </Link>
  );
}
