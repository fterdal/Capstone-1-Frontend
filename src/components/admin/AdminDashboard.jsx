import React, { useState } from "react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("polls");

  return (
    <div className="admin-dashboard" style={{ padding: "2rem" }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab("polls")}>All Polls</button>
        <button onClick={() => setActiveTab("users")}>All Users</button>
        <button onClick={() => setActiveTab("myPolls")}>My Polls</button>
      </div>

      {activeTab === "polls" && <div>Poll Management View (coming soon)</div>}
      {activeTab === "users" && <div>User Management View (coming soon)</div>}
      {activeTab === "myPolls" && <div>Admin’s Own Polls (reuse existing component)</div>}
    </div>
  );
};

export default AdminDashboard;
