import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VoteForm from "../components/VoteForm";
import { API_URL } from "../shared";

const VotePollPage = () => {
  const { identifier } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem", textAlign: "center", color: "red" }}>
        <h2>Error</h2>
        <p>{error}</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <p>Poll not found</p>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div
      className="vote-page"
      style={{
        padding: "2rem",
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <h2>Vote on Poll</h2>
      <div style={{
        marginBottom: "2rem",
        padding: "1rem",
        background: "#f8f9fa",
        borderRadius: "8px"
      }}>
        <h3>{poll.question}</h3>
        {poll.description && <p>{poll.description}</p>}
      </div>

      <VoteForm poll={poll} />

      <div style={{ marginTop: "2rem", textAlign: "center" }}>
        <button
          onClick={() => navigate("/dashboard")}
          style={{
            padding: "0.5rem 1rem",
            background: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default VotePollPage;
