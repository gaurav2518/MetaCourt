"use client";

import { useState } from "react";
import { ROLES } from "@/constants";

type UserTableProps = {
  users: any[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onUserUpdated: () => void;
};

export default function UserTable({
  users,
  page,
  totalPages,
  onPageChange,
  onUserUpdated,
}: UserTableProps) {
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  async function updateUser(userId: string, body: any) {
    try {
      setLoadingUserId(userId);

      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to update user");
      }

      onUserUpdated();
    } finally {
      setLoadingUserId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
      <table className="w-full text-left text-sm">
        <thead className="bg-[var(--color-bg-elevated)] text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">Email</th>
            <th className="p-4">Role</th>
            <th className="p-4">Reputation</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => {
            const userId = user._id || user.id;
            const isLoading = loadingUserId === userId;

            return (
              <tr key={userId} className="border-t border-[var(--color-border-subtle)] transition hover:bg-[var(--color-bg-elevated)]">
                <td className="p-4 font-medium text-[var(--color-text-primary)]">
                  {user.name}
                </td>

                <td className="p-4 text-[var(--color-text-secondary)]">{user.email}</td>

                <td className="p-4">
                  <span className="rounded-full bg-[rgba(92,90,122,0.15)] px-3 py-1 text-xs font-medium capitalize text-[var(--color-text-secondary)]">
                    {user.role}
                  </span>
                </td>

                <td className="p-4 text-[var(--color-text-secondary)]">
                  {user.role === ROLES.JUROR
                    ? user.reputationScore ?? 100
                    : "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.isBanned
                        ? "bg-[rgba(239,68,68,0.15)] text-[var(--color-danger)]"
                        : "bg-[rgba(16,185,129,0.15)] text-[var(--color-success)]"
                    }`}
                  >
                    {user.isBanned ? "Banned" : "Active"}
                  </span>
                </td>

                <td className="p-4">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() =>
                        updateUser(userId, {
                          action: user.isBanned ? "unban" : "ban",
                        })
                      }
                      className="rounded-lg border border-[var(--color-border)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-elevated)] disabled:opacity-60"
                    >
                      {user.isBanned ? "Unban" : "Ban"}
                    </button>

                    <select
                      aria-label={"Change user role ${user.name}"}
                      disabled={isLoading}
                      value={user.role}
                      onChange={(e) =>
                        updateUser(userId, {
                          action: "changeRole",
                          role: e.target.value,
                        })
                      }
                      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-3 py-1.5 text-xs text-[var(--color-text-primary)]"
                    >
                      <option value={ROLES.USER}>User</option>
                      <option value={ROLES.JUROR}>Juror</option>
                      <option value={ROLES.ADMIN}>Admin</option>
                    </select>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {users.length === 0 && (
        <div className="p-6 text-center text-sm text-[var(--color-text-secondary)]">
          No users found.
        </div>
      )}

      <div className="flex items-center justify-between border-t border-[var(--color-border-subtle)] bg-[var(--color-bg-elevated)] px-4 py-3">
        <p className="text-sm text-[var(--color-text-secondary)]">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-sm text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-primary)] disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border border-[var(--color-border)] bg-transparent px-3 py-1.5 text-sm text-[var(--color-text-primary)] transition hover:bg-[var(--color-bg-primary)] disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
