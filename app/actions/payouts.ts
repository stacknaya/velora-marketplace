import { NextRequest, NextResponse } from "next/server";
import { releaseEligiblePayouts } from "@/app/actions/payouts";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const payoutSummary = await releaseEligiblePayouts();

    return NextResponse.json({
      success: true,
      eligible: payoutSummary.eligible,
      released: payoutSummary.released,
      failed: payoutSummary.failed,
      results: payoutSummary.results,
    });
  } catch (error) {
    console.error("Automatic payout release failed:", error);

    return NextResponse.json(
      { error: "Payout release failed." },
      { status: 500 }
    );
  }
}
