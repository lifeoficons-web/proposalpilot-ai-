import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, subscriptions, plans, bankTransfers } from "@/db/schema/payment";
import { eq } from "drizzle-orm";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status, adminNotes, adminId } = body;

    if (!status || !["verified", "rejected"].includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const [bankTransfer] = await db
      .select()
      .from(bankTransfers)
      .where(eq(bankTransfers.id, id));

    if (!bankTransfer) {
      return NextResponse.json({ error: "Bank transfer not found" }, { status: 404 });
    }

    // 1. Update bank transfer status
    await db
      .update(bankTransfers)
      .set({
        status,
        adminNotes,
        verifiedAt: status === "verified" ? new Date() : null,
        verifiedBy: adminId,
        updatedAt: new Date(),
      })
      .where(eq(bankTransfers.id, id));

    if (status === "verified") {
      const [payment] = await db
        .select()
        .from(payments)
        .where(eq(payments.id, bankTransfer.paymentId));

      if (payment && payment.status === "pending") {
        // 2. Update payment status
        await db
          .update(payments)
          .set({
            status: "completed",
            updatedAt: new Date(),
          })
          .where(eq(payments.id, payment.id));

        // 3. Create or update subscription
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
            id: `sub_bt_${payment.id}`,
            userId: payment.userId,
            planId: plan.id,
            status: "active",
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            provider: "bank_transfer",
            createdAt: now,
            updatedAt: now,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating bank transfer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
