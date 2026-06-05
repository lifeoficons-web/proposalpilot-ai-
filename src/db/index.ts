import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Usage:
// - Local dev: DATABASE_URL=file:local.db (default)
// - Production (Vercel): DATABASE_URL=libsql://your-db.turso.io + DATABASE_AUTH_TOKEN
const url = process.env.DATABASE_URL || "file:local.db";
const authToken = process.env.DATABASE_AUTH_TOKEN;

const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client);

export { client as tursoClient };

// Re-export schemas for convenience
export * from "./schema/payment";
export * from "./schema/users";
export * from "./schema/proposals";
