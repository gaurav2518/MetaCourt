"use client";

import { API_BASE_URL } from "@/config/api";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Scale,
  ShieldCheck,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit3,
  X,
  Award,
  ArrowRight,
  UserCheck,
} from "lucide-react";

import Button from "@/components/ui/Button";
import Textarea from "@/components/ui/Textarea";

type FieldErrors = {
  reason?: string[];
  experience?: string[];
};

type JurorApplicationData = {
  _id?: string;
  reason: string;
  experience?: string;
  status: "pending" | "approved" | "rejected";
  reviewNote?: string | null;
  reviewedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export default function ApplyJurorPage() {
  const [existingApp, setExistingApp] = useState<JurorApplicationData | null>(null);
  const [isVerifiedJuror, setIsVerifiedJuror] = useState(false);
  const [loadingApp, setLoadingApp] = useState(true);

  const [reason, setReason] = useState("");
  const [experience, setExperience] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  async function loadApplicationStatus() {
    try {
      setLoadingApp(true);
      const res = await fetch(`${API_BASE_URL}/api/juror/apply`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setExistingApp(data.application || null);
        setIsVerifiedJuror(Boolean(data.isVerifiedJuror || data.role === "juror"));
        if (data.application) {
          setReason(data.application.reason || "");
          setExperience(data.application.experience || "");
        }
      }
    } catch (err) {
      console.error("Failed to load juror application status:", err);
    } finally {
      setLoadingApp(false);
    }
  }

  useEffect(() => {
    void loadApplicationStatus();
  }, []);

  async function handleSaveApplication(event: React.FormEvent<HTMLFormElement>) {
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
      const isUpdating = Boolean(existingApp && existingApp.status === "pending" && isEditing);
      const method = isUpdating ? "PATCH" : "POST";

      const response = await fetch(`${API_BASE_URL}/api/juror/apply`, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          reason: reason.trim(),
          experience: experience.trim(),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setFieldErrors(payload.errors || {});
        throw new Error(payload.message || "Failed to process juror application");
      }

      setMessage(
        isUpdating
          ? "Your application was updated successfully! Administrators will review your latest changes."
          : "Juror application submitted successfully! Administrators will review your credentials."
      );

      setIsEditing(false);
      await loadApplicationStatus();
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
            Community Juror Standing & Applications
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
                Platform administrators review each application in the <strong>Admin Jurors Center</strong>, evaluating impartiality commitment and domain background.
              </p>
              <p>
                Once verified, you receive blind case assignments, voting permissions, and start at the Junior Juror tier with 100 base reputation points.
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

        {/* Right Section: Existing Application Card OR Form */}
        <div>
          {loadingApp ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-8 space-y-3">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--color-accent-primary)] border-t-transparent" />
              <p className="text-sm text-[var(--color-text-secondary)]">Checking your juror application status...</p>
            </div>
          ) : isVerifiedJuror ? (
            /* Verified Juror Active State */
            <div className="rounded-2xl border border-[rgba(16,185,129,0.4)] bg-[rgba(16,185,129,0.08)] p-8 text-center backdrop-blur-xl space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(16,185,129,0.2)] text-[var(--color-success)] shadow-md">
                <Award className="h-8 w-8" />
              </div>
              <h2 className="font-display text-2xl font-bold text-[var(--color-text-primary)]">
                You are a Verified Community Juror
              </h2>
              <p className="max-w-md mx-auto text-xs leading-relaxed text-[var(--color-text-secondary)]">
                Your credentials have been approved by the platform administrators. You are authorized to deliberate on dispute dockets and cast consensus votes.
              </p>
              <div className="pt-2">
                <Link
                  href="/juror"
                  className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-6 py-3 text-xs font-semibold text-white shadow-lg transition hover:bg-[var(--color-accent-hover)]"
                >
                  <span>Open Juror Workspace</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : existingApp && existingApp.status === "pending" && !isEditing ? (
            /* Pending Application View Card */
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 p-6 backdrop-blur-xl sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border-subtle)] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2 w-2 rounded-full bg-[var(--color-gold)] animate-pulse" />
                    <span className="font-display text-base font-bold text-[var(--color-text-primary)]">
                      Application Under Review
                    </span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Submitted on {new Date(existingApp.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[rgba(245,158,11,0.3)] bg-[rgba(245,158,11,0.12)] px-3 py-1 text-xs font-semibold text-[var(--color-gold)]">
                  <Clock className="h-3.5 w-3.5" />
                  <span>Pending Admin Approval</span>
                </div>
              </div>

              {/* Notice Banner */}
              <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                <p>
                  <strong>Where is this showing?</strong> Your submission is currently listed in the{" "}
                  <span className="font-semibold text-[var(--color-accent-primary)]">Admin Jurors Directory</span> for administrator review and verification. You may update your statement below at any time while it remains pending.
                </p>
              </div>

              {/* Submitted Content Display */}
              <div className="space-y-4">
                <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 space-y-1.5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                    Motivation & Impartiality Statement
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap">
                    {existingApp.reason}
                  </p>
                </div>

                {existingApp.experience && (
                  <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-4 space-y-1.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Relevant Background & Experience
                    </p>
                    <p className="text-xs leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap">
                      {existingApp.experience}
                    </p>
                  </div>
                )}
              </div>

              {message && (
                <div className="flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-4 text-xs text-[var(--color-success)]">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
                <Link href="/complainant">
                  <Button variant="secondary">Back to My Cases</Button>
                </Link>
                <Button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  <span>Edit / Update Application</span>
                </Button>
              </div>
            </div>
          ) : (
            /* Application Form (For new submission, edit mode, or rejected revision) */
            <form
              onSubmit={handleSaveApplication}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl sm:p-8 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] pb-3">
                <h3 className="font-display text-base font-bold text-[var(--color-text-primary)]">
                  {isEditing ? "Update Your Juror Application" : "Juror Application Form"}
                </h3>
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="inline-flex items-center gap-1 text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Cancel Edit</span>
                  </button>
                )}
              </div>

              {existingApp?.status === "rejected" && (
                <div className="rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-4 text-xs text-[var(--color-danger)] space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4" />
                    Previous Application Was Not Approved
                  </p>
                  {existingApp.reviewNote && (
                    <p className="text-[11px] text-[var(--color-text-secondary)]">
                      Admin Note: {existingApp.reviewNote}
                    </p>
                  )}
                  <p className="text-[11px] text-[var(--color-text-secondary)] pt-1">
                    You can revise your statement below and resubmit for administrator reconsideration.
                  </p>
                </div>
              )}

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
                {isEditing ? (
                  <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                ) : (
                  <Link href="/complainant">
                    <Button variant="secondary">Cancel</Button>
                  </Link>
                )}
                <Button type="submit" isLoading={isSubmitting}>
                  {isSubmitting
                    ? isEditing
                      ? "Saving Updates..."
                      : "Submitting Application..."
                    : isEditing
                    ? "Save Updated Application"
                    : "Submit Juror Application"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
