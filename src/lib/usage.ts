import { db } from "@/db";
import { proposals } from "@/db/schema/proposals";
import { getUserSubscription } from "./payments";
import { count, eq, and, gt } from "drizzle-orm";

export async function checkUsageLimit(userId: string) {
  const sub = await getUserSubscription(userId);
  
  // If no subscription or free plan
  if (!sub || sub.planId === "free") {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [result] = await db
      .select({ value: count() })
      .from(proposals)
      .where(
        and(
          eq(proposals.userId, userId),
          gt(proposals.createdAt, firstDayOfMonth)
        )
      );

    const usageCount = result?.value || 0;
    const limit = 10;

    return {
      allowed: usageCount < limit,
      usage: usageCount,
      limit,
    };
  }

  // Pro plans have unlimited proposals
  return {
    allowed: true,
    usage: 0, // Not relevant for unlimited
    limit: Infinity,
  };
}
