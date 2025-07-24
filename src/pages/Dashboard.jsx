import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PollFormModal from "../components/PollFormModal";
import PollCard from "../components/PollCard";
import "./Dashboard.css";


const Dashboard = ({ user: currentUser }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/polls", {
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

    fetchPolls();
  }, []);

  const filteredAndSortedPolls = [...polls]
    .filter((poll) => {
      const matchesSearch = poll.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "created" && poll.ownerId === currentUser.id) ||
        (filter === "participated" && poll.participated);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "newest") return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "oldest") return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === "status-az") return a.status.localeCompare(b.status);
      if (sortOrder === "status-za") return b.status.localeCompare(a.status);
      return 0;
    });

  const timeLeft = (deadline) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = Math.max(0, end - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? "no end date" : `ends in ${days} day${days > 1 ? "s" : ""}`;
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      <nav className="dashboard-nav">
        <button onClick={() => setIsModalOpen(true)}>Create a Poll</button>
        <input
          type="text"
          placeholder="Search by title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="published">Created</option>
          <option value="participated">Participated</option>
        </select>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="status-az">Status A → Z</option>
          <option value="status-za">Status Z → A</option>
        </select>
      </nav>

      {loading && <p>Loading polls...</p>}
      {error && <p className="error">{error}</p>}
      {!loading && filteredAndSortedPolls.length === 0 && <p>No polls to display.</p>}

      <ul className="poll-list">
        {filteredAndSortedPolls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            isOpen={openMenuId === poll.id}
            onToggleMenu={(id) => setOpenMenuId(openMenuId === id ? null : id)}
            currentUser={currentUser}
          />
        ))}
      </ul>
      <PollFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    
    </div>
  );
};

export default Dashboard;
