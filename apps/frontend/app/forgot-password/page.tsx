"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Mail, ArrowLeft, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    // Simulate API call — actual backend endpoint can be wired later
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setSent(true);
    setLoading(false);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back link */}
        <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>

        {sent ? (
          /* Success state */
          <div className="text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-5 flex items-center justify-center" style={{ backgroundColor: "hsl(var(--accent) / 0.1)" }}>
              <CheckCircle className="w-8 h-8" style={{ color: "hsl(var(--accent))" }} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight mb-2">Check Your Email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <span className="font-medium text-foreground">{email}</span>. Please check your inbox and follow the instructions.
            </p>
            <p className="text-sm text-muted-foreground mb-6">Didn't receive the email? Check your spam folder or try again.</p>
            <Button variant="outline" onClick={() => { setSent(false); setEmail(""); }}>
              Try Another Email
            </Button>
          </div>
        ) : (
          /* Form state */
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold tracking-tight mb-2">Forgot Password?</h1>
              <p className="text-muted-foreground">
                Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    id="forgot-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent/40 transition-all"
                    autoFocus
                  />
                </div>
                {error && <p className="text-sm mt-1.5" style={{ color: "hsl(var(--destructive))" }}>{error}</p>}
              </div>

              <Button type="submit" className="w-full h-11 text-white font-semibold" style={{ backgroundColor: "hsl(var(--accent))" }} disabled={loading}>
                {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</> : "Send Reset Link"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              Remember your password?{" "}
              <Link href="/login" className="font-medium hover:underline" style={{ color: "hsl(var(--accent))" }}>Log in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
