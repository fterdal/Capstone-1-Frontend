import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import VoteForm from "../components/VoteForm";

const HostPollView = () => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`http://localhost:8080"}/api/polls/${id}`, {
          withCredentials: true,
        });
        setPoll(res.data);
        setNewDeadline(res.data.deadline || "");
      } catch (err) {
        setError("Failed to load poll");
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleSaveDeadline = async () => {
    try {
      await axios.put(`http://localhost:8080"}/api/polls/${id}`, {
        deadline: newDeadline,
      }, {
        withCredentials: true,
      });
      setPoll((prev) => ({ ...prev, deadline: newDeadline }));
      setEditingDeadline(false);
    } catch (err) {
      alert("Failed to update deadline.");
    }
  };

  const handleCopyLink = () => {
    if (!poll?.slug) {
      alert("Poll slug is missing. Cannot copy link.");
      return;
    }
    const shareURL = `${window.location.origin}/polls/view/${poll.slug}`;
    navigator.clipboard.writeText(shareURL)
      .then(() => setCopySuccess("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!poll) return null;

  return (
    <div className="host-poll-view">
      <h2>{poll.title}</h2>
      <p>{poll.description || "No description provided."}</p>

      <div className="deadline-section">
        <label>Poll ends:</label>
        {editingDeadline ? (
          <>
            <input
              type="datetime-local"
              value={newDeadline}
              onChange={(e) => setNewDeadline(e.target.value)}
            />
            <button onClick={handleSaveDeadline}>Save</button>
            <button onClick={() => setEditingDeadline(false)}>Cancel</button>
          </>
        ) : (
          <>
            <span>{poll.deadline ? new Date(poll.deadline).toLocaleString() : "No deadline"}</span>
            <button onClick={() => setEditingDeadline(true)}>Edit</button>
          </>
        )}
      </div>

      <div className="actions">
        <button onClick={handleCopyLink}>Copy Link</button>
        {copySuccess && <span className="copy-feedback">{copySuccess}</span>}
        <button onClick={() => alert("End Poll logic here")}>End Poll</button>
        <button onClick={() => alert("Results logic here")}>Results</button>
      </div>

      <h3>Vote Preview</h3>
      <VoteForm poll={poll} readOnly={false} />
    </div>
  );
};

export default HostPollView;
