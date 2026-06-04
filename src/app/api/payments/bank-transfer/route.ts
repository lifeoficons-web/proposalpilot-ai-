import { NextResponse } from "next/server";
import { db } from "@/db";
import { payments, bankTransfers } from "@/db/schema/payment";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { paymentId, referenceNumber, proofImageUrl } = body;

    if (!paymentId || !referenceNumber) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const [payment] = await db
      .select()
      .from(payments)
      .where(eq(payments.id, paymentId));

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Create bank transfer record
    await db.insert(bankTransfers).values({
      id: nanoid(),
      paymentId,
      referenceNumber,
      proofImageUrl,
      status: "pending",
    });

    return NextResponse.json({
      message: "Proof of transfer submitted. An admin will verify it soon.",
    });
  } catch (error) {
    console.error("Error submitting bank transfer:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
