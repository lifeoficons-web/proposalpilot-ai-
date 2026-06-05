"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sparkles,
  Copy,
  RefreshCw,
  Save,
  Share2,
  Check,
  X,
  Loader2,
  ChevronDown,
  ChevronUp,
  Star,
  Target,
  TrendingUp,
  MessageSquare,
  Plus,
} from "lucide-react"

type Skill = string

type ScoreCategory = {
  label: string
  value: number
  max: number
}

const defaultScores: ScoreCategory[] = [
  { label: "Relevance", value: 0, max: 10 },
  { label: "Clarity", value: 0, max: 10 },
  { label: "Personalization", value: 0, max: 10 },
  { label: "Hook Strength", value: 0, max: 10 },
]

export default function GeneratorPage() {
  const [jobDescription, setJobDescription] = useState("")
  const [skillInput, setSkillInput] = useState("")
  const [skills, setSkills] = useState<Skill[]>(["React", "Next.js", "TypeScript"])
  const [experience, setExperience] = useState("intermediate")
  const [tone, setTone] = useState("professional")
  const [additionalNotes, setAdditionalNotes] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [proposal, setProposal] = useState<null | {
    opening: string
    body: string
    cta: string
    followUp: string
    scores: ScoreCategory[]
    overallScore: number
  }>(null)
  const [showFollowUp, setShowFollowUp] = useState(false)
  const [copied, setCopied] = useState(false)

  const addSkill = () => {
    const trimmed = skillInput.trim()
    if (trimmed && !skills.includes(trimmed)) {
      setSkills([...skills, trimmed])
      setSkillInput("")
    }
  }

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill()
    }
  }

  const generateProposal = async () => {
    if (!jobDescription.trim()) return
    setIsGenerating(true)

    try {
      const res = await fetch("/api/proposals/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          experienceLevel: experience,
          skills,
          tone,
          portfolioLinks: [],
        }),
      })

      if (!res.ok) {
        const err = await res.json()
        if (res.status === 403 && err.limit) {
          alert(`Usage limit reached (${err.usage}/${err.limit}). Upgrade to Pro for unlimited proposals.`)
        } else {
          alert(err.error || "Failed to generate proposal")
        }
        setIsGenerating(false)
        return
      }

      const data = await res.json()

      const generatedScores: ScoreCategory[] = [
        { label: "Relevance", value: Math.round((data.scoreBreakdown?.relevance || 80) / 10), max: 10 },
        { label: "Clarity", value: Math.round((data.scoreBreakdown?.clarity || 80) / 10), max: 10 },
        { label: "Personalization", value: Math.round((data.scoreBreakdown?.personalization || 80) / 10), max: 10 },
        { label: "Hook Strength", value: Math.round((data.scoreBreakdown?.hookStrength || 80) / 10), max: 10 },
      ]

      const overall = generatedScores.reduce((acc, s) => acc + s.value, 0) / generatedScores.length

      setProposal({
        opening: data.opening || "Personalized proposal ready!",
        body: data.body || "",
        cta: data.callToAction || "",
        followUp: data.followUpMessage || "",
        scores: generatedScores,
        overallScore: Math.round(overall * 10) / 10,
      })
    } catch (error) {
      console.error("Generation failed:", error)
      alert("Failed to generate proposal. Please try again.")
    }

    setIsGenerating(false)
  }

  const copyProposal = () => {
    if (!proposal) return
    const text = `${proposal.opening}\n\n${proposal.body}\n\n${proposal.cta}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const scoreColor = (value: number) => {
    if (value >= 8) return "text-success"
    if (value >= 5) return "text-warning"
    return "text-destructive"
  }

  const scoreBgColor = (value: number) => {
    if (value >= 8) return "bg-success"
    if (value >= 5) return "bg-warning"
    return "bg-destructive"
  }

  const barColor = (value: number) => {
    if (value >= 8) return "bg-success"
    if (value >= 5) return "bg-warning"
    return "bg-destructive"
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="mx-auto max-w-6xl">
        {/* Hero Section */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Generate Your Winning Proposal
          </h1>
          <p className="mt-2 text-muted-foreground max-w-2xl mx-auto">
            Paste a job description, add your skills, and let AI craft a personalized proposal that lands interviews.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT: Input Form */}
          <div className="space-y-6">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-accent" />
                Job Details
              </h2>

              <div className="space-y-5">
                {/* Job URL */}
                <div className="space-y-2">
                  <Label htmlFor="job-url">Job URL (optional)</Label>
                  <Input
                    id="job-url"
                    type="url"
                    placeholder="https://www.upwork.com/jobs/~..."
                  />
                </div>

                {/* Job Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description *</Label>
                  <textarea
                    id="description"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="flex min-h-[160px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                    placeholder="Paste the Upwork job description here..."
                  />
                </div>

                {/* Skills */}
                <div className="space-y-2">
                  <Label>Your Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 rounded-md bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent"
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="text-accent/60 hover:text-accent"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Add a skill..."
                      className="flex-1"
                    />
                    <Button variant="outline" size="icon" onClick={addSkill} type="button">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Experience + Tone */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="experience">Experience Level</Label>
                    <select
                      id="experience"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="entry">Entry</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="expert">Expert</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tone">Tone</Label>
                    <select
                      id="tone"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      className="flex h-9 w-full rounded-lg border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      <option value="professional">Professional</option>
                      <option value="friendly">Friendly</option>
                      <option value="enthusiastic">Enthusiastic</option>
                      <option value="direct">Direct</option>
                    </select>
                  </div>
                </div>

                {/* Additional Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (optional)</Label>
                  <textarea
                    id="notes"
                    value={additionalNotes}
                    onChange={(e) => setAdditionalNotes(e.target.value)}
                    className="flex min-h-[80px] w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring resize-y"
                    placeholder="Any specific points or experience to highlight..."
                  />
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  onClick={generateProposal}
                  disabled={!jobDescription.trim() || isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Crafting your proposal...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Proposal
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  7 / 10 free proposals remaining this month
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: AI Output */}
          <div className="space-y-6">
            {!proposal && !isGenerating && (
              <div className="rounded-xl border bg-card p-10 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 mb-4">
                  <Sparkles className="h-8 w-8 text-accent" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Your proposal will appear here</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Fill in the job details on the left and click &quot;Generate Proposal&quot; to see your personalized, AI-crafted proposal.
                </p>
              </div>
            )}

            {isGenerating && (
              <div className="rounded-xl border bg-card p-10 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-accent mb-4" />
                <h3 className="text-lg font-semibold mb-2">AI is crafting your proposal</h3>
                <p className="text-sm text-muted-foreground">
                  Analyzing the job description and tailoring content to your skills...
                </p>
              </div>
            )}

            {proposal && !isGenerating && (
              <div className="rounded-xl border bg-card shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-6 py-4">
                  <h2 className="text-lg font-semibold">Your Proposal</h2>
                  <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                      proposal.overallScore >= 8
                        ? "bg-success/10 text-success"
                        : proposal.overallScore >= 5
                        ? "bg-warning/10 text-warning"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    <Star className="h-4 w-4" />
                    {proposal.overallScore}/10
                  </div>
                </div>

                <div className="p-6 space-y-5">
                  {/* Opening */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Opening
                    </p>
                    <p className="text-lg font-semibold text-accent leading-relaxed">
                      &ldquo;{proposal.opening}&rdquo;
                    </p>
                  </div>

                  {/* Body */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Body
                    </p>
                    <div className="text-sm leading-relaxed whitespace-pre-line text-foreground/90">
                      {proposal.body}
                    </div>
                  </div>

                  {/* CTA */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                      Call to Action
                    </p>
                    <p className="text-sm font-medium bg-accent/5 rounded-lg p-3 border border-accent/10">
                      {proposal.cta}
                    </p>
                  </div>

                  {/* Follow-up Message */}
                  <div>
                    <button
                      onClick={() => setShowFollowUp(!showFollowUp)}
                      className="flex items-center gap-2 text-sm font-medium text-accent hover:text-accent/80"
                    >
                      <MessageSquare className="h-4 w-4" />
                      Follow-up message suggestion
                      {showFollowUp ? (
                        <ChevronUp className="h-3 w-3" />
                      ) : (
                        <ChevronDown className="h-3 w-3" />
                      )}
                    </button>
                    {showFollowUp && (
                      <div className="mt-2 rounded-lg bg-muted/50 p-4 text-sm text-muted-foreground leading-relaxed">
                        {proposal.followUp}
                      </div>
                    )}
                  </div>

                  {/* Action Bar */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t">
                    <Button variant="default" size="sm" onClick={copyProposal}>
                      {copied ? (
                        <>
                          <Check className="mr-1.5 h-3.5 w-3.5" />
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-1.5 h-3.5 w-3.5" />
                          Copy
                        </>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" onClick={generateProposal}>
                      <RefreshCw className="mr-1.5 h-3.5 w-3.5" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm">
                      <Save className="mr-1.5 h-3.5 w-3.5" />
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <Share2 className="mr-1.5 h-3.5 w-3.5" />
                      Share
                    </Button>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="border-t bg-muted/20 px-6 py-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Score Breakdown
                  </p>
                  <div className="space-y-3">
                    {proposal.scores.map((score) => (
                      <div key={score.label} className="flex items-center gap-3">
                        <span className="w-28 text-xs text-muted-foreground">{score.label}</span>
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${barColor(score.value)}`}
                            style={{ width: `${(score.value / score.max) * 100}%` }}
                          />
                        </div>
                        <span className={`text-xs font-semibold w-7 text-right ${scoreColor(score.value)}`}>
                          {score.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bottom Action */}
                <div className="flex items-center justify-between border-t px-6 py-4">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Target className="h-3.5 w-3.5 text-accent" />
                    <span>Client pain points identified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <TrendingUp className="h-3.5 w-3.5 text-success" />
                    <span>Strong proposal score</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}