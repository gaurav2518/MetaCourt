"use client";

import { API_BASE_URL } from "@/config/api";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Scale, ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

type FieldErrors = {
  reason?: string[];
  experience?: string[];
};

export default function ApplyJurorPage() {
  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitApplication(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setMessage(null);
    setError(null);

    if (reason.trim().length < 20) {
      setFieldErrors({
        reason: ["Reason must be at least 20 characters explaining your motivation"],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/juror/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason.trim(),
          experience: experience.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(payload.errors || {});
        throw new Error(payload.message || "Failed to submit juror application");
      }

      setReason("");
      setExperience("");
      setMessage(payload.message || "Juror application submitted successfully! Administrators will review your credentials.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to submit juror application"
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <Link
            href="/complainant"
            className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] transition mb-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to My Cases</span>
          </Link>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Apply for Community Juror Standing
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Participate in decentralized dispute resolution, evaluate anonymous claims, and build your juror reputation.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-accent-primary)]/40 bg-[var(--color-accent-glow)] px-4 py-2 text-xs font-semibold text-[var(--color-accent-primary)]">
          <Scale className="h-4 w-4" />
          <span>Peer Justice Network</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Left Information & Requirements */}
        <section className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl space-y-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]">
              <Scale className="h-6 w-6" />
            </div>

            <div className="relative h-14 w-14 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1">
              <Image
                src="/Juror_Verification_Badge.png"
                alt="Juror verification badge"
                fill
                sizes="56px"
                className="object-contain"
              />
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg font-bold text-[var(--color-text-primary)]">
              How Juror Vetting Works
            </h2>
            <div className="mt-3 space-y-2.5 text-xs leading-6 text-[var(--color-text-secondary)]">
              <p>
                MetaCourt relies on thoughtful, unbiased individuals to review dispute evidence and vote honestly.
              </p>
              <p>
                Admins review each application's stated rationale, impartiality commitment, and any legal, technical, or mediation background.
              </p>
              <p>
                Once verified, you will receive random case allocations, double-blind voting permissions, and start at the Junior Juror tier (100 base reputation pts).
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.08)] p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="h-4 w-4 text-[var(--color-success)] shrink-0 mt-0.5" />
              <p className="text-xs leading-5 text-[var(--color-success)]">
                Juror identities are never revealed to complainants or respondents. Your deliberation remains 100% anonymous.
              </p>
            </div>
          </div>
        </section>

        {/* Right Application Form */}
        <form
          onSubmit={submitApplication}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl sm:p-8 space-y-5"
        >
          <div className="space-y-5">
            <Textarea
              id="reason"
              label="Why do you want to become a community juror?"
              helperText="Minimum 20 characters. Explain your commitment to fairness, objective reasoning, and community dispute resolution."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              error={fieldErrors.reason?.[0]}
              disabled={isSubmitting}
              variant="dark"
              rows={5}
            />

            <Textarea
              id="experience"
              label="Relevant experience or dispute handling background (Optional)"
              helperText="Add any professional, technical, academic, community, or arbitration experience you have."
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              error={fieldErrors.experience?.[0]}
              disabled={isSubmitting}
              variant="dark"
              rows={4}
            />
          </div>

          {message && (
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-4 text-xs text-[var(--color-success)]">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-4 text-xs text-[var(--color-danger)]">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex justify-end gap-3">
            <Link href="/complainant">
              <Button variant="secondary">Cancel</Button>
            </Link>
            <Button type="submit" isLoading={isSubmitting}>
              {isSubmitting ? "Submitting Application..." : "Submit Juror Application"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
