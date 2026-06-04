import { db } from "@/db";
import { subscriptions, plans } from "@/db/schema/payment";
import { eq, and, gt } from "drizzle-orm";

export async function getUserSubscription(userId: string) {
  const [sub] = await db
    .select({
      id: subscriptions.id,
      status: subscriptions.status,
      currentPeriodEnd: subscriptions.currentPeriodEnd,
      planId: plans.id,
      planName: plans.name,
    })
    .from(subscriptions)
    .innerJoin(plans, eq(subscriptions.planId, plans.id))
    .where(
      and(
        eq(subscriptions.userId, userId),
        eq(subscriptions.status, "active"),
        gt(subscriptions.currentPeriodEnd, new Date())
      )
    )
    .limit(1);

  return sub || null;
}

export async function isUserPro(userId: string) {
  const sub = await getUserSubscription(userId);
  return sub !== null && (sub.planId === "pro_monthly" || sub.planId === "pro_yearly");
}
