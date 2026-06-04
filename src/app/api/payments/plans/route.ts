import { NextResponse } from "next/server";
import { db } from "@/db";
import { plans } from "@/db/schema/payment";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const allPlans = await db
      .select()
      .from(plans)
      .where(eq(plans.isActive, true));

    const formattedPlans = allPlans.map((plan) => ({
      ...plan,
      features: plan.features ? JSON.parse(plan.features) : [],
    }));

    return NextResponse.json(formattedPlans);
  } catch (error) {
    console.error("Error fetching plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
