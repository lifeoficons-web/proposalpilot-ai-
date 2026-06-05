const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-for-dev";

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * Edge-compatible JWT verification (no jsonwebtoken dependency).
 * Simple base64-based verification for the edge middleware.
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    // Just decode the payload part of the JWT (no signature verification on edge)
    // Full verification happens in server-side API routes using jsonwebtoken
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    // Check expiry
    if (payload.exp && Date.now() >= payload.exp * 1000) return null;
    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}

export function getPublicPaths(): string[] {
  return ["/", "/login", "/signup", "/pricing", "/api"];
}