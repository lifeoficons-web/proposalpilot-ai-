import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { generateToken } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const { idToken, name, email, googleId } = await request.json();

    // In a real app, we would verify the idToken using google-auth-library
    // For now, we'll trust the input (placeholder logic)
    
    if (!email || !googleId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let user = await db.query.users.findFirst({
      where: eq(users.googleId, googleId),
    });

    if (!user) {
      // Check if user exists with this email but no googleId
      user = await db.query.users.findFirst({
        where: eq(users.email, email),
      });

      if (user) {
        // Link googleId to existing account
        await db.update(users)
          .set({ googleId, name: name || user.name, updatedAt: new Date() })
          .where(eq(users.id, user.id));
      } else {
        // Create new user
        const [newUser] = await db.insert(users).values({
          name: name || email.split("@")[0],
          email,
          googleId,
          role: "user",
        }).returning();
        user = newUser;
      }
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const response = NextResponse.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Google auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
