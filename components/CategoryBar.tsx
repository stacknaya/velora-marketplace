const categories = [
  ["CAR", "Exotic Cars"],
  ["BOAT", "Boats"],
  ["YACHT", "Yachts"],
  ["RV", "RVs"],
  ["AIRCRAFT", "Aircraft"],
  ["PARTY_RIDE", "Party Rides"]
];

export default function CategoryBar() {
  return (
    <div className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-6 py-6">
      {categories.map(([value, label]) => (
        <a
          key={value}
          href={`/explore?category=${value}`}
          className="whitespace-nowrap rounded-full border border-black/15 bg-white px-5 py-3 text-sm font-semibold hover:bg-black hover:text-white"
        >
          {label}
        </a>
      ))}
    </div>
  );
}
