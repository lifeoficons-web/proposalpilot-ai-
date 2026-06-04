import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, subscriptions, plans } from "@/db/schema/payment";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // In a real app, verify the PayPal webhook signature here
    
    const { event_type, resource } = body;

    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const providerPaymentId = resource.id;
      const customId = resource.custom_id; // We'd pass our paymentId as custom_id to PayPal

      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, customId));

      if (payment && payment.status === "pending") {
        // 1. Update payment status
        await db
          .update(payments)
          .set({
            status: "completed",
            providerPaymentId,
            updatedAt: new Date(),
          })
          .where(eq(payments.id, customId));

        // 2. Create or update subscription
        const metadata = JSON.parse(payment.metadata || "{}");
        const planId = metadata.planId;

        const [plan] = await db
          .select()
          .from(plans)
          .where(eq(plans.id, planId));

        if (plan) {
          const now = new Date();
          const endDate = new Date();
          if (plan.interval === "month") {
            endDate.setMonth(now.getMonth() + 1);
          } else {
            endDate.setFullYear(now.getFullYear() + 1);
          }

          await db.insert(subscriptions).values({
            id: `sub_${customId}`,
            userId: payment.userId,
            planId: plan.id,
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            provider: "paypal",
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Error handling PayPal webhook:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
