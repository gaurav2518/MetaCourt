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
                src="/favicon_logo.png"
                alt="MetaCourt"
                fill
                sizes="44px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold tracking-tight">MetaCourt</h1>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
                {roleLabel}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 p-2 text-white transition hover:bg-white/10 lg:hidden"
              aria-label="Close sidebar menu"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <p className="mt-4 text-sm leading-6 text-slate-400">
          Navigate your workspace by role and keep the active section visible at a glance.
        </p>
      </div>

      <nav className="flex-1 px-3 py-4">
        <p className="px-3 pb-2 text-xs font-medium uppercase tracking-[0.24em] text-slate-500">
          Navigation
        </p>

        {navItems.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-1 flex items-center rounded-2xl px-4 py-3 text-sm font-medium transition ${
                active
                  ? "bg-cyan-500/15 text-cyan-200 ring-1 ring-inset ring-cyan-400/20"
                  : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          );
        })}

        {!hasNavItems && (
          <div className="mx-3 rounded-2xl border border-dashed border-white/10 bg-white/5 px-4 py-4 text-sm text-slate-400">
            No navigation items available for this role yet.
          </div>
        )}
      </nav>

      <div className="border-t border-white/10 p-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <p className="text-sm font-medium text-white">
            {user?.name ?? "Unknown User"}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            {user?.email ?? "No email available"}
          </p>

          <button
            type="button"
            onClick={logout}
            className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/15"
          >
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
