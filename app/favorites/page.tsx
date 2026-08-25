import Header from "@/components/Header";
import DbListingCard from "@/components/DbListingCard";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?error=Please+sign+in+to+view+favorites");

  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    include: {
      listing: {
        include: { photos: { orderBy: { position: "asc" } } }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-black">Favorites</h1>
        <p className="mt-2 text-black/50">These are saved to your account.</p>
        {favorites.length === 0 ? (
          <div className="mt-8 rounded-3xl border border-black/10 bg-white p-8">
            <p>No saved listings yet.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {favorites.map(({ listing }) => <DbListingCard key={listing.id} listing={listing} />)}
          </div>
        )}
      </main>
    </>
  );
}
