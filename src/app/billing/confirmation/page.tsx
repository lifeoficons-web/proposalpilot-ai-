"use client"

import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, XCircle, ArrowRight, Home, RefreshCw } from "lucide-react"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get("status") || "success"
  const isSuccess = status === "success"

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-lg text-center">
        <div className="rounded-xl border bg-card p-10 shadow-sm">
          {/* Icon */}
          <div
            className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full mb-6 ${
              isSuccess ? "bg-success/10" : "bg-destructive/10"
            }`}
          >
            {isSuccess ? (
              <CheckCircle2 className="h-10 w-10 text-success" />
            ) : (
              <XCircle className="h-10 w-10 text-destructive" />
            )}
          </div>

          {/* Heading */}
          <h1 className="text-2xl font-bold mb-2">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>
          <p className="text-muted-foreground mb-8">
            {isSuccess
              ? "Your Pro plan has been activated. You now have access to all premium features."
              : "We weren't able to process your payment. Please try again or use a different payment method."}
          </p>

          {/* Details Card */}
          <div className="rounded-lg bg-muted/50 p-4 text-left text-sm space-y-3 mb-8">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Plan</span>
              <span className="font-medium">Pro — Monthly</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-medium">$19.00</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Date</span>
              <span className="font-medium">{new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <span
                className={`inline-flex items-center gap-1 font-medium ${
                  isSuccess ? "text-success" : "text-destructive"
                }`}
              >
                {isSuccess ? (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                ) : (
                  <XCircle className="h-3.5 w-3.5" />
                )}
                {isSuccess ? "Completed" : "Declined"}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3">
            {isSuccess ? (
              <>
                <Button size="lg" className="w-full">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full">
                  View Subscription Details
                </Button>
              </>
            ) : (
              <>
                <Button size="lg" className="w-full">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
                <Button variant="outline" className="w-full">
                  <Home className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Need help?{" "}
                  <a href="/support" className="text-accent hover:underline">
                    Contact support
                  </a>
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}