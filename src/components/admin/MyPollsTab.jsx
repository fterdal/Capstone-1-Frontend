import React, { useState, useEffect } from "react";
import PollCard from "../PollCard";
import PollFormModal from "../PollFormModal";

const MyPollsTab = ({ user }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchMyPolls = async () => {
      try {
        const res = await fetch("http://localhost:8080/api/polls", {
          credentials: "include",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch polls");

        const myPolls = data.filter(p => p.ownerId === user.id);
        setPolls(myPolls);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyPolls();
  }, [user?.id]);

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
        {polls.map(poll => (
          <PollCard
            key={poll.id}
            poll={poll}
            currentUser={user}
          />
        ))}
      </ul>

      <PollFormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default MyPollsTab;
