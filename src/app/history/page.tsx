"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
  ArrowUpDown,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Copy,
  Eye,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from "lucide-react"

interface Proposal {
  id: number
  title: string
  client: string
  platform: string
  date: string
  score: number
  status: "interviewed" | "pending" | "rejected"
  skills: string[]
}

const allProposals: Proposal[] = [
  { id: 1, title: "React Dashboard Developer", client: "TechCorp Inc.", platform: "Upwork", date: "Jun 4, 2025", score: 8.5, status: "interviewed", skills: ["React", "Next.js", "TypeScript"] },
  { id: 2, title: "Next.js E-commerce Platform", client: "ShopFlow", platform: "Upwork", date: "Jun 2, 2025", score: 9.2, status: "pending", skills: ["Next.js", "Stripe", "Tailwind"] },
  { id: 3, title: "Python Data Pipeline", client: "DataViz Co.", platform: "Upwork", date: "May 28, 2025", score: 6.8, status: "rejected", skills: ["Python", "Pandas", "APIs"] },
  { id: 4, title: "Full-Stack SaaS Application", client: "StartupXYZ", platform: "Upwork", date: "May 25, 2025", score: 8.0, status: "interviewed", skills: ["React", "Node.js", "PostgreSQL"] },
  { id: 5, title: "Mobile App UI with React Native", client: "AppForge", platform: "Upwork", date: "May 22, 2025", score: 7.2, status: "pending", skills: ["React Native", "Figma", "TypeScript"] },
  { id: 6, title: "AWS Infrastructure Setup", client: "CloudNine", platform: "Upwork", date: "May 18, 2025", score: 8.8, status: "interviewed", skills: ["AWS", "Terraform", "Docker"] },
  { id: 7, title: "GraphQL API Development", client: "DataBridge", platform: "Upwork", date: "May 15, 2025", score: 7.5, status: "rejected", skills: ["GraphQL", "Node.js", "Apollo"] },
  { id: 8, title: "WordPress Custom Theme", client: "DesignStudio", platform: "Upwork", date: "May 12, 2025", score: 6.2, status: "pending", skills: ["WordPress", "PHP", "CSS"] },
  { id: 9, title: "AI Chatbot Integration", client: "BotWorks", platform: "Upwork", date: "May 10, 2025", score: 9.0, status: "interviewed", skills: ["OpenAI", "Python", "React"] },
  { id: 10, title: "Chrome Extension Development", client: "BrowserTools", platform: "Upwork", date: "May 8, 2025", score: 7.8, status: "pending", skills: ["JavaScript", "Chrome APIs", "React"] },
]

type SortField = "date" | "score" | "title"
type SortDir = "asc" | "desc"
type FilterStatus = "all" | "interviewed" | "pending" | "rejected"
type FilterScore = "all" | "high" | "medium" | "low"

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all")
  const [filterScore, setFilterScore] = useState<FilterScore>("all")
  const [page, setPage] = useState(1)
  const perPage = 5

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDir("desc")
    }
  }

  const statusStyles: Record<string, string> = {
    interviewed: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    rejected: "bg-destructive/10 text-destructive",
  }

  const statusIcons: Record<string, React.ReactNode> = {
    interviewed: <CheckCircle2 className="h-3 w-3" />,
    pending: <Clock className="h-3 w-3" />,
    rejected: <XCircle className="h-3 w-3" />,
  }

  const scoreColor = (score: number) => {
    if (score >= 8) return " text-success"
    if (score >= 5) return " text-warning"
    return " text-destructive"
  }

  const scoreBadgeBg = (score: number) => {
    if (score >= 8) return "bg-success/10"
    if (score >= 5) return "bg-warning/10"
    return "bg-destructive/10"
  }

  let filtered = allProposals.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.client.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || p.status === filterStatus
    const matchesScore =
      filterScore === "all" ||
      (filterScore === "high" && p.score >= 8) ||
      (filterScore === "medium" && p.score >= 5 && p.score < 8) ||
      (filterScore === "low" && p.score < 5)
    return matchesSearch && matchesStatus && matchesScore
  })

  filtered.sort((a, b) => {
    let cmp = 0
    if (sortField === "date") cmp = a.date.localeCompare(b.date)
    else if (sortField === "score") cmp = a.score - b.score
    else if (sortField === "title") cmp = a.title.localeCompare(b.title)
    return sortDir === "asc" ? cmp : -cmp
  })

  const totalPages = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice((page - 1) * perPage, page * perPage)

  const statusCounts = {
    all: allProposals.length,
    interviewed: allProposals.filter((p) => p.status === "interviewed").length,
    pending: allProposals.filter((p) => p.status === "pending").length,
    rejected: allProposals.filter((p) => p.status === "rejected").length,
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Proposal History</h1>
          <p className="mt-1 text-muted-foreground">
            Browse, search, and manage all your past proposals.
          </p>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 mb-6 border-b pb-0.5 overflow-x-auto">
          {(["all", "interviewed", "pending", "rejected"] as const).map((status) => (
            <button
              key={status}
              onClick={() => { setFilterStatus(status); setPage(1) }}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                filterStatus === status
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
              <span className="ml-1.5 text-xs opacity-60">({statusCounts[status]})</span>
            </button>
          ))}
        </div>

        {/* Search + Filters */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title or client..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
            />
          </div>
          <select
            value={filterScore}
            onChange={(e) => { setFilterScore(e.target.value as FilterScore); setPage(1) }}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="all">All Scores</option>
            <option value="high">High (8-10)</option>
            <option value="medium">Medium (5-7)</option>
            <option value="low">Low (0-4)</option>
          </select>
          <Button variant="outline" size="sm" onClick={() => toggleSort("date")}>
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            Date
            {sortField === "date" && (sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />)}
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleSort("score")}>
            <ArrowUpDown className="mr-1.5 h-3.5 w-3.5" />
            Score
            {sortField === "score" && (sortDir === "asc" ? <ArrowUp className="ml-1 h-3 w-3" /> : <ArrowDown className="ml-1 h-3 w-3" />)}
          </Button>
        </div>

        {/* List */}
        {paged.length === 0 ? (
          <div className="rounded-xl border bg-card p-12 text-center">
            <div className="flex justify-center mb-4">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No proposals found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {searchQuery
                ? "Try adjusting your search or filters."
                : "You haven't created any proposals yet."}
            </p>
            <Button>Generate Your First Proposal</Button>
          </div>
        ) : (
          <div className="rounded-xl border bg-card shadow-sm divide-y overflow-hidden">
            {paged.map((proposal) => (
              <div
                key={proposal.id}
                className="group flex items-center gap-4 px-6 py-4 hover:bg-muted/20 transition-colors"
              >
                <div
                  className={`w-1 h-12 rounded-full shrink-0 ${
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
                    {proposal.client} &middot; {proposal.platform} &middot; {proposal.date}
                  </p>
                  <div className="flex gap-1.5 mt-1.5">
                    {proposal.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="inline-block rounded bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${scoreBadgeBg(proposal.score)}${scoreColor(proposal.score)}`}
                  >
                    {proposal.score}
                  </span>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusStyles[proposal.status]}`}
                  >
                    {statusIcons[proposal.status]}
                    {proposal.status.charAt(0).toUpperCase() + proposal.status.slice(1)}
                  </span>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <Button variant="ghost" size="icon-sm" title="View">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" title="Copy">
                    <Copy className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" title="Delete" className="hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <span className="text-sm text-muted-foreground">
              Showing {(page - 1) * perPage + 1}-{Math.min(page * perPage, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={page === n ? "default" : "outline"}
                  size="sm"
                  onClick={() => setPage(n)}
                  className="w-8"
                >
                  {n}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}