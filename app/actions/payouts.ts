"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function releaseEligiblePayouts() {
  const now = new Date();

  const bookings = await db.booking.findMany({
    where: {
      status: {
        in: ["CONFIRMED", "COMPLETED"],
      },
      payoutEligibleAt: {
        lte: now,
      },
      payoutReleasedAt: null,
      stripeTransferId: null,
      hostPayout: {
        gt: 0,
      },
    },
    include: {
      listing: {
        include: {
          host: {
            include: {
              hostProfile: true,
            },
          },
        },
      },
    },
  });

  const results: Array<{
    bookingId: string;
    success: boolean;
    transferId?: string;
    error?: string;
  }> = [];

  let released = 0;
  let failed = 0;

  for (const booking of bookings) {
    const hostProfile = booking.listing.host.hostProfile;
    const stripeAccountId = hostProfile?.stripeAccountId;

    if (!stripeAccountId) {
      failed++;

      results.push({
        bookingId: booking.id,
        success: false,
        error: "Host does not have a connected Stripe account.",
      });

      continue;
    }

    const payoutAmount = Math.round(booking.hostPayout * 100);

    if (!Number.isSafeInteger(payoutAmount) || payoutAmount <= 0) {
      failed++;

      results.push({
        bookingId: booking.id,
        success: false,
        error: "Invalid host payout amount.",
      });

      continue;
    }

    try {
      const transfer = await stripe.transfers.create(
        {
          amount: payoutAmount,
          currency: "usd",
          destination: stripeAccountId,
          metadata: {
            bookingId: booking.id,
            listingId: booking.listingId,
            hostId: booking.listing.hostId,
          },
        },
        {
          idempotencyKey: `velora-booking-payout-${booking.id}`,
        }
      );

      await db.booking.update({
        where: {
          id: booking.id,
        },
        data: {
          stripeTransferId: transfer.id,
          payoutReleasedAt: new Date(),
        },
      });

      released++;

      results.push({
        bookingId: booking.id,
        success: true,
        transferId: transfer.id,
      });
    } catch (error) {
      failed++;

      console.error(
        `Stripe payout failed for booking ${booking.id}:`,
        error
      );

      results.push({
        bookingId: booking.id,
        success: false,
        error: "Stripe transfer failed.",
      });
    }
  }

  return {
    eligible: bookings.length,
    released,
    failed,
    results,
  };
}
