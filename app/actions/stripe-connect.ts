"use server";

import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { redirect } from "next/navigation";

export async function startStripeOnboarding() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("You must be signed in.");
  }
const appUrl = process.env.NEXT_PUBLIC_APP_URL;

if (!appUrl) {
  throw new Error("NEXT_PUBLIC_APP_URL is not configured.");
}
  const hostProfile = await db.hostProfile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (!hostProfile) {
    throw new Error("Host profile not found.");
  }

  let stripeAccountId = hostProfile.stripeAccountId;

  if (!stripeAccountId) {
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        transfers: {
          requested: true,
        },
      },
    });

    stripeAccountId = account.id;

    await db.hostProfile.update({
      where: {
        id: hostProfile.id,
      },
      data: {
        stripeAccountId,
        payoutStatus: "PENDING",
      },
    });
  }

  const accountLink = await stripe.accountLinks.create({
    account: stripeAccountId,
    refresh_url: `${appUrl}/host/earnings`,
return_url: `${appUrl}/host/earnings`,
    type: "account_onboarding",
  });

  redirect(accountLink.url);
}
