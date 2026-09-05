const categories = [
  { value: "CAR", label: "Exotic Cars", icon: "◆" },
  { value: "BOAT", label: "Boats", icon: "◒" },
  { value: "YACHT", label: "Yachts", icon: "◇" },
  { value: "RV", label: "RVs", icon: "▣" },
  { value: "AIRCRAFT", label: "Aircraft", icon: "✈" },
  { value: "PARTY_RIDE", label: "Party Rides", icon: "✦" }
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
              className="group flex min-w-[145px] items-center gap-3 whitespace-nowrap rounded-[1.4rem] border border-[#172033]/10 bg-white px-5 py-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#c9a96e] hover:shadow-md"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#172033] text-lg font-black text-[#e4c994] transition group-hover:bg-[#c9a96e] group-hover:text-[#172033]">
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
