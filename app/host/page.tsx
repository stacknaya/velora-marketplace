import Header from "@/components/Header";

export default function HostPage() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm font-bold uppercase tracking-widest text-black/50">For owners & operators</p>
        <h1 className="mt-3 text-5xl font-black tracking-tight">Turn your asset into income.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-black/65">
          Create a verified listing, control pricing and availability, accept bookings and receive payouts through one dashboard.
        </p>
        <button className="mt-8 rounded-2xl bg-black px-6 py-4 font-bold text-white">Create a listing</button>
      </main>
    </>
  );
}
