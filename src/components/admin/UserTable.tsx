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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead className="bg-slate-50 text-slate-500">
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
              <tr key={userId} className="border-t">
                <td className="p-4 font-medium text-slate-900">
                  {user.name}
                </td>

                <td className="p-4 text-slate-600">{user.email}</td>

                <td className="p-4">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium capitalize text-slate-700">
                    {user.role}
                  </span>
                </td>

                <td className="p-4 text-slate-600">
                  {user.role === ROLES.JUROR
                    ? user.reputationScore ?? 100
                    : "-"}
                </td>

                <td className="p-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      user.isBanned
                        ? "bg-red-100 text-red-700"
                        : "bg-green-100 text-green-700"
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
                      className="rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-60"
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
                      className="rounded-lg border px-3 py-1.5 text-xs"
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
        <div className="p-6 text-center text-sm text-slate-500">
          No users found.
        </div>
      )}

      <div className="flex items-center justify-between border-t bg-slate-50 px-4 py-3">
        <p className="text-sm text-slate-500">
          Page {page} of {totalPages || 1}
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Previous
          </button>

          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            className="rounded-lg border bg-white px-3 py-1.5 text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}