"use client"

import { Button } from "@/components/ui/button"
import {
  CreditCard,
  Download,
  FileText,
  TrendingUp,
  Zap,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Receipt,
} from "lucide-react"

const invoices = [
  { id: "INV-2025-001", date: "Jun 1, 2025", amount: "$19.00", status: "Paid", paid: true },
  { id: "INV-2025-002", date: "May 1, 2025", amount: "$19.00", status: "Paid", paid: true },
  { id: "INV-2025-003", date: "Apr 1, 2025", amount: "$19.00", status: "Paid", paid: true },
  { id: "INV-2025-004", date: "Mar 1, 2025", amount: "$0.00", status: "Free Tier", paid: true },
]

const paymentMethods = [
  { type: "Visa", last4: "4242", exp: "12/27", default: true },
]

export default function BillingPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-4xl">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Billing & Subscription</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your plan, payment methods, and billing history.
          </p>
        </div>

        <div className="grid gap-8">
          {/* Current Plan Card */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                    <Zap className="h-6 w-6 text-accent" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-xl font-semibold">Pro Plan</h2>
                      <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                        Active
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      You&apos;re on the Pro plan. Your next billing date is <strong>Jul 1, 2025</strong>.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">$19</p>
                  <p className="text-sm text-muted-foreground">/month</p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Proposals Used</p>
                  <p className="text-lg font-semibold">24 / ∞</p>
                  <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                    <div className="h-1.5 w-1/4 rounded-full bg-accent" />
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Proposals This Month</p>
                  <p className="text-lg font-semibold">+18%</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-success">
                    <TrendingUp className="h-3 w-3" />
                    <span>Up from last month</span>
                  </div>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs text-muted-foreground mb-1">Interview Rate</p>
                  <p className="text-lg font-semibold">34%</p>
                  <p className="mt-1 text-xs text-muted-foreground">+8% since Pro upgrade</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Button variant="default">
                  <span className="flex items-center gap-2">
                    Manage Subscription
                    <ChevronRight className="h-4 w-4" />
                  </span>
                </Button>
                <Button variant="outline">Change Plan</Button>
                <Button variant="ghost" className="text-destructive hover:text-destructive">
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Payment Methods</h2>
                </div>
                <Button variant="outline" size="sm">Add Payment Method</Button>
              </div>
              <div className="space-y-3">
                {paymentMethods.map((pm) => (
                  <div
                    key={pm.last4}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-muted text-xs font-bold text-muted-foreground">
                        {pm.type}
                      </div>
                      <div>
                        <p className="text-sm font-medium">
                          {pm.type} ending in {pm.last4}
                        </p>
                        <p className="text-xs text-muted-foreground">Expires {pm.exp}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {pm.default && (
                        <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                          Default
                        </span>
                      )}
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Billing History */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Receipt className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Invoices</h2>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-1.5" />
                  Download All
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Invoice</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Amount</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {invoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-3 pr-4">
                          <span className="font-medium">{inv.id}</span>
                        </td>
                        <td className="py-3 pr-4 text-muted-foreground">{inv.date}</td>
                        <td className="py-3 pr-4">{inv.amount}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              inv.paid
                                ? "bg-success/10 text-success"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {inv.paid ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : (
                              <AlertCircle className="h-3 w-3" />
                            )}
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Button variant="ghost" size="sm">
                            <Download className="h-3.5 w-3.5" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Usage Summary */}
          <div className="rounded-xl border bg-card shadow-sm">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">Plan Usage</h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Proposals used this month</span>
                    <span className="font-medium">24 of ∞</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div className="h-2 w-1/5 rounded-full bg-accent" />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Pro plan has unlimited proposals
                  </p>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">AI model</span>
                    <span className="font-medium">GPT-4o (Priority)</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Scoring type</span>
                    <span className="font-medium">Advanced</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">History retention</span>
                    <span className="font-medium">Unlimited</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}