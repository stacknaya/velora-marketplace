"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function startOfUtcDay(dateString: string) {
  return new Date(`${dateString}T00:00:00.000Z`);
}

function dayAfterUtc(dateString: string) {
  const date = startOfUtcDay(dateString);
  date.setUTCDate(date.getUTCDate() + 1);
  return date;
}

export async function blockListingDates(
  listingId: string,
  startDate: string,
  endDate: string
) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  const listing = await db.listing.findUnique({
    where: {
      id: listingId,
    },
  });

  if (!listing || listing.hostId !== user.id) {
    return {
      success: false,
      error: "Listing not found.",
    };
  }

  if (!startDate || !endDate) {
    return {
      success: false,
      error: "Select a start and end date.",
    };
  }

  const startAt = startOfUtcDay(startDate);

  // The selected end date is inclusive for the host.
  // Example: Sept 20–24 blocks all of Sept 24 too.
  const endAt = dayAfterUtc(endDate);

  if (
    Number.isNaN(startAt.getTime()) ||
    Number.isNaN(endAt.getTime()) ||
    startAt >= endAt
  ) {
    return {
      success: false,
      error: "Invalid date range.",
    };
  }

  const today = new Date();
  const todayUtc = new Date(
    Date.UTC(
      today.getUTCFullYear(),
      today.getUTCMonth(),
      today.getUTCDate()
    )
  );

  if (startAt < todayUtc) {
    return {
      success: false,
      error: "Past dates cannot be blocked.",
    };
  }

  // Prevent manually blocking dates that already contain
  // a pending or confirmed reservation.
  const bookingConflict = await db.booking.findFirst({
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

  if (bookingConflict) {
    return {
      success: false,
      error:
        "This range overlaps an existing pending or confirmed reservation.",
    };
  }

  // Prevent duplicate or overlapping manual blocked ranges.
  const blockedConflict = await db.blockedDate.findFirst({
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

  if (blockedConflict) {
    return {
      success: false,
      error: "Some of these dates are already blocked.",
    };
  }

  await db.blockedDate.create({
    data: {
      listingId,
      startAt,
      endAt,
      reason: "Blocked by host",
    },
  });

  revalidatePath("/host/calendar");
  revalidatePath(`/listing/${listing.slug}`);

  return {
    success: true,
  };
}

export async function unblockListingDates(blockedDateId: string) {
  const user = await getCurrentUser();

  if (!user) {
    return {
      success: false,
      error: "You must be signed in.",
    };
  }

  const blockedDate = await db.blockedDate.findUnique({
    where: {
      id: blockedDateId,
    },
    include: {
      listing: true,
    },
  });

  if (!blockedDate || blockedDate.listing.hostId !== user.id) {
    return {
      success: false,
      error: "Blocked date range not found.",
    };
  }

  await db.blockedDate.delete({
    where: {
      id: blockedDateId,
    },
  });

  revalidatePath("/host/calendar");
  revalidatePath(`/listing/${blockedDate.listing.slug}`);

  return {
    success: true,
  };
}
