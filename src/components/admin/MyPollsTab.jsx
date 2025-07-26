import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PollCard from "../PollCard";
import PollFormModal from "../PollFormModal";
import { API_URL } from "../../shared";

const MyPollsTab = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [editingDraft, setEditingDraft] = useState(null);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loadingDraft, setLoadingDraft] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchPolls = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/polls`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch polls");

      setPolls(data);
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, [location.pathname]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setPolls((prevPolls) =>
        prevPolls.map((poll) =>
          poll.deadline && new Date(poll.deadline) < now
            ? { ...poll, status: "closed" }
            : poll
        )
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchPollWithOptions = async (pollId) => {
    try {
      const res = await fetch(`${API_URL}/api/polls/${pollId}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch poll details");

      return data;
    } catch (err) {
      console.error("Error fetching poll details:", err);
      setError(err.message);
      return null;
    }
  };

  const handleEditDraft = async (draftPoll) => {
    setLoadingDraft(true);
    const fullPollData = await fetchPollWithOptions(draftPoll.id);

    if (fullPollData) {
      setEditingDraft(fullPollData);
      setIsModalOpen(true);
    } else {
      alert("Failed to load draft data");
    }

    setLoadingDraft(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDraft(null);
  };

  const filteredAndSortedPolls = [...polls]
    .filter((poll) => {
      const matchesSearch = poll.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesFilter =
        filter === "all" ||
        (filter === "created" && poll.ownerId === user.id) ||
        (filter === "participated" && poll.participated);
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOrder === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortOrder === "status-az") return a.status.localeCompare(b.status);
      if (sortOrder === "status-za") return b.status.localeCompare(a.status);
      return 0;
    });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>My Polls</h3>
        <button onClick={() => setIsModalOpen(true)}>Create Poll</button>
      </div>

      {loading && <p>Loading your polls...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && polls.length === 0 && <p>You haven't created any polls yet.</p>}

      <ul className="poll-list">
        {filteredAndSortedPolls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            currentUser={user}
            isOpen={openMenuId === poll.id}
            onToggleMenu={(id) =>
              setOpenMenuId(openMenuId === id ? null : id)
            }
            onEdit={() => handleEditDraft(poll)}
          />
        ))}
      </ul>

      {isModalOpen && (
        <PollFormModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          existingPoll={editingDraft}
        />
      )}
    </div>
  );
};

export default MyPollsTab;
