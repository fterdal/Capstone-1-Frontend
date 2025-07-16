import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; 
import { Link } from "react-router-dom";
import { API_URL } from "../shared";

const Dashboard = () => {
  const [polls, setPolls] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await axios.get(`${API_URL}/polls/my`, { withCredentials: true });
        setPolls(res.data.polls);
      } catch (err) {
        console.error("Failed to load polls", err);
      }
    };

    fetchPolls();
  }, []);

  const filteredPolls = polls.filter((poll) => {
    const titleMatch = poll.title.toLowerCase().includes(search.toLowerCase());
    const statusMatch = statusFilter === "all" || poll.status === statusFilter;
    return titleMatch && statusMatch;
  });

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this draft poll?")) {
      try {
        await axios.delete(`${API_URL}/polls/${id}`, { withCredentials: true });
        setPolls((prev) => prev.filter((p) => p.id !== id));
      } catch (err) {
        console.error("Failed to delete poll", err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <h2>My Polls</h2>

      <input
        type="text"
        placeholder="Search by title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
        <option value="all">All</option>
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="ended">Ended</option>
      </select>

      <ul>
        {filteredPolls.map((poll) => (
          <li key={poll.id}>
            <Link to={`/polls/${poll.id}`}>{poll.title}</Link> ({poll.status})
            
            {poll.status === "draft" && (
              <>
                <button onClick={() => handleDelete(poll.id)}>🗑️ Delete</button>
                <Link to={`/edit/${poll.id}`}>✏️ Edit</Link>
              </>
            )}

            {poll.status === "published" && (
              <>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/polls/${poll.id}`);
                    alert("Link copied!");
                  }}
                >
                  📋 Copy Link
                </button>

                {/* Added share button logic here */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                    `${window.location.origin}/polls/${poll.id}`
                  )}&text=Check out this poll!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "8px" }}
                >
                  🐦 Share on Twitter
                </a>

                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                    `${window.location.origin}/polls/${poll.id}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ marginLeft: "8px" }}
                >
                  📘 Share on Facebook
                </a>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
