"use server";

import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function releaseEligiblePayouts() {
  const now = new Date();

  const bookings = await db.booking.findMany({
    where: {
  status: "CONFIRMED",
  stripePaymentStatus: "PAID",
  payoutEligibleAt: {
    lte: now,
  },
  payoutReleasedAt: null,
  stripeTransferId: null,
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

  const results = [];

  for (const booking of bookings) {
    const stripeAccountId =
      booking.listing.host.hostProfile?.stripeAccountId;

    if (!stripeAccountId) {
      results.push({
        bookingId: booking.id,
        success: false,
        error: "Host does not have a Stripe account.",
      });

      continue;
    }

    const payoutAmount = Math.round(booking.hostPayout * 100);

    if (payoutAmount <= 0) {
      results.push({
        bookingId: booking.id,
        success: false,
        error: "Invalid payout amount.",
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

      results.push({
        bookingId: booking.id,
        success: true,
        transferId: transfer.id,
      });
    } catch (error) {
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

  return results;
}
