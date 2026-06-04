"use client"

import { Button } from "@/components/ui/button"
import { Upload, ArrowLeft, Building2, AlertCircle, CheckCircle2, Info } from "lucide-react"
import { useState } from "react"

export default function BankTransferUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="container py-10">
        <div className="mx-auto max-w-lg text-center">
          <div className="rounded-xl border bg-card p-10 shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/10 mb-6">
              <CheckCircle2 className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Proof of Payment Submitted</h2>
            <p className="text-muted-foreground mb-6">
              Thank you! We&apos;ve received your bank transfer proof. Our team will verify it within
              1-2 business days and your plan will be upgraded.
            </p>
            <div className="rounded-lg bg-muted/50 p-4 text-left text-sm space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reference</span>
                <span className="font-medium">BT-2025-06-04-001</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Plan</span>
                <span className="font-medium">Pro — $19/month</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className="inline-flex items-center gap-1 text-warning">
                  <AlertCircle className="h-3 w-3" />
                  Pending Verification
                </span>
              </div>
            </div>
            <Button>Back to Dashboard</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <a href="/billing" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </a>

        <div className="rounded-xl border bg-card shadow-sm">
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Building2 className="h-6 w-6 text-accent" />
              <h1 className="text-2xl font-bold">Bank Transfer Payment</h1>
            </div>
            <p className="text-muted-foreground mb-8">
              Submit your wire transfer or bank deposit proof to upgrade your plan.
            </p>

            {/* Bank Details */}
            <div className="rounded-lg border bg-muted/30 p-5 mb-8">
              <h3 className="font-semibold text-sm mb-3">Our Bank Account Details</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Bank</span>
                  <p className="font-medium">First National Bank</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account Name</span>
                  <p className="font-medium">ProposalPilot AI Inc.</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Account Number</span>
                  <p className="font-medium">1234-5678-9012-3456</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Routing Number</span>
                  <p className="font-medium">021000021</p>
                </div>
                <div>
                  <span className="text-muted-foreground">SWIFT/BIC</span>
                  <p className="font-medium">FNBCUS44</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Reference</span>
                  <p className="font-medium text-accent">
                    Use your email: john@example.com
                  </p>
                </div>
              </div>
            </div>

            {/* Amount */}
            <div className="rounded-lg border p-5 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Amount to pay</p>
                  <p className="text-2xl font-bold">$19.00</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Plan</p>
                  <p className="font-medium">Pro — Monthly</p>
                </div>
              </div>
            </div>

            {/* Upload */}
            <div className="mb-8">
              <label className="block text-sm font-medium mb-2">
                Upload Proof of Payment
              </label>
              <div
                className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors hover:border-accent/50 cursor-pointer"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Upload className="h-8 w-8 text-muted-foreground mb-3" />
                <p className="text-sm font-medium">
                  {file ? file.name : "Click to upload receipt or screenshot"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PDF, PNG, or JPG (max 5MB)
                </p>
                <input
                  id="file-upload"
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files?.[0]) setFile(e.target.files[0])
                  }}
                />
              </div>
              {file && (
                <p className="mt-2 text-xs text-success flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB) selected
                </p>
              )}
            </div>

            {/* Info */}
            <div className="flex items-start gap-3 rounded-lg bg-accent/5 p-4 mb-6">
              <Info className="h-5 w-5 shrink-0 text-accent mt-0.5" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">What happens next?</p>
                <p>
                  After submitting, our team will verify your payment within 1-2 business days.
                  You&apos;ll receive a confirmation email once your Pro plan is activated.
                </p>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              disabled={!file}
              onClick={handleSubmit}
            >
              Submit Proof of Payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}