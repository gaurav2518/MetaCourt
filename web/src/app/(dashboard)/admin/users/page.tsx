"use client";

import { API_BASE_URL } from "@/config/api";

import { useEffect, useState } from "react";
import { Users, Search, Filter, ShieldCheck, UserX, UserCheck } from "lucide-react";
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

      const res = await fetch(`${API_BASE_URL}/api/admin/users?${params.toString()}`);

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setUsers(data.users || []);
      setPage(data.pagination?.page || 1);
      setTotalPages(data.pagination?.totalPages || 1);
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
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-6 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[var(--color-accent-primary)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--color-gold)]">
              Identity & Access Management
            </span>
          </div>
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--color-text-primary)]">
            Platform Users Directory
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)]">
            Inspect registered accounts, verify roles, adjust juror credentials, and manage account access status.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-primary)] px-4 py-2 font-mono text-xs text-[var(--color-text-secondary)]">
          <Users className="h-4 w-4 text-[var(--color-accent-primary)]" />
          <span>Page {page} of {totalPages}</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-wrap gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 p-4 backdrop-blur-xl text-[var(--color-text-primary)]">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
          <input
            type="text"
            placeholder="Search by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="mc-input pl-10 pr-4 py-2 text-sm"
          />
        </div>

        <select
          aria-label="Filter users by role"
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="mc-input w-40 py-2 text-sm"
        >
          <option value="">All Account Roles</option>
          <option value="user">User</option>
          <option value="juror">Juror</option>
          <option value="admin">Administrator</option>
        </select>

        <button
          onClick={handleSearch}
          className="rounded-xl bg-[var(--color-accent-primary)] px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-[var(--color-accent-hover)]"
        >
          Search
        </button>
      </div>

      {/* Table Section */}
      {loading ? (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-12 text-center text-sm text-[var(--color-text-muted)]">
          Loading users registry...
        </div>
      ) : (
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]/90 backdrop-blur-xl overflow-hidden p-1">
          <UserTable
            users={users}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onUserUpdated={() => loadUsers(page, search, role)}
          />
        </div>
      )}
    </div>
  );
}
