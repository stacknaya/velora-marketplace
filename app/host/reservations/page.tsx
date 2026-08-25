import HostShell from "@/components/HostShell";
export default function Page() {
  return (
    <HostShell>
      <p className="text-sm font-black uppercase tracking-[0.2em] text-black/40">Host</p>
      <h1 className="mt-2 text-4xl font-black tracking-tight">Reservations</h1>
      <div className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
        <p className="max-w-2xl leading-7 text-black/60">Upcoming guest requests, confirmed bookings and completed rentals.</p>
      </div>
    </HostShell>
  );
}
