import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VoteForm from "../components/VoteForm";
import { API_URL } from "../shared";

const VotePollPage = ({ user }) => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasVoted, setHasVoted] = useState(false);
  const [email, setEmail] = useState("");
  const isGuest = !user;

  // Fetch poll data
  useEffect(() => {
    const fetchPoll = async () => {
      try {
        let url;


        if (isNaN(Number(identifier))) {
          // it's a slug
          url = `${API_URL}/api/polls/slug/${identifier}`;
        } else {
          // it's a numeric ID
          url = `${API_URL}/api/polls/${identifier}`;
        }


        console.log("📡 Fetching poll from:", url);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch poll: ${response.statusText}`);
        }

        const pollData = await response.json();
        setPoll(pollData);
      } catch (err) {
        console.error("Error fetching poll:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [identifier]);

  // Check if logged-in user already voted
  useEffect(() => {
    const fetchUserVote = async () => {
      if (!poll || isGuest) return;
      try {
        const res = await fetch(`http://localhost:8080/api/polls/${poll.id}/vote`, {
          credentials: "include",
        });
        if (res.ok) {
          setHasVoted(true);
        }
      } catch (err) {
        // No vote found — fine
      }
    };

    fetchUserVote();
  }, [poll, isGuest]);

  if (loading) {
    return <div style={{ padding: "2rem", textAlign: "center" }}><p>Loading poll...</p></div>;
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        {user && (
          <button onClick={() => navigate("/dashboard")} style={buttonStyle}>
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  if (!poll) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Poll not found</p>
        {user && (
          <button onClick={() => navigate("/dashboard")} style={buttonStyle}>
            Back to Dashboard
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="vote-page" style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Vote on Poll</h2>
      <div style={{
        marginBottom: "2rem", padding: "1rem",
        background: "#f8f9fa", borderRadius: "8px"
      }}>
        <h3>{poll.title}</h3>
        {poll.description && <p>{poll.description}</p>}
      </div>

      {poll.status === "ended" ? (
        <p style={{ color: "#888", textAlign: "center" }}>
          <em>This poll has ended. Voting is disabled.</em>
        </p>
      ) : hasVoted ? (
        <div style={{ textAlign: "center", color: "#28a745" }}>
          <h4>✅ You’ve already voted on this poll.</h4>
          <p>Your vote has been recorded. Thank you!</p>
        </div>
      ) : (
        <VoteForm poll={poll} user={user} email={email} setEmail={setEmail} />
      )}

      {user && (
        <div style={{ marginTop: "2rem", textAlign: "center" }}>
          <button onClick={() => navigate("/dashboard")} style={buttonStyle}>
            Back to Dashboard
          </button>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  padding: "0.5rem 1rem",
  background: "#6c757d",
  color: "white",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default VotePollPage;
