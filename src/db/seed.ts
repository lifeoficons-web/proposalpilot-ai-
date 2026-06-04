import { db } from "@/db";
import { plans } from "@/db/schema/payment";

export async function seedPlans() {
  const existingPlans = await db.select().from(plans);
  if (existingPlans.length > 0) return;

  await db.insert(plans).values([
    {
      id: "free",
      name: "Free",
      description: "Perfect for trying out ProposalPilot.",
      price: 0,
      currency: "USD",
      interval: "month",
      features: JSON.stringify([
        "10 proposals/month",
        "Basic scoring",
        "Proposal history"
      ]),
      isActive: true,
    },
    {
      id: "pro_monthly",
      name: "Pro Monthly",
      description: "For serious freelancers.",
      price: 1900, // $19.00
      currency: "USD",
      interval: "month",
      features: JSON.stringify([
        "Unlimited proposals",
        "Advanced scoring",
        "Priority AI model access",
        "Analytics dashboard"
      ]),
      isActive: true,
    },
    {
      id: "pro_yearly",
      name: "Pro Yearly",
      description: "Best value for long-term growth.",
      price: 19000, // $190.00
      currency: "USD",
      interval: "year",
      features: JSON.stringify([
        "Unlimited proposals",
        "Advanced scoring",
        "Priority AI model access",
        "Analytics dashboard",
        "2 months free"
      ]),
      isActive: true,
    },
    {
      id: "business",
      name: "Business",
      description: "For agencies and teams.",
      price: 4900, // $49.00
      currency: "USD",
      interval: "month",
      features: JSON.stringify([
        "Unlimited proposals",
        "Advanced scoring",
        "Priority AI model access",
        "Analytics dashboard",
        "Team collaboration",
        "Dedicated support"
      ]),
      isActive: true,
    },
  ]);
}
