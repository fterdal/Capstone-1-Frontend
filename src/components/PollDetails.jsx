import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import VoteForm from "./VoteForm";
import IRVResults from "./IRVResults";

const PollDetails = ({ user }) => {
  const { id } = useParams();
  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [master, setMaster] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [showVoteForm, setShowVoteForm] = useState(false);
  const [closing, setClosing] = useState(false);

  const fetchPoll = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/polls/${id}`);
      setPoll(response.data);
    } catch (error) {
      console.error("Error fetching poll:", error);
      setError("Failed to load poll");
    } finally {
      setLoading(false);
    }
  };

  const fetchUser = async (creatorId) => {
    try {
      setUserLoading(true);
      const response = await axios.get(`${API_URL}/api/users/${creatorId}`);
      setMaster(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    } finally {
      setUserLoading(false);
    }
  };

  const handleClosePoll = async () => {
    if (!window.confirm("Are you sure you want to close this poll?")) return;
    try {
      setClosing(true);
      await axios.patch(
        `${API_URL}/api/admin/polls/${poll.id}/close`,
        {},
        { withCredentials: true }
      );
      await fetchPoll(); 
      setShowVoteForm(false);
    } catch (err) {
      console.error("Error closing poll:", err);
      setError("Failed to close poll");
    } finally {
      setClosing(false);
    }
  };

  const handleVoteSubmitted = (voteData) => {
    console.log("Vote submitted:", voteData);
    setShowVoteForm(false);
  };

  useEffect(() => {
    if (id) {
      fetchPoll();
    }
  }, [id]);

  useEffect(() => {
    if (poll && poll.creator_id) {
      fetchUser(poll.creator_id);
    }
  }, [poll]);

  if (loading) {
    return (
      <div className="poll-details-container">
        <p>Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="poll-details-container">
        <p>{error}</p>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="poll-details-container">
        <p>Poll not found</p>
      </div>
    );
  }

  const isPollActive =
    poll.status !== "closed" &&
    poll.isActive &&
    (poll.endAt ? new Date(poll.endAt) > new Date() : true);
  const canVote = isPollActive && (user || poll.allowAnonymous);
  const showLoginPrompt = isPollActive && !user && !poll.allowAnonymous;

  return (
    <div className="poll-details-wrapper">
      <div className="poll-details-container">
        <div className="poll-header">
          <h1>{poll.title}</h1>
          {poll.description && (
            <p className="poll-description">{poll.description}</p>
          )}

          <div className="poll-meta">
            <span className="poll-status">
              Status: {isPollActive ? "Active" : "Ended"}
            </span>
            {poll.endAt && (
              <span className="poll-end-time">
                Ends: {new Date(poll.endAt).toLocaleDateString()} at{" "}
                {new Date(poll.endAt).toLocaleTimeString()}
              </span>
            )}
            {!poll.endAt && <span className="poll-end-time">No end date</span>}
          </div>

          {user?.role === "admin" && poll.status !== "closed" && (
            <button
              onClick={handleClosePoll}
              disabled={closing}
              className="close-poll-btn"
            >
              {closing ? "Closing..." : "Close Poll"}
            </button>
          )}
        </div>

        <div className="poll-options">
          <h3>Options:</h3>
          {poll.pollOptions && poll.pollOptions.length > 0 ? (
            <div className="options-list">
              {poll.pollOptions
                .sort((a, b) => a.position - b.position)
                .map((option, index) => (
                  <div key={option.id} className="option-item">
                    <span className="option-number">{index + 1}.</span>
                    <span className="option-text">{option.text}</span>
                  </div>
                ))}
            </div>
          ) : (
            <p>No options available for this poll.</p>
          )}

          {isPollActive && (
            <button
              onClick={() => setShowVoteForm(!showVoteForm)}
              className="vote-toggle-btn"
            >
              {showVoteForm ? "Cancel Vote" : "Vote Now"}
            </button>
          )}

          {/* Login prompt for non-anonymous polls */}
          {showLoginPrompt && (
            <div className="login-prompt">
              <p className="login-message">
                This poll requires authentication to vote.
              </p>
              <a href="/login" className="login-link">
                Login to vote
              </a>
            </div>
          )}

          {/* Poll ended message */}
          {!isPollActive && (
            <div className="poll-ended-message">
              <p>This poll has ended. No more votes are being accepted.</p>
            </div>
          )}
        </div>

        {/* Vote form - only show if user can vote */}
        {showVoteForm && canVote && (
          <VoteForm
            poll={poll}
            user={user}
            onVoteSubmitted={handleVoteSubmitted}
          />
        )}

        <div className="poll-info">
          <p>
            <strong>Anonymous voting:</strong>{" "}
            {poll.allowAnonymous ? "Allowed" : "Not allowed"}
          </p>
          <p>
            <strong>Total votes:</strong> {poll.ballots?.length || 0}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(poll.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Created by:</strong>{" "}
            {userLoading ? "Loading..." : master ? master.username : "Unknown"}
          </p>
        </div>

        {/* Results section only for published polls*/}
        {poll.status === "published" && poll.ballots?.length > 0 && (
          <div className="results-section">
            <h3>Results</h3>
            <IRVResults poll={poll} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PollDetails;
