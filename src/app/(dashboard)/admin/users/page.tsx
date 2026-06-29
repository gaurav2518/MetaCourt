"use client";

import { useEffect, useState } from "react";

import PageHeader from "@/components/layout/PageHeader";
import UserTable from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");

  const [loading, setLoading] = useState(true);

  async function loadUsers(
    pageNumber = page,
    searchText = search,
    roleFilter = role
  ) {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      params.set("page", String(pageNumber));
      params.set("limit", "20");

      if (searchText) {
        params.set("search", searchText);
      }

      if (roleFilter) {
        params.set("role", roleFilter);
      }

      const res = await fetch(`/api/admin/users?${params.toString()}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUsers(data.users);
      setPage(data.pagination.page);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  function handleSearch() {
    loadUsers(1, search, role);
  }

  function handleRoleChange(value: string) {
    setRole(value);
    loadUsers(1, search, value);
  }

  function handlePageChange(nextPage: number) {
    loadUsers(nextPage, search, role);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        subtitle="Manage users, roles, and account status."
      />

      <div className="flex flex-wrap gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-4 text-[var(--color-text-primary)]">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mc-input flex-1"
        />

        <button
          onClick={handleSearch}
          className="rounded-lg bg-[var(--color-accent-primary)] px-5 py-2 text-white transition hover:bg-[var(--color-accent-hover)]"
        >
          Search
        </button>

        <select
          aria-label="Filter users by role"
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="mc-input"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="juror">Juror</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-elevated)] p-8 text-center text-[var(--color-text-primary)]">
          Loading users...
        </div>
      ) : (
        <UserTable
          users={users}
          page={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
          onUserUpdated={() => loadUsers(page, search, role)}
        />
      )}
    </div>
  );
}
