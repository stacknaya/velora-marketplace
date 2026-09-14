import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed." },
      { status: 500 }
    );
  }
}
