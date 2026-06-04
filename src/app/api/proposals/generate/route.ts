import { NextResponse } from "next/server";
import { generateProposal } from "@/services/openai";
import { db } from "@/db";
import { proposals } from "@/db/schema/proposals";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { checkUsageLimit } from "@/lib/usage";

export async function POST(request: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check usage limit
  const limitCheck = await checkUsageLimit(payload.userId);
  if (!limitCheck.allowed) {
    return NextResponse.json({ 
      error: "Usage limit reached", 
      usage: limitCheck.usage, 
      limit: limitCheck.limit 
    }, { status: 403 });
  }

  try {
    const data = await request.json();
    const { jobDescription, experienceLevel, skills, portfolioLinks, tone } = data;

    if (!jobDescription) {
      return NextResponse.json({ error: "Job description is required" }, { status: 400 });
    }

    const result = await generateProposal({
      jobTitle: data.jobTitle || "Untitled Job",
      jobDescription,
      skills: Array.isArray(skills) ? skills.join(", ") : (skills || ""),
      experience: experienceLevel || "",
    });

    // Save to history
    await db.insert(proposals).values({
      userId: payload.userId,
      jobDescription,
      experienceLevel: experienceLevel || "intermediate",
      skills: JSON.stringify(Array.isArray(skills) ? skills : (skills ? [skills] : [])),
      portfolioLinks: portfolioLinks ? JSON.stringify(Array.isArray(portfolioLinks) ? portfolioLinks : [portfolioLinks]) : "[]",
      tone: tone || "professional",
      generatedProposal: JSON.stringify({
        opening: result.opening,
        body: result.body,
        painPoints: result.painPoints,
        relevantExperience: result.relevantExperience,
        callToAction: result.callToAction,
        followUpMessage: result.followUpMessage,
      }),
      score: result.score,
      scoreBreakdown: JSON.stringify(result.scoreBreakdown),
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Proposal generation failed:", error);
    return NextResponse.json({ error: "Failed to generate proposal" }, { status: 500 });
  }
}