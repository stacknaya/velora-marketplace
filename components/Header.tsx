import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/app/actions/auth";

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <header className="border-b border-black/10 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <Link href="/" className="text-2xl font-black tracking-tight">VELORA</Link>
        <nav className="flex items-center gap-5 text-sm font-medium">
          <Link href="/explore">Explore</Link>
          <Link href="/favorites">Favorites</Link>
          <Link href="/host/dashboard">Host</Link>
          <Link href="/trips">Trips</Link>
          <Link href="/messages">Messages</Link>
          {user ? (
            <>
              <span className="hidden text-black/50 md:inline">Hi, {user.name.split(" ")[0]}</span>
              <form action={signOut}>
                <button className="rounded-full border border-black/15 px-4 py-2">Sign out</button>
              </form>
            </>
          ) : (
            <Link href="/sign-in" className="rounded-full border border-black/15 px-4 py-2">Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
