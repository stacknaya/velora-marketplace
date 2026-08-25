import Header from "@/components/Header";
import { signUp } from "@/app/actions/auth";

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams;

  return (
    <>
      <Header />
      <main className="mx-auto max-w-md px-6 py-16">
        <form action={signUp} className="rounded-[2rem] border border-black/10 bg-white p-8">
          <h1 className="text-3xl font-black">Create account</h1>
          <p className="mt-2 text-sm text-black/50">Your account is now stored in Velora's local database.</p>
          {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          <input name="name" required placeholder="Full name" className="mt-7 w-full rounded-2xl border border-black/15 p-4" />
          <input name="email" required type="email" placeholder="Email" className="mt-3 w-full rounded-2xl border border-black/15 p-4" />
          <input name="password" required minLength={8} placeholder="Password (8+ characters)" type="password" className="mt-3 w-full rounded-2xl border border-black/15 p-4" />
          <button className="mt-4 w-full rounded-2xl bg-black p-4 font-bold text-white">Create account</button>
        </form>
      </main>
    </>
  );
}
