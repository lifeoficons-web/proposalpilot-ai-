"use client"

import { Button } from "@/components/ui/button"
import {
  Search,
  Filter,
  Download,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  DollarSign,
  Users,
  TrendingUp,
  Activity,
} from "lucide-react"

const payments = [
  { id: "PAY-001", user: "alex@example.com", plan: "Pro", amount: "$19.00", date: "Jun 4, 2025", method: "Visa •••• 4242", status: "completed" },
  { id: "PAY-002", user: "jordan@example.com", plan: "Pro", amount: "$19.00", date: "Jun 3, 2025", method: "Bank Transfer", status: "pending", note: "Awaiting verification" },
  { id: "PAY-003", user: "sam@example.com", plan: "Enterprise", amount: "$49.00", date: "Jun 2, 2025", method: "Visa •••• 1234", status: "completed" },
  { id: "PAY-004", user: "taylor@example.com", plan: "Pro", amount: "$19.00", date: "Jun 1, 2025", method: "PayPal", status: "completed" },
  { id: "PAY-005", user: "casey@example.com", plan: "Pro", amount: "$19.00", date: "May 30, 2025", method: "Bank Transfer", status: "failed", note: "Insufficient funds" },
  { id: "PAY-006", user: "riley@example.com", plan: "Free → Pro", amount: "$19.00", date: "May 28, 2025", method: "Bank Transfer", status: "pending", note: "Proof uploaded Jun 4" },
  { id: "PAY-007", user: "morgan@example.com", plan: "Enterprise", amount: "$49.00", date: "May 25, 2025", method: "Wire Transfer", status: "completed" },
  { id: "PAY-008", user: "quinn@example.com", plan: "Pro", amount: "$19.00", date: "May 20, 2025", method: "Visa •••• 5678", status: "completed" },
]

const statusStyles: Record<string, string> = {
  completed: "bg-success/10 text-success",
  pending: "bg-warning/10 text-warning",
  failed: "bg-destructive/10 text-destructive",
}

const statusIcons: Record<string, React.ReactNode> = {
  completed: <CheckCircle2 className="h-3 w-3" />,
  pending: <Clock className="h-3 w-3" />,
  failed: <XCircle className="h-3 w-3" />,
}

export default function AdminPaymentsPage() {
  return (
    <div className="container py-10">
      <div className="mx-auto max-w-7xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                  Admin
                </span>
                <h1 className="text-3xl font-bold tracking-tight">Payment Management</h1>
              </div>
              <p className="text-muted-foreground">
                Monitor subscriptions, verify bank transfers, and manage billing.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-1.5" />
                Export CSV
              </Button>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-1.5" />
                Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <DollarSign className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold">$4,832</p>
            <p className="text-xs text-muted-foreground">Monthly Recurring Revenue</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <Users className="h-5 w-5 text-success" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8%
              </span>
            </div>
            <p className="text-2xl font-bold">247</p>
            <p className="text-xs text-muted-foreground">Active Subscribers</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold">12</p>
            <p className="text-xs text-muted-foreground">Pending Verifications</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <Activity className="h-5 w-5 text-destructive" />
              </div>
            </div>
            <p className="text-2xl font-bold">3</p>
            <p className="text-xs text-muted-foreground">Failed Payments</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-6">
          <Button size="sm">
            <span className="flex items-center gap-1">Pending Bank Transfers (6)</span>
          </Button>
          <Button variant="outline" size="sm">Flagged Payments</Button>
          <Button variant="outline" size="sm">Send Invoice Reminders</Button>
        </div>

        {/* Search + Filter Bar */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by email, plan, or ID..."
              className="w-full rounded-lg border border-input bg-background py-2 pl-9 pr-4 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button variant="outline" size="sm">
            All Status
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm">
            All Plans
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
          <Button variant="outline" size="sm">
            Last 30 Days
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </div>

        {/* Payments Table */}
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Transaction</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">User</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Plan</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Amount</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Date</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Method</th>
                  <th className="py-3 px-4 text-left font-medium text-muted-foreground">Status</th>
                  <th className="py-3 px-4 text-right font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-muted/20 transition-colors">
                    <td className="py-3 px-4 font-medium">{payment.id}</td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.user}</td>
                    <td className="py-3 px-4">{payment.plan}</td>
                    <td className="py-3 px-4 font-medium">{payment.amount}</td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.date}</td>
                    <td className="py-3 px-4 text-muted-foreground">{payment.method}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          statusStyles[payment.status]
                        }`}
                      >
                        {statusIcons[payment.status]}
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                      {payment.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{payment.note}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {payment.status === "pending" && (
                          <>
                            <Button variant="ghost" size="xs" className="text-success">
                              Approve
                            </Button>
                            <Button variant="ghost" size="xs" className="text-destructive">
                              Reject
                            </Button>
                          </>
                        )}
                        <Button variant="ghost" size="xs">View</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t px-4 py-3">
            <span className="text-sm text-muted-foreground">
              Showing 1-8 of 142 payments
            </span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="default" size="sm">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}