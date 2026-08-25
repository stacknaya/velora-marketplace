import Header from "@/components/Header";
import { signIn } from "@/app/actions/auth";

export default async function SignInPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16">
        <form action={signIn} className="rounded-[2rem] border border-black/10 bg-white p-8">
          <h1 className="text-3xl font-black">Sign in</h1>
          <p className="mt-2 text-sm text-black/50">Access your saved listings, favorites and host dashboard.</p>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <input name="email" required type="email" placeholder="Email" className="mt-7 w-full rounded-2xl border border-black/15 p-4" />
          <input name="password" required type="password" placeholder="Password" className="mt-3 w-full rounded-2xl border border-black/15 p-4" />
          <button className="mt-4 w-full rounded-2xl bg-black p-4 font-bold text-white">Continue</button>
          <p className="mt-5 text-center text-sm text-black/50">New here? <a href="/sign-up" className="font-bold text-black underline">Create account</a></p>
        </form>
      </main>
    </>
  );
}
