import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, subscriptions, plans } from "@/db/schema/payment";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { planId, provider, userId } = body;

    if (!planId || !provider || !userId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Fetch plan details
    const [plan] = await db
      .select()
      .from(plans)
      .where(eq(plans.id, planId));

    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const paymentId = nanoid();

    // 2. Create a pending payment record
    await db.insert(payments).values({
      id: paymentId,
      userId,
      amount: plan.price,
      currency: plan.currency,
      status: "pending",
      provider,
      metadata: JSON.stringify({ planId }),
    });

    // 3. Handle specific provider logic
    if (provider === "paypal") {
      // Mock PayPal checkout session creation
      // In a real app, you'd call PayPal API here
      const paypalUrl = `https://www.paypal.com/checkout?paymentId=${paymentId}`;
      return NextResponse.json({ checkoutUrl: paypalUrl, paymentId });
    }

    if (provider === "bank_transfer") {
      // For bank transfer, we just return the payment ID and instructions
      return NextResponse.json({
        message: "Payment record created. Please upload your proof of transfer.",
        paymentId,
        instructions: {
          bankName: "ProposalPilot Bank",
          accountNumber: "1234567890",
          routingNumber: "098765432",
          reference: paymentId,
        },
      });
    }

    return NextResponse.json({ error: "Unsupported provider" }, { status: 400 });
  } catch (error) {
    console.error("Error creating subscription:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
