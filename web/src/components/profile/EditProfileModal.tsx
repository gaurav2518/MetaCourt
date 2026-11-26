"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import {
  User,
  Mail,
  ShieldCheck,
  Award,
  CheckCircle2,
  AlertCircle,
  Save,
  Check,
} from "lucide-react";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function EditProfileModal({ isOpen, onClose }: EditProfileModalProps) {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user?.name, isOpen]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("Full name must be at least 2 characters long.");
      return;
    }

    try {
      setIsSaving(true);
      await updateProfile({ name: name.trim() });
      setSuccessMessage("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMessage("");
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Account & Profile Settings">
      <form onSubmit={handleSave} className="space-y-5">
        {/* User Identity Header Card */}
        <div className="flex items-center gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[#a78bfa] font-display text-lg font-bold text-white shadow-md">
            {(user?.name?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="truncate font-display text-base font-bold text-[var(--color-text-primary)]">
              {user?.name || "MetaCourt Member"}
            </h4>
            <p className="truncate font-mono text-xs text-[var(--color-text-muted)]">
              {user?.email}
            </p>
          </div>
          <span className="rounded-full bg-[var(--color-accent-glow)] px-2.5 py-1 text-xs font-semibold capitalize text-[var(--color-accent-primary)]">
            {user?.role?.replace("_", " ")}
          </span>
        </div>

        {/* Name Input Field */}
        <div>
          <label htmlFor="edit-profile-name" className="mc-label mb-1.5 block">
            Display / Legal Name
          </label>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              id="edit-profile-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              disabled={isSaving}
              className="mc-input pl-10 pr-4 py-2.5 text-sm"
            />
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            This name appears on filed complaints, formal defense statements, and auditor logs.
          </p>
        </div>

        {/* Email Field (Read-only) */}
        <div>
          <label className="mc-label mb-1.5 block">
            Account Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="email"
              value={user?.email ?? ""}
              readOnly
              disabled
              className="mc-input pl-10 pr-4 py-2.5 text-sm bg-[var(--color-bg-primary)] opacity-75 cursor-not-allowed"
            />
          </div>
          <p className="mt-1 text-[11px] text-[var(--color-text-muted)]">
            Email is tied to your cryptographic dispute notifications and cannot be changed directly.
          </p>
        </div>

        {/* Role & Credibility Info Box */}
        <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/80 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Active Protocol Role:</span>
            <span className="font-semibold text-[var(--color-text-primary)] capitalize">
              {user?.role === "user" ? "Complainant / Respondent" : user?.role}
            </span>
          </div>
          {user?.role === "juror" && user?.reputationScore !== undefined && (
            <div className="flex items-center justify-between">
              <span className="text-[var(--color-text-muted)]">Juror Reputation Score:</span>
              <span className="font-mono font-bold text-[var(--color-gold)]">
                {user.reputationScore} pts ({user.jurorLevel ?? "Junior"} Tier)
              </span>
            </div>
          )}
          <div className="flex items-center justify-between">
            <span className="text-[var(--color-text-muted)]">Dispute Ledger Status:</span>
            <span className="flex items-center gap-1 text-[var(--color-success)] font-medium">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified & Active
            </span>
          </div>
        </div>

        {/* Feedback Messages */}
        {successMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-[rgba(16,185,129,0.3)] bg-[rgba(16,185,129,0.1)] p-3 text-xs text-[var(--color-success)]">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] p-3 text-xs text-[var(--color-danger)]">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isSaving} disabled={isSaving || !name.trim()}>
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
