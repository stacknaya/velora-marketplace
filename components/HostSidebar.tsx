import Link from "next/link";

const links = [
  ["/host/dashboard", "Overview"],
  ["/host/listings", "Listings"],
  ["/host/listings/new", "Create listing"],
  ["/host/calendar", "Calendar"],
  ["/host/reservations", "Reservations"],
  ["/host/earnings", "Earnings"]
];

export default function HostSidebar() {
  return (
    <aside className="rounded-3xl border border-black/10 bg-white p-4">
      <p className="px-3 pb-3 text-xs font-black uppercase tracking-[0.2em] text-black/40">Host</p>
      <nav className="space-y-1">
        {links.map(([href, label]) => (
          <Link key={href} href={href} className="block rounded-2xl px-3 py-3 text-sm font-semibold hover:bg-black hover:text-white">
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
