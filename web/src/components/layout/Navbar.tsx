"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import EditProfileModal from "@/components/profile/EditProfileModal";
import {
  Menu,
  Scale,
  ArrowRight,
  ChevronDown,
  User,
  LogOut,
  ShieldCheck,
  Award,
  Settings,
  ExternalLink,
} from "lucide-react";

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LABELS: Record<RoleValue, string> = {
  [ROLES.USER]: "Complainant / Respondent",
  [ROLES.JUROR]: "Community Juror",
  [ROLES.ADMIN]: "System Administrator",
};

interface NavbarProps {
  onToggleSidebar?: () => void;
}

export default function Navbar({ onToggleSidebar }: NavbarProps) {
  const { user, logout } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const roleLabel = user?.role
    ? ROLE_LABELS[user.role as RoleValue] ?? user.role.replace("_", " ")
    : "Guest";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-bg-secondary)]/95 px-5 py-3.5 text-[var(--color-text-primary)] backdrop-blur-xl sm:px-8">
        {user ? (
          <>
            {/* Left Context & Greeting */}
            <div className="flex items-center gap-3">
              {onToggleSidebar && (
                <button
                  type="button"
                  onClick={onToggleSidebar}
                  className="mr-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-2 text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)] lg:hidden"
                  aria-label="Toggle navigation menu"
                >
                  <Menu className="h-5 w-5" />
                </button>
              )}
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                    MetaCourt Protocol
                  </span>
                  <span className="hidden h-1 w-1 rounded-full bg-[var(--color-border)] sm:inline-block" />
                  <span className="hidden text-xs text-[var(--color-text-muted)] sm:inline-block">
                    {roleLabel}
                  </span>
                </div>
                <h2 className="font-display text-base font-bold tracking-tight text-[var(--color-text-primary)] sm:text-lg">
                  Welcome back{user.name ? `, ${user.name}` : ""}
                </h2>
              </div>
            </div>

            {/* Right Spaced Action Suite */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Network Pill */}
              <div className="hidden items-center gap-2 rounded-full border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs md:flex">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
                </span>
                <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">
                  Sepolia Testnet
                </span>
              </div>

              {/* Public Verification Shortcut */}
              <Link
                href="/case"
                className="hidden items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3.5 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent-primary)] hover:text-[var(--color-text-primary)] sm:inline-flex"
              >
                <Scale className="h-3.5 w-3.5 text-[var(--color-gold)]" />
                <span>Verify Case</span>
              </Link>

              {/* Elegant Vertical Divider */}
              <div className="hidden h-6 w-px bg-[var(--color-border)] sm:block" />

              {/* User Profile Dropdown Pill */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen((prev) => !prev)}
                  className="group flex items-center gap-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1.5 pr-3 text-left transition hover:border-[var(--color-accent-primary)] hover:bg-[var(--color-bg-elevated)]"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent-primary)] to-[#a78bfa] font-display text-xs font-bold text-white shadow-sm">
                    {(user.name?.[0] ?? "U").toUpperCase()}
                  </div>
                  <div className="hidden text-left sm:block">
                    <p className="max-w-[120px] truncate text-xs font-semibold text-[var(--color-text-primary)] leading-tight">
                      {user.name || "Member"}
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] capitalize">
                      {user.role === "user" ? "Complainant" : user.role}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 text-[var(--color-text-muted)] transition-transform duration-200 group-hover:text-[var(--color-text-primary)] ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {/* Floating Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 origin-top-right rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 z-50">
                    {/* User Header Details */}
                    <div className="rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] p-3.5 space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-accent-primary)] to-[#a78bfa] font-display text-sm font-bold text-white shadow-sm">
                          {(user.name?.[0] ?? "U").toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-bold text-[var(--color-text-primary)]">
                            {user.name || "Anonymous Member"}
                          </p>
                          <p className="truncate font-mono text-[11px] text-[var(--color-text-muted)]">
                            {user.email}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)] text-[11px]">
                        <span className="text-[var(--color-text-muted)]">Role:</span>
                        <span className="font-semibold text-[var(--color-accent-primary)] capitalize">
                          {roleLabel}
                        </span>
                      </div>

                      {user.reputationScore !== undefined && (
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[var(--color-text-muted)]">Reputation:</span>
                          <span className="font-mono font-bold text-[var(--color-gold)]">
                            {user.reputationScore} pts
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Menu Actions */}
                    <div className="py-1.5 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          setIsProfileModalOpen(true);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                      >
                        <User className="h-4 w-4 text-[var(--color-accent-primary)]" />
                        <span>Edit Profile & Name</span>
                      </button>

                      <Link
                        href="/case"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                      >
                        <Scale className="h-4 w-4 text-[var(--color-gold)]" />
                        <span>Verify a Case On-Chain</span>
                      </Link>
                    </div>

                    {/* Sign Out Divider & Button */}
                    <div className="pt-1 border-t border-[var(--color-border-subtle)]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsDropdownOpen(false);
                          logout();
                        }}
                        className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[var(--color-danger)] transition hover:bg-[rgba(239,68,68,0.1)]"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out of MetaCourt</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1 transition group-hover:border-[var(--color-accent-primary)]">
                <Image
                  src="/metacourt-logo.png"
                  alt="MetaCourt"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-display text-xl font-bold tracking-tight text-[var(--color-text-primary)]">
                  MetaCourt
                </span>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                  Truth On-Chain
                </p>
              </div>
            </Link>

            <div className="flex items-center gap-3 sm:gap-6">
              <Link
                href="/case"
                className="hidden text-sm font-medium text-[var(--color-text-secondary)] transition duration-150 hover:text-[var(--color-text-primary)] sm:inline-flex items-center gap-1.5"
              >
                <Scale className="h-4 w-4 text-[var(--color-gold)]" />
                Verify Case
              </Link>
              <Link
                href="/login"
                className="text-sm font-medium text-[var(--color-text-secondary)] transition duration-150 hover:text-[var(--color-text-primary)]"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 rounded-lg bg-[var(--color-accent-primary)] px-4 py-2 text-sm font-medium text-white shadow-md transition duration-150 hover:bg-[var(--color-accent-hover)]"
              >
                <span>Get Started</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </>
        )}
      </header>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
