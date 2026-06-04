import { seedPlans } from "./src/db/seed";

async function main() {
  console.log("Seeding database...");
  await seedPlans();
  console.log("Seeding completed!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
