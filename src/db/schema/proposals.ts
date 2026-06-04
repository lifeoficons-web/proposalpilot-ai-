import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import { users } from "./users";

export const proposals = sqliteTable("proposals", {
  id: text("id").primaryKey().$defaultFn(() => nanoid()),
  userId: text("user_id").notNull().references(() => users.id),
  jobDescription: text("job_description").notNull(),
  experienceLevel: text("experience_level").notNull(),
  skills: text("skills").notNull(), // JSON array
  portfolioLinks: text("portfolio_links"), // JSON array
  tone: text("tone").notNull(),
  generatedProposal: text("generated_proposal").notNull(), // JSON: { opening, body, painPoints[], relevantExperience, callToAction, followUpMessage }
  score: integer("score").notNull(),
  scoreBreakdown: text("score_breakdown").notNull(), // JSON: { relevance, clarity, personalization, hookStrength }
  createdAt: integer("created_at", { mode: "timestamp" }).default(sql`CURRENT_TIMESTAMP`).notNull(),
});
