import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const location = useLocation();
  const showBlockedUsers = new URLSearchParams(location.search).get("blocked") === "true";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/admin/users", {
          headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
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

  // Filter only blocked users if the query parameter is present
  const filteredUsers = showBlockedUsers ? users.filter(user => user.status === "suspended") : users;

  const handleBanUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/ban`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setUsers(users.map((user) =>
          user._id === id ? { ...user, status: "suspended" } : user
        ));
        alert("User has been banned and cannot log in.");
      } else {
        setError("Failed to ban user.");
      }
    } catch (err) {
      setError("Error banning user.");
    }
  };

  const handleUnbanUser = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/unban`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setUsers(users.map((user) =>
          user._id === id ? { ...user, status: "approved" } : user
        ));
        alert("User has been unbanned and can log in.");
      } else {
        setError("Failed to unban user.");
      }
    } catch (err) {
      setError("Error unbanning user.");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">
        {showBlockedUsers ? "Blocked Users" : "User Management"}
      </h2>
      {error && <p className="text-red-600">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((user) => (
          <div key={user._id} className="w-64 p-6 border border-gray-200 rounded-lg shadow-md bg-white">
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-gray-700">{user.email}</p>
            <p className="text-gray-700">{user.role}</p>
            <p className="text-gray-800">Status: <span className="font-medium">{user.status}</span></p>

            {user.status === "suspended" ? (
              <button
                onClick={() => handleUnbanUser(user._id)}
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 w-full"
              >
                Unban User
              </button>
            ) : (
              <button
                onClick={() => handleBanUser(user._id)}
                className="mt-4 bg-red-700 text-white px-4 py-2 rounded hover:bg-red-800 w-full"
              >
                Ban User
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserManagement;
