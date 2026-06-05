"use client"

import { useState, useEffect } from "react"
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
import { useRouter } from "next/navigation"

type Proposal = {
  id: string
  jobDescription: string
  score: number
  createdAt: string
  status?: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function load() {
      try {
        const [proposalsRes, authRes] = await Promise.all([
          fetch("/api/proposals/history?limit=5&sort=newest"),
          fetch("/api/auth/me"),
        ])
        if (proposalsRes.ok) setProposals((await proposalsRes.json()).proposals || await proposalsRes.json())
        if (authRes.ok) setUser(await authRes.json())
      } catch (e) {
        console.error("Failed to load dashboard", e)
      }
      setLoading(false)
    }
    load()
  }, [])

  const totalProposals = proposals.length
  const avgScore = proposals.length
    ? Math.round(proposals.reduce((a, p) => a + p.score, 0) / proposals.length)
    : 0
  const thisMonth = proposals.filter((p) => {
    const d = new Date(p.createdAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const scoreColor = (s: number) => s >= 80 ? "text-success" : s >= 50 ? "text-warning" : "text-destructive"
  const scoreBg = (s: number) => s >= 80 ? "bg-success/10" : s >= 50 ? "bg-warning/10" : "bg-destructive/10"

  const truncate = (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + "..." : text

  if (loading) {
    return (
      <div className="container py-10">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="grid gap-4 md:grid-cols-4">
            {[1,2,3,4].map(i => <div key={i} className="h-28 bg-muted rounded-xl" />)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </p>
          </div>
          <Button onClick={() => router.push("/")}>
            <Sparkles className="mr-2 h-4 w-4" />
            New Proposal
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <FileText className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold">{totalProposals}</p>
            <p className="text-xs text-muted-foreground">Total Proposals</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </div>
            <p className="text-2xl font-bold">{avgScore}/100</p>
            <p className="text-xs text-muted-foreground">Average Score</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Award className="h-5 w-5 text-warning" />
              </div>
            </div>
            <p className="text-2xl font-bold">{thisMonth}</p>
            <p className="text-xs text-muted-foreground">This Month</p>
          </div>
          <div className="rounded-xl border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <Clock className="h-5 w-5 text-accent" />
              </div>
            </div>
            <p className="text-2xl font-bold">{proposals.length > 0 ? proposals[0].createdAt?.slice(0, 10) || "—" : "—"}</p>
            <p className="text-xs text-muted-foreground">Latest Activity</p>
          </div>
        </div>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-lg font-semibold">Recent Proposals</h2>
            <Button variant="outline" size="sm" onClick={() => router.push("/history")}>
              View All <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          {proposals.length === 0 ? (
            <div className="p-10 text-center text-muted-foreground">
              <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
              <p>No proposals yet. Generate your first one!</p>
              <Button className="mt-4" onClick={() => router.push("/")}>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Proposal
              </Button>
            </div>
          ) : (
            <div className="divide-y">
              {proposals.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{truncate(p.jobDescription, 60)}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${scoreBg(p.score)} ${scoreColor(p.score)}`}>
                    <Star className="h-3 w-3" />
                    {p.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}