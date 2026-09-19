import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_CHECKOUT_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: "Missing Stripe webhook configuration." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 400 }
    );
  }

  try {
    if (event.type === "account.updated") {
      const account = event.data.object as Stripe.Account;

      const payoutsReady =
        account.details_submitted === true &&
        account.payouts_enabled === true;

      await db.hostProfile.updateMany({
        where: {
          stripeAccountId: account.id,
        },
        data: {
  payoutStatus: payoutsReady ? "READY" : "PENDING",
  stripeChargesEnabled: account.charges_enabled === true,
  stripePayoutsEnabled: account.payouts_enabled === true,
},
      });
    }
        if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const bookingId = session.metadata?.bookingId;

      if (!bookingId) {
        console.error(
          "Stripe Checkout session completed without bookingId metadata"
        );
      } else {
        const booking = await db.booking.findUnique({
          where: {
            id: bookingId,
          },
          include: {
            listing: true,
          },
        });

        if (!booking) {
          console.error(
            `Booking ${bookingId} not found for completed Stripe Checkout session`
          );
        } else if (session.payment_status === "paid") {
          const paymentIntentId =
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : session.payment_intent?.id ?? null;

          const payoutEligibleAt = booking.listing.instantBook
            ? new Date(
                booking.startAt.getTime() +
                  24 * 60 * 60 * 1000
              )
            : null;

          await db.booking.update({
            where: {
              id: booking.id,
            },
            data: {
              stripePaymentIntentId: paymentIntentId,
              stripePaymentStatus: "PAID",
              paidAt: new Date(),
              status: booking.listing.instantBook
                ? "CONFIRMED"
                : "PENDING",
              payoutEligibleAt,
            },
          });
        }
      }
        }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
