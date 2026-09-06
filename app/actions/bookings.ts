"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function createBooking(listingId: string, formData: FormData) 
{
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in?error=Please+sign+in+to+book");
  }

  const listing = await db.listing.findUnique({
    where: { id: listingId },
  });

  if (!listing) {
    redirect("/explore");
  }

  if (listing.hostId === user.id) {
    
redirect(`/listing/${listing.slug}?error=You+cannot+book+your+own+listing`);
  }

  const startRaw = String(formData.get("startAt") || "");
  const endRaw = String(formData.get("endAt") || "");

  if (!startRaw || !endRaw) {
    
redirect(`/listing/${listing.slug}?error=Please+choose+start+and+end+dates`);
  }

  const startAt = new Date(startRaw);
  const endAt = new Date(endRaw);

  if (endAt <= startAt) {
    
redirect(`/listing/${listing.slug}?error=End+date+must+be+after+start+date`);
  }

  const conflictingBooking = await db.booking.findFirst({
    where: {
      listingId,
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
      startAt: {
        lt: endAt,
      },
      endAt: {
        gt: startAt,
      },
    },
  });

  if (conflictingBooking) {
    
redirect(`/listing/${listing.slug}?error=Those+dates+are+not+available`);
  }

  const blockedDate = await db.blockedDate.findFirst({
    where: {
      listingId,
      startAt: {
        lt: endAt,
      },
      endAt: {
        gt: startAt,
      },
    },
  });

  if (blockedDate) {
    redirect(`/listing/${listing.slug}?error=Those+dates+are+blocked`);
  }

  const durationMs = endAt.getTime() - startAt.getTime();

  let units = 1;

  if (listing.priceUnit === "hour") {
    units = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60)));

    if (listing.minimumHours && units < listing.minimumHours) {
      redirect(
        
`/listing/${listing.slug}?error=Minimum+booking+is+${listing.minimumHours}+hours`
      );
    }
  } else {
    units = Math.max(1, Math.ceil(durationMs / (1000 * 60 * 60 * 24)));

    if (listing.minDays && units < listing.minDays) {
      redirect(
        
`/listing/${listing.slug}?error=Minimum+booking+is+${listing.minDays}+days`
      );
    }
  }

  const subtotal = listing.basePrice * units;
  const serviceFee = subtotal * 0.1;
  const taxes = 0;
  const total = subtotal + serviceFee + taxes;

  await db.booking.create({
    data: {
      listingId,
      guestId: user.id,
      startAt,
      endAt,
      subtotal,
      serviceFee,
      taxes,
      total,
      status: listing.instantBook ? "CONFIRMED" : "PENDING",
    },
  });

  revalidatePath("/trips");
  revalidatePath("/host/reservations");
  revalidatePath(`/listing/${listing.slug}`);

  redirect("/trips");
}
export async function approveBooking(bookingId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: true,
    },
  });

  if (!booking || booking.listing.hostId !== user.id) {
    redirect("/host/reservations");
  }

  if (booking.status !== "PENDING") {
    redirect("/host/reservations");
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CONFIRMED",
    },
  });

  revalidatePath("/host/reservations");
  revalidatePath("/trips");

  redirect("/host/reservations");
}

export async function declineBooking(bookingId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    include: {
      listing: true,
    },
  });

  if (!booking || booking.listing.hostId !== user.id) {
    redirect("/host/reservations");
  }

  if (booking.status !== "PENDING") {
    redirect("/host/reservations");
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
    },
  });

  revalidatePath("/host/reservations");
  revalidatePath("/trips");

  redirect("/host/reservations");
}
export async function cancelPendingBooking(bookingId: string) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/sign-in");
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking || booking.guestId !== user.id) {
    redirect("/trips");
  }

  if (booking.status !== "PENDING") {
    redirect("/trips");
  }

  await db.booking.update({
    where: { id: bookingId },
    data: {
      status: "CANCELLED",
    },
  });

  revalidatePath("/trips");
  revalidatePath("/host/reservations");

  redirect("/trips");
}
