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

      {activeTab === "polls" && (
        <div>
            <h3>All Polls</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                <th>Title</th>
                <th>Creator</th>
                <th>Status</th>
                <th>Disable</th>
                </tr>
            </thead>
            <tbody>
                {/* Replace with real fetch later */}
                {[...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderTop: "1px solid #ccc" }}>
                    <td>Poll #{i + 1}</td>
                    <td>user{i + 1}@email.com</td>
                    <td>{i % 2 === 0 ? "Published" : "Draft"}</td>
                    <td>
                    <button>Disable</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}

      {activeTab === "users" && (
        <div>
            <h3>All Users</h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
                <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {[...Array(5)].map((_, i) => (
                <tr key={i} style={{ borderTop: "1px solid #ccc" }}>
                    <td>{`User ${i + 1}`}</td>
                    <td>{`user${i + 1}@email.com`}</td>
                    <td>{i === 0 ? "Admin" : "User"}</td>
                    <td>
                    <button style={{ background: "#dc3545", color: "white" }}>
                        Disable
                    </button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
        )}

      {activeTab === "myPolls" && <div>Admin’s Own Polls (reuse existing component)</div>}
    </div>
  );
};

export default AdminDashboard;
