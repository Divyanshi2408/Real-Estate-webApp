// UPDATED FILE (full rewrite) — save as: src/Pages/Dashboard.jsx
import { API_BASE_URL } from "../config";
import React, { useEffect, useState } from "react";
import { Navigate, NavLink, Outlet } from "react-router-dom";
import { FaBuilding, FaUsers, FaEnvelope } from "react-icons/fa";

const isAuthenticated = () => localStorage.getItem("token");

const navItems = [
  { to: "properties", label: "Properties", icon: FaBuilding },
  { to: "users", label: "Users", icon: FaUsers },
  { to: "messages", label: "Contact Messages", icon: FaEnvelope },
];

const StatCard = ({ label, value, to, accent }) => {
  const content = (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5 hover:shadow-md hover:border-gray-300 transition h-full">
      <p className="text-sm text-gray-500 font-medium">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${accent}`}>{value ?? "—"}</p>
    </div>
  );
  return to ? (
    <NavLink to={to} className="block">
      {content}
    </NavLink>
  ) : (
    content
  );
};

const Dashboard = () => {
  const [metrics, setMetrics] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/dashboard/metrics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (!response.ok) throw new Error("Failed to fetch metrics.");

        const data = await response.json();
        setMetrics(data);
      } catch (err) {
        setError("Failed to load metrics.");
        console.error(err);
      }
    };

    fetchMetrics();
  }, []);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex md:flex-col w-60 shrink-0 bg-gray-900 text-gray-300 min-h-[calc(100vh-5rem)] py-6">
        <p className="px-6 text-xs font-semibold tracking-wide text-gray-500 uppercase mb-4">
          Admin Panel
        </p>
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? "bg-red-700 text-white" : "hover:bg-gray-800 hover:text-white"
                }`
              }
            >
              <Icon className="text-base shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="p-6 lg:p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Overview</h1>
          <p className="text-gray-500 mb-6">A snapshot of what's happening on the platform.</p>

          {error && <p className="text-red-600 mb-4">{error}</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Users" value={metrics.totalUsers} accent="text-gray-900" />
            <StatCard
              label="Active Properties"
              value={metrics.totalActiveProperties}
              to="properties?status=approved"
              accent="text-green-600"
            />
            <StatCard
              label="Pending Approvals"
              value={metrics.totalPendingProperties}
              to="properties?status=pending"
              accent="text-amber-600"
            />
            <StatCard
              label="Blocked Users"
              value={metrics.totalBlockedUsers}
              to="users?blocked=true"
              accent="text-red-700"
            />
            <StatCard
              label="New Messages"
              value={metrics.newContactMessages}
              to="messages"
              accent="text-red-700"
            />
          </div>

          {/* Nav (mobile) */}
          <nav className="flex md:hidden gap-2 mb-6 overflow-x-auto">
            {navItems.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
                    isActive
                      ? "bg-red-700 text-white border-red-700"
                      : "border-gray-300 text-gray-700"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;