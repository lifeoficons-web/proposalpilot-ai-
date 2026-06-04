"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  TrendingUp,
  Award,
  Clock,
  Star,
  Sparkles,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  Search,
  MoreHorizontal,
} from "lucide-react"

const recentProposals = [
  { id: 1, title: "React Dashboard Developer", client: "TechCorp Inc.", date: "Jun 4, 2025", score: 8.5, status: "interviewed" },
  { id: 2, title: "Next.js E-commerce Platform", client: "ShopFlow", date: "Jun 2, 2025", score: 9.2, status: "pending" },
  { id: 3, title: "Python Data Pipeline", client: "DataViz Co.", date: "May 28, 2025", score: 6.8, status: "rejected" },
  { id: 4, title: "Full-Stack SaaS Application", client: "StartupXYZ", date: "May 25, 2025", score: 8.0, status: "interviewed" },
  { id: 5, title: "Mobile App UI with React Native", client: "AppForge", date: "May 22, 2025", score: 7.2, status: "pending" },
]

const monthlyStats = [
  { month: "Jan", proposals: 8, interviews: 2 },
  { month: "Feb", proposals: 12, interviews: 3 },
  { month: "Mar", proposals: 15, interviews: 5 },
  { month: "Apr", proposals: 10, interviews: 3 },
  { month: "May", proposals: 18, interviews: 6 },
  { month: "Jun", proposals: 12, interviews: 4 },
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const statusStyles: Record<string, string> = {
    interviewed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    rejected: "bg-destructive/10 text-destructive",
  }

  const scoreColor = (score: number) => {
    if (score >= 8) return "text-success border-success/30 bg-success/10"
    if (score >= 5) return "text-warning border-warning/30 bg-warning/10"
    return "text-destructive border-destructive/30 bg-destructive/10"
  }

  const filteredProposals = recentProposals.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalProposals = recentProposals.length + 42
  const interviewCount = recentProposals.filter((p) => p.status === "interviewed").length + 12
  const interviewRate = Math.round((interviewCount / totalProposals) * 100)
  const avgScore = 7.8

  return (
    <div className="container py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="mt-1 text-muted-foreground">
                Your proposal performance at a glance.
              </p>
            </div>
            <Button>
              <Sparkles className="mr-2 h-4 w-4" />
              New Proposal
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 mb-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                +12%
              </span>
            </div>
            <p className="text-2xl font-bold">{totalProposals}</p>
            <p className="text-xs text-muted-foreground">Total Proposals</p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                +8%
              </span>
            </div>
            <p className="text-2xl font-bold">{interviewRate}%</p>
            <p className="text-xs text-muted-foreground">Interview Rate</p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Star className="h-5 w-5 text-warning" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                +0.5
              </span>
            </div>
            <p className="text-2xl font-bold">{avgScore}</p>
            <p className="text-xs text-muted-foreground">Avg. Score</p>
          </div>

          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Award className="h-5 w-5 text-accent" />
              </div>
              <span className="text-xs text-success flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                +5
              </span>
            </div>
            <p className="text-2xl font-bold">18</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
        </div>

        {/* Chart + Recent Activity Grid */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          {/* Mini Chart Card */}
          <div className="lg:col-span-2 rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Monthly Activity</h2>
              <span className="text-xs text-muted-foreground">Proposals vs Interviews</span>
            </div>
            <div className="flex items-end gap-2 h-32">
              {monthlyStats.map((stat) => {
                const maxVal = Math.max(...monthlyStats.map((s) => s.proposals))
                const propHeight = (stat.proposals / maxVal) * 100
                const intHeight = (stat.interviews / maxVal) * 100
                return (
                  <div key={stat.month} className="flex-1 flex flex-col items-center gap-1">
                    <div className="w-full flex flex-col items-center gap-0.5">
                      <div
                        className="w-full rounded-sm bg-accent/30 transition-all"
                        style={{ height: `${propHeight}%` }}
                      />
                      <div
                        className="w-full rounded-sm bg-accent transition-all"
                        style={{ height: `${intHeight}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted-foreground">{stat.month}</span>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-accent/30" />
                Proposals
              </div>
              <div className="flex items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-sm bg-accent" />
                Interviews
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <h2 className="font-semibold mb-4">Quick Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2.5">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Avg. response time</span>
                </div>
                <span className="text-sm font-medium">2.4 days</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2.5">
                  <Star className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Best score</span>
                </div>
                <span className="text-sm font-medium text-success">9.2</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Proposals this week</span>
                </div>
                <span className="text-sm font-medium">4</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Award className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Pro plan</span>
                </div>
                <span className="inline-flex items-center rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-medium text-accent">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Proposals */}
        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-6 pb-4 border-b">
            <h2 className="font-semibold">Recent Proposals</h2>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-8 h-8 w-48 text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button variant="ghost" size="sm">
                View All
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="divide-y">
            {filteredProposals.map((proposal) => (
              <div
                key={proposal.id}
                className="flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors cursor-pointer"
              >
                <div
                  className={`w-1 h-10 rounded-full shrink-0 ${
                    proposal.status === "interviewed"
                      ? "bg-success"
                      : proposal.status === "pending"
                      ? "bg-warning"
                      : "bg-destructive"
                  }`}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{proposal.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {proposal.client} &middot; {proposal.date}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold shrink-0 ${scoreColor(proposal.score)}`}
                >
                  {proposal.score}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium shrink-0 ${statusStyles[proposal.status]}`}
                >
                  {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                </span>
                <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          {filteredProposals.length === 0 && (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No proposals match your search.
            </div>
          )}
        </div>

        {/* Upgrade CTA */}
        <div className="mt-6 rounded-xl border border-accent/20 bg-gradient-to-r from-accent/5 to-accent/10 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/20">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="font-semibold">Upgrade to Pro</p>
                <p className="text-sm text-muted-foreground">
                  Unlimited proposals, advanced scoring, and priority AI model access.
                </p>
              </div>
            </div>
            <Button>View Plans</Button>
          </div>
        </div>
      </div>
    </div>
  )
}