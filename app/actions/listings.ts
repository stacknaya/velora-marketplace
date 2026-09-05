"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function slugify(input: string) {
  return input.toLowerCase().trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createListing(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in?error=Please+sign+in+to+list+an+asset");

  const title = String(formData.get("title") || "").trim();
  const category = String(formData.get("category") || "CAR") as "CAR" | "BOAT" | "YACHT" | "RV" | "AIRCRAFT" | "PARTY_RIDE";
  const city = String(formData.get("city") || "").trim();
  const state = String(formData.get("state") || "").trim();
  const description = String(formData.get("description") || "").trim();
  const make = String(formData.get("make") || "").trim();
  const model = String(formData.get("model") || "").trim();
  const year = Number(formData.get("year") || 0) || null;
  const capacity = Number(formData.get("capacity") || 0) || null;
  const basePrice = Number(formData.get("price") || 0);
  const securityDeposit = Number(formData.get("deposit") || 0);
  const instantBook = formData.get("instantBook") === "on";
  const delivery = formData.get("delivery") === "on";
  const minDays = Math.max(1, Number(formData.get("minDays") || 1));
  const advanceNoticeHr = Math.max(0, Number(formData.get("advanceNotice") || 24));
  const uploadedImage = String(formData.get("uploadedImage") || "").trim();
  const priceUnit = String(formData.get("priceUnit") || (category === "PARTY_RIDE" ? "hour" : "day"));
  const partyRideType = String(formData.get("partyRideType") || "").trim() || null;
  const driverIncluded = formData.get("driverIncluded") === "on";
  const minimumHours = Number(formData.get("minimumHours") || 0) || null;
  const overtimeRate = Number(formData.get("overtimeRate") || 0) || null;

  if (!title || !city || !state || basePrice <= 0) {
  redirect(
    `/host/listings/new?error=${encodeURIComponent(
      `Missing: title=${title || "EMPTY"}, city=${city || "EMPTY"}, state=${state || "EMPTY"}, price=${basePrice}`
    )}`
  );
}

  const baseSlug = slugify(`${title}-${city}`);
  const slug = `${baseSlug}-${Date.now().toString().slice(-6)}`;

  await db.user.update({
    where: { id: user.id },
    data: { role: "HOST" }
  });

  await db.hostProfile.upsert({
    where: { userId: user.id },
    create: { userId: user.id },
    update: {}
  });

  const listing = await db.listing.create({
    data: {
      slug,
      title,
      description: description || `${title} available in ${city}, ${state}.`,
      category,
      city,
      state,
      make: make || null,
      model: model || null,
      year,
      capacity,
      basePrice,
      securityDeposit,
      priceUnit,
      partyRideType,
      driverIncluded,
      minimumHours,
      overtimeRate,
      instantBook,
      delivery,
      minDays,
      advanceNoticeHr,
      hostId: user.id,
      photos: uploadedImage
        ? { create: [{ url: uploadedImage, position: 0 }] }
        : undefined
    }
  });

  revalidatePath("/");
  revalidatePath("/explore");
  revalidatePath("/host/dashboard");
  revalidatePath("/host/listings");

  redirect(`/host/listings/submitted/${listing.id}`);
}
