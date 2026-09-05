import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-[#172033]/10 bg-[#f7f3ec]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#172033] text-sm font-black text-[#e4c994]">
            V
          </div>
          <div>
            <div className="text-xl font-black tracking-[0.08em] text-[#172033]">
              VELORA
            </div>
            <div className="hidden text-[10px] font-bold uppercase tracking-[0.18em] text-[#172033]/40 sm:block">
              Premium marketplace
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-semibold text-[#172033]/70 lg:flex">
          <Link href="/explore" className="transition hover:text-[#172033]">
            Explore
          </Link>
          <Link href="/favorites" className="transition hover:text-[#172033]">
            Favorites
          </Link>
          <Link href="/trips" className="transition hover:text-[#172033]">
            Trips
          </Link>
          <Link href="/messages" className="transition hover:text-[#172033]">
            Messages
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/host/listings/new"
            className="hidden rounded-full border border-[#172033]/15 bg-white px-5 py-2.5 text-sm font-bold text-[#172033] transition hover:border-[#172033]/30 md:inline-flex"
          >
            List your asset
          </Link>

          {user ? (
            <>
              <Link
                href="/host/dashboard"
                className="hidden text-sm font-bold text-[#172033]/65 sm:inline"
              >
                Hi, {user.name.split(" ")[0]}
              </Link>

              <form action={signOut}>
                <button className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90">
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="rounded-full bg-[#172033] px-5 py-2.5 text-sm font-bold text-white transition hover:opacity-90"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
