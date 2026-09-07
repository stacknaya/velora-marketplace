import Header from "@/components/Header";
import HostSidebar from "@/components/HostSidebar";

export default function HostShell({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-[#f7f3ec]">
        <div className="grid w-full lg:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-r border-[#172033]/10 bg-white/60">
            <div className="sticky top-0 min-h-[calc(100vh-80px)] px-4 py-8">
              <HostSidebar />
            </div>
          </aside>

          <section className="min-w-0 px-6 py-8 lg:px-8">
            {children}
          </section>
        </div>
      </main>
    </>
  );
}
