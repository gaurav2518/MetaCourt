"use client";

import Link from "next/link";
import { useState } from "react";
import { Scale, ShieldCheck } from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
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
        reason: ["Reason must be at least 20 characters"],
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/juror/apply", {
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
      setMessage(payload.message || "Juror application submitted successfully");
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
      <PageHeader
        title="Apply for Juror"
        subtitle="Submit your interest to help review cases and participate in MetaCourt decisions."
        action={
          <Link href="/complainant">
            <Button variant="secondary">Back to My Cases</Button>
          </Link>
        }
      />

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
            <Scale className="h-6 w-6" />
          </div>

          <h2 className="mt-5 text-lg font-semibold text-white">
            What admins review
          </h2>
          <div className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
            <p>
              Admins review your reason, relevant experience, and account standing before approving juror access.
            </p>
            <p>
              Approved jurors can receive assigned cases, cast votes, and build reputation through consistent participation.
            </p>
          </div>

          <div className="mt-6 rounded-2xl border border-emerald-400/15 bg-emerald-400/10 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <p className="text-sm leading-6 text-emerald-100">
                Juror permissions are only activated after admin verification.
              </p>
            </div>
          </div>
        </section>

        <form
          onSubmit={submitApplication}
          className="rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="space-y-5">
            <Textarea
              id="reason"
              label="Why do you want to become a juror?"
              helperText="Minimum 20 characters. Explain your motivation and how you will evaluate disputes fairly."
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              error={fieldErrors.reason?.[0]}
              disabled={isSubmitting}
              variant="dark"
              rows={5}
            />

            <Textarea
              id="experience"
              label="Relevant experience"
              helperText="Optional. Add professional, academic, community, or dispute-resolution experience."
              value={experience}
              onChange={(event) => setExperience(event.target.value)}
              error={fieldErrors.experience?.[0]}
              disabled={isSubmitting}
              variant="dark"
              rows={5}
            />

            {message && (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3 border-t border-white/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-400">
                You can only have one pending juror application at a time.
              </p>
              <Button type="submit" isLoading={isSubmitting}>
                Submit Application
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
