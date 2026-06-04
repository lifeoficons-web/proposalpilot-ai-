import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as paymentSchema from "./schema/payment";
import * as userSchema from "./schema/users";
import * as proposalSchema from "./schema/proposals";

const client = createClient({
  url: process.env.DATABASE_URL || "file:local.db",
});

export const db = drizzle(client, {
  schema: {
    ...paymentSchema,
    ...userSchema,
    ...proposalSchema,
  },
});

export * from "./schema/payment";
export * from "./schema/users";
export * from "./schema/proposals";
