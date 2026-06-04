import { NextResponse } from "next/server";
import { db } from "@/db";
import { proposals } from "@/db/schema/proposals";
import { eq, desc, asc, and, like, sql, gte, lte } from "drizzle-orm";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search");
  const filter = searchParams.get("filter"); // high (80+), medium (50-79), low (<50)
  const sort = searchParams.get("sort") || "newest";

  try {
    const offset = (page - 1) * limit;

    let whereClause = eq(proposals.userId, payload.userId);

    if (search) {
      whereClause = and(whereClause, like(proposals.jobDescription, `%${search}%`)) as any;
    }

    if (filter) {
      if (filter === "high") {
        whereClause = and(whereClause, gte(proposals.score, 80)) as any;
      } else if (filter === "medium") {
        whereClause = and(whereClause, and(gte(proposals.score, 50), lte(proposals.score, 79))) as any;
      } else if (filter === "low") {
        whereClause = and(whereClause, lte(proposals.score, 49)) as any;
      }
    }

    let orderBy;
    switch (sort) {
      case "oldest":
        orderBy = asc(proposals.createdAt);
        break;
      case "score_asc":
        orderBy = asc(proposals.score);
        break;
      case "score_desc":
        orderBy = desc(proposals.score);
        break;
      case "newest":
      default:
        orderBy = desc(proposals.createdAt);
        break;
    }

    const results = await db.query.proposals.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy,
    });

    const [totalResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(proposals)
      .where(whereClause);

    const total = totalResult.count;
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      proposals: results,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Failed to fetch proposal history:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
