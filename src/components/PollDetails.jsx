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

  const isPollActive = poll.endAt ? new Date(poll.endAt) > new Date() : true;

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
        </div>

        {showVoteForm && isPollActive && (
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
            <strong>Created:</strong>{" "}
            {new Date(poll.createdAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Created by:</strong>{" "}
            {userLoading ? "Loading..." : master ? master.username : "Unknown"}
          </p>

          <div>{poll.status === "published" && poll.ballots?.length > 0 && <IRVResults poll={poll} />}</div>
        </div>
      </div>
    </div>
  );
};

export default PollDetails;