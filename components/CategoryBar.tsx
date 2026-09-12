const categories = [
  {
    value: "SPECIALTY_VEHICLES",
    label: "Specialty Vehicles",
    icon: "◆",
  },
  {
    value: "WATERCRAFT",
    label: "Watercraft",
    icon: "≈",
  },
  {
    value: "RVS",
    label: "RVs",
    icon: "▣",
  },
  {
    value: "AIR_TAXI",
    label: "Air Taxi",
    icon: "✦",
  },
  {
    value: "PARTY_RIDES",
    label: "Party Rides",
    icon: "✧",
  },
];

export default function CategoryBar() {
  return (
    <section className="border-y border-[#172033]/10 bg-[#f7f3ec]">
      <div className="mx-auto max-w-7xl px-6 py-7">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {categories.map((category) => (
            <a
              key={category.value}
              href={`/explore?category=${category.value}`}
              className="group flex min-w-[165px] items-center gap-3 whitespace-nowrap rounded-[1.4rem] border border-[#172033]/10 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-[#c9a96e]/50 hover:shadow-sm"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172033] text-lg font-black text-[#e4c994] transition group-hover:bg-[#c9a96e] group-hover:text-white">
                {category.icon}
              </div>

              <span className="text-sm font-black text-[#172033]">
                {category.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
