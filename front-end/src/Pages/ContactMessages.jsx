// NEW FILE — save as: src/Pages/ContactMessages.jsx
import React, { useEffect, useState } from "react";
import { fetchContactMessages, updateContactMessageStatus } from "../services/contactService";

const STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "new", label: "New" },
  { key: "read", label: "Read" },
  { key: "resolved", label: "Resolved" },
];

const statusBadge = (status) => {
  const styles = {
    new: "bg-amber-100 text-amber-700",
    read: "bg-blue-100 text-blue-700",
    resolved: "bg-green-100 text-green-700",
  };
  return styles[status] || "bg-gray-100 text-gray-700";
};

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await fetchContactMessages(token);
        setMessages(data);
      } catch (err) {
        setError(typeof err === "string" ? err : "Failed to load messages.");
      }
    };
    loadMessages();
  }, [token]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateContactMessageStatus(id, status, token);
      setMessages((prev) => prev.map((m) => (m._id === id ? { ...m, status } : m)));
    } catch (err) {
      setError(typeof err === "string" ? err : "Failed to update message.");
    }
  };

  const toggleExpand = (msg) => {
    setExpandedId(expandedId === msg._id ? null : msg._id);
    if (msg.status === "new") handleStatusChange(msg._id, "read");
  };

  const filtered = messages.filter((m) => (activeTab === "all" ? true : m.status === activeTab));
  const counts = {
    all: messages.length,
    new: messages.filter((m) => m.status === "new").length,
    read: messages.filter((m) => m.status === "read").length,
    resolved: messages.filter((m) => m.status === "resolved").length,
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium border transition ${
              activeTab === tab.key
                ? "bg-red-700 text-white border-red-700"
                : "border-gray-300 text-gray-600 hover:border-red-700 hover:text-red-700"
            }`}
          >
            {tab.label} <span className="ml-1 opacity-75">({counts[tab.key]})</span>
          </button>
        ))}
      </div>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No messages here.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <div key={msg._id} className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => toggleExpand(msg)}
                className="w-full flex items-center justify-between gap-4 px-4 py-3 text-left hover:bg-gray-50"
              >
                <div className="min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {msg.name} <span className="text-gray-400 font-normal">· {msg.email}</span>
                  </p>
                  <p className="text-sm text-gray-500 truncate">{msg.message}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-gray-400">
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusBadge(msg.status)}`}>
                    {msg.status}
                  </span>
                </div>
              </button>

              {expandedId === msg._id && (
                <div className="px-4 pb-4 border-t border-gray-100 pt-3">
                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
                    <div>
                      <dt className="text-gray-400">Phone</dt>
                      <dd className="text-gray-800">{msg.phone}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Preferred contact</dt>
                      <dd className="text-gray-800 capitalize">{msg.contactMethod}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400">Interested in</dt>
                      <dd className="text-gray-800 capitalize">{msg.interest}</dd>
                    </div>
                  </dl>
                  <p className="text-gray-700 whitespace-pre-wrap mb-4">{msg.message}</p>
                  <div className="flex gap-2">
                    {msg.status !== "resolved" && (
                      <button
                        onClick={() => handleStatusChange(msg._id, "resolved")}
                        className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-green-700"
                      >
                        Mark resolved
                      </button>
                    )}
                    <a
                      href={`mailto:${msg.email}`}
                      className="bg-red-700 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-800"
                    >
                      Reply by email
                    </a>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;