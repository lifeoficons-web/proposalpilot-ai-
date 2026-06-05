"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Search,
  Filter,
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
  Star,
  FileText,
} from "lucide-react"

type Proposal = {
  id: string
  jobDescription: string
  score: number
  createdAt: string
  experienceLevel?: string
  skills?: string
  tone?: string
  generatedProposal?: string
}

export default function HistoryPage() {
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const limit = 10

  async function fetchProposals() {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sort })
      if (search) params.set("search", search)
      if (filter) params.set("filter", filter)
      const res = await fetch(`/api/proposals/history?${params}`)
      if (res.ok) {
        const data = await res.json()
        setProposals(data.proposals || data || [])
        setTotal(data.total || (Array.isArray(data) ? data.length : proposals.length))
      }
    } catch (e) {
      console.error("Failed to fetch history", e)
    }
    setLoading(false)
  }

  useEffect(() => { fetchProposals() }, [page, sort, filter])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchProposals()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this proposal?")) return
    try {
      const res = await fetch(`/api/proposals/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProposals((prev) => prev.filter((p) => p.id !== id))
        setTotal((prev) => prev - 1)
      }
    } catch (e) {
      console.error("Delete failed", e)
    }
  }

  const handleCopy = async (p: Proposal) => {
    const text = p.generatedProposal
      ? (() => { try { const parsed = JSON.parse(p.generatedProposal); return parsed.body || p.generatedProposal } catch { return p.generatedProposal } })()
      : p.jobDescription
    await navigator.clipboard.writeText(text)
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const totalPages = Math.max(1, Math.ceil(total / limit))

  const scoreColor = (s: number) => s >= 80 ? "text-success" : s >= 50 ? "text-warning" : "text-destructive"
  const scoreBg = (s: number) => s >= 80 ? "bg-success/10" : s >= 50 ? "bg-warning/10" : "bg-destructive/10"

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Proposal History</h1>

        {/* Search & Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search proposals..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </form>
          <select
            value={filter}
            onChange={(e) => { setFilter(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="">All Scores</option>
            <option value="high">High (80-100)</option>
            <option value="medium">Medium (50-79)</option>
            <option value="low">Low (0-49)</option>
          </select>
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1) }}
            className="h-9 rounded-lg border border-input bg-transparent px-3 text-sm"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="score_desc">Best Score</option>
            <option value="score_asc">Worst Score</option>
          </select>
        </div>

        {/* List */}
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[1,2,3,4,5].map(i => <div key={i} className="h-16 bg-muted rounded-xl" />)}
          </div>
        ) : proposals.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center text-muted-foreground">
            <FileText className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No proposals found</p>
          </div>
        ) : (
          <div className="space-y-2">
            {proposals.map((p) => (
              <div key={p.id} className="rounded-xl border bg-card shadow-sm hover:shadow-md transition-shadow">
                <div
                  className="flex items-center justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {p.jobDescription.length > 80 ? p.jobDescription.slice(0, 80) + "..." : p.jobDescription}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ml-3 ${scoreBg(p.score)} ${scoreColor(p.score)}`}>
                    <Star className="h-3 w-3" />
                    {p.score}
                  </div>
                  <div className="flex items-center gap-1 ml-3">
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleCopy(p) }} title="Copy">
                      {copiedId === p.id ? <CheckCircle2 className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); handleDelete(p.id) }} title="Delete">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                {expandedId === p.id && p.generatedProposal && (
                  <div className="border-t px-4 py-3 text-sm text-muted-foreground bg-muted/20 rounded-b-xl">
                    {(() => {
                      try {
                        const parsed = JSON.parse(p.generatedProposal)
                        return (
                          <div className="space-y-2">
                            {parsed.opening && <p className="text-accent font-medium">&ldquo;{parsed.opening}&rdquo;</p>}
                            {parsed.body && <p className="whitespace-pre-line">{parsed.body.slice(0, 300)}...</p>}
                            {parsed.painPoints && parsed.painPoints.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {parsed.painPoints.map((pp: string, i: number) => (
                                  <span key={i} className="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-xs text-accent">{pp}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      } catch {
                        return <p>{p.generatedProposal.slice(0, 300)}...</p>
                      }
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm text-muted-foreground px-4">
              Page {page} of {totalPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}