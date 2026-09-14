// UPDATED FILE (full rewrite) — save as: src/Pages/UserManagement.jsx
import { API_BASE_URL } from "../config";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const statusBadge = (status) => {
  const styles = {
    approved: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    suspended: "bg-red-100 text-red-700",
    rejected: "bg-red-100 text-red-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const location = useLocation();
  const navigate = useNavigate();
  const showBlockedUsers = new URLSearchParams(location.search).get("blocked") === "true";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/users`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch users.");

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError("Failed to load users.");
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  const handleBanUser = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/ban`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: "suspended" } : u)));
      } else {
        setError("Failed to ban user.");
      }
    } catch (err) {
      setError("Error banning user.");
    }
  };

  const handleUnbanUser = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/users/${id}/unban`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      if (response.ok) {
        setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: "approved" } : u)));
      } else {
        setError("Failed to unban user.");
      }
    } catch (err) {
      setError("Error unbanning user.");
    }
  };

  const filteredUsers = users
    .filter((u) => (showBlockedUsers ? u.status === "suspended" : true))
    .filter((u) => (roleFilter === "all" ? true : u.role === roleFilter))
    .filter((u) => {
      if (!search) return true;
      const term = search.toLowerCase();
      return u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
    });

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-900">
            {showBlockedUsers ? "Blocked Users" : "All Users"}
          </h2>
          {showBlockedUsers && (
            <button
              onClick={() => navigate("/dashboard/users")}
              className="text-sm text-red-700 hover:underline"
            >
              Clear filter
            </button>
          )}
        </div>

        <div className="flex gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-700"
          >
            <option value="all">All roles</option>
            <option value="admin">Admin</option>
            <option value="owner">Owner</option>
            <option value="user">User</option>
          </select>
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-red-700"
          />
        </div>
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
            <tr>
              <th className="text-left px-4 py-3 font-semibold">Name</th>
              <th className="text-left px-4 py-3 font-semibold">Email</th>
              <th className="text-left px-4 py-3 font-semibold">Role</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-gray-500 py-10">
                  No users found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {user.status === "suspended" ? (
                      <button
                        onClick={() => handleUnbanUser(user._id)}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
                      >
                        Unban
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBanUser(user._id)}
                        className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-800"
                      >
                        Ban
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;