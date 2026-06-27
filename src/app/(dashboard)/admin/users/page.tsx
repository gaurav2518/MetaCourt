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

      <div className="flex flex-wrap gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-slate-900 shadow-sm">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-xl border px-4 py-2"
        />

        <button
          onClick={handleSearch}
          className="rounded-xl bg-cyan-600 px-5 py-2 text-white"
        >
          Search
        </button>

        <select
          aria-label="Filter users by role"
          value={role}
          onChange={(e) => handleRoleChange(e.target.value)}
          className="rounded-xl border px-4 py-2"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="juror">Juror</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {loading ? (
        <div className="rounded-2xl border bg-white p-8 text-center text-slate-900">
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
