"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { X } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
};

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const ROLE_LABELS: Record<RoleValue, string> = {
  [ROLES.USER]: "User",
  [ROLES.JUROR]: "Juror",
  [ROLES.ADMIN]: "Admin",
};

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const normalizedRole = (user?.role === "complainant" ? ROLES.USER : user?.role) as RoleValue | undefined;

  const navItems = useMemo(() => {
    if (!user) return [];

    const role = normalizedRole as RoleValue;

    if (role === ROLES.ADMIN) {
      return [
        { label: "All Complaints", href: "/admin/complaints" },
        { label: "Users", href: "/admin/users" },
        { label: "Juror Applications", href: "/admin/jurors" },
        { label: "Analytics", href: "/admin" },
      ];
    }

    // Always show the two base links for complainants/users and jurors.
    const items: NavItem[] = [
      { label: "My Cases", href: "/complainant" },
      { label: "Cases Against Me", href: "/opposite-party" },
    ];

    if (role === ROLES.JUROR) {
      items.push(
        { label: "Assigned Cases", href: "/juror" },
        { label: "Voting History", href: "/juror/history" },
        { label: "Reputation", href: "/juror/reputation" }
      );
    } else if (role === ROLES.USER) {
      // Regular users can apply to be jurors
      items.push({ label: "Apply for Juror", href: "/complainant/apply-juror" });
    }

    return items;
  }, [user?.role, normalizedRole]);

  const roleLabel = normalizedRole
    ? ROLE_LABELS[normalizedRole as RoleValue] ?? normalizedRole.replace("_", " ")
    : "Guest";

  const hasNavItems = navItems.length > 0;

  return (
    <aside className="flex h-full w-72 flex-col border-r border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-primary)]">
      <div className="border-b border-[var(--color-border)] px-6 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-11 w-11 overflow-hidden rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)]">
              <Image
                src="/metacourt-logo.png"
                alt="MetaCourt"
                fill
                sizes="44px"
                className="object-contain"
              />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">MetaCourt</h1>
              <p className="text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                {roleLabel}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-2 text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)] lg:hidden"
              aria-label="Close sidebar menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-4 text-sm leading-6 text-[var(--color-text-secondary)]">
          Navigate your workspace by role and keep the active section visible at a glance.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
          Navigation
        </p>

        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center rounded-lg px-4 py-2.5 text-sm font-medium transition duration-100 ${
                active
                  ? "border-l-2 border-[var(--color-accent-primary)] bg-[var(--color-accent-glow)] text-[var(--color-accent-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-elevated)] hover:text-[var(--color-text-primary)]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        {!hasNavItems && (
          <div className="mx-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-4 text-sm text-[var(--color-text-secondary)]">
            No navigation items available for this role yet.
          </div>
        )}
      </nav>

      <div className="border-t border-[var(--color-border)] p-4">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] p-4">
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            {user?.name ?? "Unknown User"}
          </p>
          <p className="mt-1 text-xs text-[var(--color-text-muted)]">
            {user?.email ?? "No email available"}
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-4 inline-flex w-full items-center justify-center rounded-lg border border-[var(--color-border)] bg-transparent px-4 py-2.5 text-sm font-medium text-[var(--color-text-primary)] transition duration-150 hover:bg-[var(--color-bg-elevated)]"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
