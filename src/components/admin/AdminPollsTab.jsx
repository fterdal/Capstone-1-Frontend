import React, { useEffect, useState } from "react";
import { API_URL } from "../../shared";

const AdminPollsTab = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPolls = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/polls/admin/all`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch polls");
      setPolls(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const togglePollDisable = async (pollId) => {
    try {
      await fetch(`${API_URL}/polls/${pollId}/disable`, {
        method: "PATCH",
        credentials: "include",
      });
      // Refresh data after toggle
      fetchPolls();
    } catch (err) {
      alert("Failed to toggle poll status.");
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <table style={{ width: "100%", borderCollapse: "collapse" }}>
      <thead>
        <tr>
          <th>Title</th>
          <th>Status</th>
          <th>Poll ID</th>
          <th>Disable</th>
        </tr>
      </thead>
      <tbody>
        {polls.map((poll) => (
          <tr key={poll.id} style={{ borderTop: "1px solid #ccc" }}>
            <td>{poll.title}</td>
            <td>{poll.status}</td>
            <td>{poll.id}</td>
            <td>
              <button
                style={{
                  background: poll.isDisabled ? "#28a745" : "#dc3545",
                  color: "white",
                }}
                onClick={() => togglePollDisable(poll.id)}
              >
                {poll.isDisabled ? "Enable" : "Disable"}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AdminPollsTab;
