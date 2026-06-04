"use client"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Check,
  Sparkles,
  Zap,
} from "lucide-react"

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    description: "Perfect for getting started with AI-powered proposals.",
    features: [
      "10 proposals per month",
      "Basic proposal scoring",
      "Proposal history (30 days)",
      "Standard AI model",
      "Email support",
    ],
    cta: "Get Started Free",
    variant: "outline" as const,
    popular: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For serious freelancers who want to win more clients.",
    features: [
      "Unlimited proposals",
      "Advanced scoring & analytics",
      "Proposal history (unlimited)",
      "Priority AI model (GPT-4o)",
      "Follow-up message generator",
      "Analytics dashboard",
      "Priority email & chat support",
    ],
    cta: "Subscribe to Pro",
    variant: "default" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$49",
    period: "/month",
    description: "For power users and agencies managing multiple profiles.",
    features: [
      "Everything in Pro",
      "Up to 5 team members",
      "Custom proposal templates",
      "API access",
      "Dedicated account manager",
      "SSO & advanced security",
      "Custom AI model training",
      "SLA & phone support",
    ],
    cta: "Contact Sales",
    variant: "outline" as const,
    popular: false,
  },
]

const faqs = [
  {
    q: "Can I switch plans at any time?",
    a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    q: "What happens if I exceed my proposal limit?",
    a: "Free tier users who hit 10 proposals/month can upgrade to Pro for unlimited proposals, or wait for the next billing cycle.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "Yes! We offer a 7-day free trial of the Pro plan — no credit card required.",
  },
  {
    q: "Can I cancel my subscription?",
    a: "Absolutely. You can cancel anytime from your billing settings, and you'll retain access until the end of your billing period.",
  },
]

export default function PricingPage() {
  return (
    <div className="container py-12 md:py-20">
      {/* Header */}
      <div className="mx-auto max-w-4xl text-center">
        <div className="inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-sm text-muted-foreground mb-6">
          <Sparkles className="h-4 w-4 text-accent" />
          <span>Simple, transparent pricing</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          The right plan for your{" "}
          <span className="text-accent">freelance journey</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
          Start free and upgrade as you grow. No hidden fees, no surprises.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-3 lg:gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={cn(
              "relative flex flex-col rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md",
              plan.popular && "border-accent ring-1 ring-accent shadow-lg"
            )}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  <Zap className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}
            <div className="mb-5">
              <h3 className="text-lg font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-muted-foreground">{plan.period}</span>
                )}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{plan.description}</p>
            </div>

            <ul className="mb-8 flex-1 space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              variant={plan.variant}
              size="lg"
              className={cn(
                "w-full",
                plan.popular && "bg-accent text-accent-foreground hover:bg-accent/90"
              )}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Feature Comparison Summary */}
      <div className="mx-auto mt-20 max-w-4xl rounded-xl border bg-card p-8 shadow-sm">
        <h2 className="text-center text-2xl font-bold mb-8">Compare plans in detail</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-semibold">Feature</th>
                <th className="pb-3 font-semibold text-center">Free</th>
                <th className="pb-3 font-semibold text-center text-accent">Pro</th>
                <th className="pb-3 font-semibold text-center">Enterprise</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[
                ["AI-generated proposals", "✓", "✓ (Unlimited)", "✓ (Unlimited)"],
                ["Proposal scoring", "Basic", "Advanced", "Advanced"],
                ["Analytics dashboard", "—", "✓", "✓"],
                ["Follow-up generator", "—", "✓", "✓"],
                ["Team members", "1", "1", "Up to 5"],
                ["Custom templates", "—", "—", "✓"],
                ["API access", "—", "—", "✓"],
                ["Priority support", "—", "✓", "✓"],
                ["SLA guarantee", "—", "—", "✓"],
              ].map(([feature, free, pro, enterprise]) => (
                <tr key={feature}>
                  <td className="py-3 pr-4">{feature}</td>
                  <td className="py-3 text-center text-muted-foreground">{free}</td>
                  <td className="py-3 text-center font-medium text-accent">{pro}</td>
                  <td className="py-3 text-center">{enterprise}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQs */}
      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="text-center text-2xl font-bold mb-8">Frequently asked questions</h2>
        <div className="space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-xl border bg-card p-5 shadow-sm open:shadow-md transition-shadow"
            >
              <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground list-none">
                {faq.q}
                <span className="ml-4 text-muted-foreground transition-transform group-open:rotate-180">
                  ▼
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="mx-auto mt-20 max-w-3xl text-center">
        <div className="rounded-xl border bg-gradient-to-br from-accent/5 via-card to-accent/5 p-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-3">
            Still not sure which plan is right?
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Start with the Free tier — no credit card needed. Upgrade anytime as your proposal volume grows.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg">Start Free Trial</Button>
            <Button variant="outline" size="lg">Talk to Sales</Button>
          </div>
        </div>
      </div>
    </div>
  )
}