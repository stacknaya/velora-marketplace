"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function toggleFavorite(listingId: string) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?error=Please+sign+in+to+save+favorites");

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } }
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
  } else {
    await db.favorite.create({ data: { userId: user.id, listingId } });
  }

  revalidatePath("/favorites");
  revalidatePath("/explore");
}
