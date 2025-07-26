import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VoteForm from "../components/VoteForm";
import { API_URL } from "../shared";
import "./HostPollView.css";

const HostPollView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingDeadline, setEditingDeadline] = useState(false);
  const [newDeadline, setNewDeadline] = useState("");
  const [copySuccess, setCopySuccess] = useState("");

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/polls/${id}`, {
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

  // Auto-end poll when deadline passes
  useEffect(() => {
    if (!poll?.deadline || poll.status === "ended") return;

    const interval = setInterval(async () => {
      const now = new Date();
      const deadlineTime = new Date(poll.deadline);

      if (now >= deadlineTime) {
        clearInterval(interval);
        try {
          await axios.put(`http://localhost:8080/api/polls/${id}`, {
            status: "ended",
          }, {
            withCredentials: true,
          });
          setPoll((prev) => ({ ...prev, status: "ended" }));
        } catch (err) {
          console.error("Failed to auto-end poll:", err);
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [poll, id]);

  const handleSaveDeadline = async () => {
    try {
      await axios.patch(`${API_URL}/api/polls/${id}`, {

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

    const baseURL = `${window.location.origin}/polls/view`;
    const shareURL = `${baseURL}/${poll.slug}`;

    navigator.clipboard.writeText(shareURL)
      .then(() => setCopySuccess("Link copied to clipboard!"))
      .catch(() => alert("Failed to copy link."));
  };

  const handleEndPoll = async () => {
    const endPollNow = new Date().toISOString();
    try {
      await axios.patch(`${API_URL}/api/polls/${id}`, {

        deadline: endPollNow,
      }, {
        withCredentials: true,
      });
      setPoll((prev) => ({ ...prev, deadline: endPollNow, }));
      setEditingDeadline(false);
    } catch (err) {
      console.error("Failed to end poll:", err);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  if (!poll) return null;

  return (
    <div className="host-poll-view">
      <div className="host-poll-container">
        <div className="vote-section">
          <h3>Vote on Your Poll</h3>
          {poll.status === "ended" ? (
            <p style={{ color: "#888" }}><em>This poll has ended. Voting is disabled.</em></p>
          ) : (
            <VoteForm poll={poll} readOnly={false} />
          )}
        </div>

        <div className="overview-section">
          <div className="poll-header">
            <h2>{poll.title}</h2>
            <h4>Description:</h4>
            <p>{poll.description || "No description provided."}</p>
          </div>

          <div className="poll-stats">
            <div className="stat-item">
              <span className="stat-label">Status:</span>
              <span className="stat-value">{poll.status}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Participants:</span>
              <span className="stat-value">{poll.participants || 0}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Created:</span>
              <span className="stat-value">{new Date(poll.createdAt).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="deadline-section">
            <h4>Poll Deadline</h4>
            {editingDeadline ? (
              <div className="deadline-edit">
                <input
                  type="datetime-local"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                />
                <div className="deadline-buttons">
                  <button onClick={handleSaveDeadline}>Save</button>
                  <button onClick={() => setEditingDeadline(false)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="deadline-display">
                <span>{poll.deadline ? new Date(poll.deadline).toLocaleString() : "No deadline"}</span>
                <button onClick={() => setEditingDeadline(true)} disabled={poll.status === "ended"}>Edit</button>
              </div>
            )}
          </div>

          <div className="actions">
            <h4>Poll Actions</h4>
            <div className="action-buttons">
              <button onClick={handleCopyLink}>Copy Share Link</button>
              {copySuccess && <span className="copy-feedback">{copySuccess}</span>}
              <button onClick={handleEndPoll}>End Poll</button>
              <button onClick={() => alert("Results logic here")}>View Results</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostPollView;
