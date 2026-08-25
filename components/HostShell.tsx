import Header from "@/components/Header";
import HostSidebar from "@/components/HostSidebar";

export default function HostShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[240px_1fr]">
        <HostSidebar />
        <section>{children}</section>
      </main>
    </>
  );
}
