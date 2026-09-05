import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[#172033]/10 bg-[#f7f3ec]/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[1.1rem] bg-[#172033] shadow-sm transition group-hover:scale-[1.03]">
            <span className="text-base font-black text-[#e4c994]">V</span>
          </div>

          <div>
            <div className="text-xl font-black tracking-[0.14em] text-[#172033]">
              VELORA
            </div>
            <div className="hidden text-[9px] font-bold uppercase tracking-[0.22em] text-[#9a7a45] sm:block">
              Extraordinary rentals
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex">
          <Link
            href="/explore"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#172033]/65 transition hover:bg-white hover:text-[#172033]"
          >
            Explore
          </Link>

          <Link
            href="/favorites"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#172033]/65 transition hover:bg-white hover:text-[#172033]"
          >
            Favorites
          </Link>

          <Link
            href="/trips"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#172033]/65 transition hover:bg-white hover:text-[#172033]"
          >
            Trips
          </Link>

          <Link
            href="/messages"
            className="rounded-full px-4 py-2 text-sm font-semibold text-[#172033]/65 transition hover:bg-white hover:text-[#172033]"
          >
            Messages
          </Link>
        </nav>

        <div className="flex items-center gap-2">

          <Link
            href="/host/listings/new"
            className="hidden rounded-full border border-[#c9a96e]/50 bg-[#fffaf1] px-5 py-2.5 text-sm font-black text-[#172033] transition hover:border-[#c9a96e] hover:bg-[#f4ead8] md:inline-flex"
          >
            List your asset
          </Link>

          {user ? (
            <div className="flex items-center gap-2">

              <Link
                href="/host/dashboard"
                className="hidden items-center gap-2 rounded-full border border-[#172033]/10 bg-white px-4 py-2 sm:flex"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#172033] text-xs font-black text-[#e4c994]">
                  {user.name?.charAt(0).toUpperCase() || "V"}
                </div>

                <span className="text-sm font-bold text-[#172033]">
                  {user.name?.split(" ")[0]}
                </span>
              </Link>

              <form action={signOut}>
                <button className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#24304a]">
                  Sign out
                </button>
              </form>

            </div>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#24304a]"
            >
              Sign in
            </Link>
          )}

        </div>
      </div>
    </header>
  );
}
