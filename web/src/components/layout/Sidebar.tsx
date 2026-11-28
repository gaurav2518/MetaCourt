"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo, useState, type ElementType } from "react";
import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { useDisputeNotifications } from "@/context/NotificationContext";
import EditProfileModal from "@/components/profile/EditProfileModal";
import {
  X,
  FolderKanban,
  ShieldAlert,
  Gavel,
  History,
  Award,
  Scale,
  Users,
  BarChart3,
  UserCheck,
  Activity,
  LogOut,
  ChevronRight,
  Settings,
  User,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: ElementType;
};

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LABELS: Record<RoleValue, string> = {
  [ROLES.USER]: "Complainant / Respondent",
  [ROLES.JUROR]: "Community Juror",
  [ROLES.ADMIN]: "System Administrator",
};

function isRouteActive(itemHref: string, currentPath: string): boolean {
  if (currentPath === itemHref) return true;

  if (itemHref === "/complainant") {
    return currentPath === "/complainant" || currentPath.startsWith("/complainant/cases");
  }

  if (itemHref === "/opposite-party") {
    return currentPath === "/opposite-party" || currentPath.startsWith("/opposite-party/cases");
  }

  if (itemHref === "/juror") {
    return currentPath === "/juror" || currentPath.startsWith("/juror/cases");
  }

  if (itemHref === "/admin") {
    return currentPath === "/admin";
  }

  return currentPath.startsWith(`${itemHref}/`);
}

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { unreadCount } = useDisputeNotifications();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const normalizedRole = (user?.role === "complainant" ? ROLES.USER : user?.role) as RoleValue | undefined;

  const navItems = useMemo<NavItem[]>(() => {
    if (!user) return [];

    const role = normalizedRole as RoleValue;

    if (role === ROLES.ADMIN) {
      return [
        { label: "All Complaints", href: "/admin/complaints", icon: FolderKanban },
        { label: "Users Directory", href: "/admin/users", icon: Users },
        { label: "Juror Applications", href: "/admin/jurors", icon: UserCheck },
        { label: "Platform Analytics", href: "/admin", icon: BarChart3 },
      ];
    }

    // Base links for regular users and jurors
    const items: NavItem[] = [
      { label: "My Cases", href: "/complainant", icon: FolderKanban },
      { label: "Cases Against Me", href: "/opposite-party", icon: ShieldAlert },
    ];

    if (role === ROLES.JUROR) {
      items.push(
        { label: "Assigned Cases", href: "/juror", icon: Gavel },
        { label: "Voting History", href: "/juror/history", icon: History },
        { label: "Juror Reputation", href: "/juror/reputation", icon: Award }
      );
    } else if (role === ROLES.USER) {
      items.push({ label: "Juror Application", href: "/complainant/apply-juror", icon: Scale });
    }

    return items;
  }, [user?.role, normalizedRole]);

  const roleLabel = normalizedRole
    ? ROLE_LABELS[normalizedRole as RoleValue] ?? normalizedRole.replace("_", " ")
    : "Guest";

  return (
    <>
      <aside className="flex h-full w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
        {/* Brand Header */}
        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3 transition">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-1 shadow-inner transition group-hover:border-[var(--color-accent-primary)]">
                <Image
                  src="/metacourt-logo.png"
                  alt="MetaCourt"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <div>
                <h1 className="font-display text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
                  MetaCourt
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-gold)]">
                  Decentralized Justice
                </p>
              </div>
            </Link>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-2 text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)] lg:hidden"
                aria-label="Close sidebar menu"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Role Pill */}
          <div className="mt-4 flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)]/80 px-3 py-2 text-xs">
            <span className="text-[var(--color-text-muted)]">Active Role</span>
            <span className="font-medium text-[var(--color-accent-primary)]">
              {roleLabel}
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Workspace Navigation
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isRouteActive(item.href, pathname);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition duration-150 ${
                  active
                    ? "border border-[var(--color-accent-primary)]/30 bg-[var(--color-accent-glow)] font-semibold text-[var(--color-accent-primary)] shadow-[0_0_15px_rgba(124,58,237,0.15)]"
                    : "border border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition ${
                      active
                        ? "text-[var(--color-accent-primary)]"
                        : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)]"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.href === "/opposite-party" && unreadCount > 0 && (
                    <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[var(--color-danger)] px-1.5 text-[10px] font-bold text-white shadow-sm animate-pulse">
                      {unreadCount}
                    </span>
                  )}
                  {active && (
                    <ChevronRight className="h-3.5 w-3.5 text-[var(--color-accent-primary)]" />
                  )}
                </div>
              </Link>
            );
          })}

          {navItems.length === 0 && (
            <div className="mx-2 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-4 text-xs text-[var(--color-text-secondary)]">
              No active navigation items.
            </div>
          )}
        </nav>

        {/* Network & User Footer */}
        <div className="border-t border-[var(--color-border)] p-4 space-y-3">
          {/* Blockchain Network Status */}
          <div className="flex items-center justify-between rounded-lg border border-[var(--color-border-subtle)] bg-[var(--color-bg-primary)] px-3 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--color-success)] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--color-success)]" />
              </span>
              <span className="text-[var(--color-text-muted)]">Ethereum Sepolia</span>
            </div>
            <span className="text-[10px] font-mono text-[var(--color-success)]">Connected</span>
          </div>

          {/* User Profile Card */}
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-3 space-y-3">
            <button
              type="button"
              onClick={() => setIsProfileModalOpen(true)}
              className="flex w-full items-center gap-3 text-left transition hover:opacity-90 group"
              title="Click to view & edit your profile details"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-accent-primary)] to-[#a78bfa] font-display text-sm font-bold text-white shadow-sm">
                {(user?.name?.[0] ?? "U").toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[var(--color-text-primary)] group-hover:text-[var(--color-accent-primary)] transition">
                  {user?.name ?? "Logged In User"}
                </p>
                <p className="truncate text-[10px] text-[var(--color-text-muted)]">
                  {user?.email ?? "MetaCourt Member"}
                </p>
              </div>
              <Settings className="h-3.5 w-3.5 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-primary)] transition shrink-0" />
            </button>

            <div className="flex gap-2 pt-1 border-t border-[var(--color-border-subtle)]">
              <button
                type="button"
                onClick={() => setIsProfileModalOpen(true)}
                className="flex-1 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-secondary)] py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              >
                Edit Profile
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center justify-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-[11px] font-medium text-[var(--color-text-secondary)] transition hover:bg-[rgba(239,68,68,0.12)] hover:border-[rgba(239,68,68,0.3)] hover:text-[var(--color-danger)]"
              >
                <LogOut className="h-3 w-3" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
}
