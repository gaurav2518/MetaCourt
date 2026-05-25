"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ROLES } from "@/constants";
import { useAuth } from "@/context/AuthContext";

type NavItem = {
  label: string;
  href: string;
};

type RoleValue = (typeof ROLES)[keyof typeof ROLES];

const NAV_ITEMS: Record<RoleValue, NavItem[]> = {
  [ROLES.COMPLAINANT]: [
    { label: "Dashboard", href: "/complainant" },
    { label: "File Complaint", href: "/complainant/file" },
    { label: "My Cases", href: "/complainant/cases" },
  ],
  [ROLES.OPPOSITE_PARTY]: [
    { label: "Dashboard", href: "/opposite-party" },
    { label: "Complaints Against Me", href: "/opposite-party/cases" },
  ],
  [ROLES.JUROR]: [
    { label: "Dashboard", href: "/juror" },
    { label: "Assigned Cases", href: "/juror/cases" },
    { label: "History", href: "/juror/history" },
    { label: "Reputation", href: "/juror/reputation" },
  ],
  [ROLES.ADMIN]: [
    { label: "Dashboard", href: "/admin" },
    { label: "Complaints", href: "/admin/complaints" },
    { label: "Users", href: "/admin/users" },
    { label: "Jurors", href: "/admin/jurors" },
  ],
};

const ROLE_LABELS: Record<RoleValue, string> = {
  [ROLES.COMPLAINANT]: "Complainant",
  [ROLES.OPPOSITE_PARTY]: "Opposite Party",
  [ROLES.JUROR]: "Juror",
  [ROLES.ADMIN]: "Admin",
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = useMemo(() => {
    if (!user?.role) return [];
    return NAV_ITEMS[user.role as RoleValue] ?? [];
  }, [user?.role]);

  const roleLabel = user?.role
    ? ROLE_LABELS[user.role as RoleValue] ?? user.role.replace("_", " ")
    : "Guest";

  const hasNavItems = navItems.length > 0;

  return (
    <aside className="flex h-full w-72 flex-col border-r border-white/10 bg-slate-950 text-white">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-600 font-bold text-white shadow-lg shadow-cyan-500/20">
            M
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">MetaCourt</h1>
            <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
              {roleLabel}
            </p>
          </div>
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