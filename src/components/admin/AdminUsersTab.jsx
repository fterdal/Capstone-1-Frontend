import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../shared";

const AdminUsersTab = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/users`, {
        withCredentials: true,
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Could not fetch users.");
    } finally {
      setLoading(false);
    }
  };

  const toggleDisable = async (userId) => {
    try {
      await axios.patch(`${API_URL}/api/users/${userId}/disable`, {}, {
        withCredentials: true,
      });
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, isDisable: !user.isDisable } : user
        )
      );
    } catch (err) {
      console.error("Failed to toggle user", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p>Loading users...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <input
        type="text"
        placeholder="Search users..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
      />
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Admin?</th>
            <th>Disabled?</th>
            <th>Toggle</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((u) => (
            <tr key={u.id} style={{ borderTop: "1px solid #ccc" }}>
              <td>{u.firstName} {u.lastName}</td>
              <td>{u.email}</td>
              <td>{u.isAdmin ? "✅" : "❌"}</td>
              <td>{u.isDisable ? "Yes" : "No"}</td>
              <td>
                <button
                  onClick={() => toggleDisable(u.id)}
                  style={{
                    backgroundColor: u.isDisable ? "#28a745" : "#dc3545",
                    color: "white",
                    border: "none",
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                  }}
                >
                  {u.isDisable ? "Enable" : "Disable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsersTab;
