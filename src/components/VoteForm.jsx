import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../shared";

const VoteForm = ({ poll, user, onVoteSubmitted }) => {
  const [rankings, setRankings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleRankChange = (optionId, rank) => {
    setRankings((prev) => ({
      ...prev,
      [optionId]: parseInt(rank),
    }));
  };

  const submitVote = async () => {
    try {
      setSubmitting(true);
      setError(null);

      const rankingsArray = Object.entries(rankings)
        .filter(([_, rank]) => rank > 0)
        .map(([pollOptionId, rank]) => ({
          pollOptionId: parseInt(pollOptionId),
          rank: rank,
        }));

      if (rankingsArray.length === 0) {
        setError("Please rank at least one option");
        return;
      }

      const ranks = rankingsArray.map((r) => r.rank);
      const uniqueRanks = [...new Set(ranks)];
      if (ranks.length !== uniqueRanks.length) {
        setError("Each option must have a unique rank");
        return;
      }

      if (rankingsArray.length < poll.pollOptions.length) {
        const warningMessage = window.confirm(
          "You have not ranked all options. Do you want to continue?"
        );
        if (!warningMessage) {
          setSubmitting(false);
          return;
        }
      }

      const voteData = {
        pollId: poll.id,
        userId: user ? user.id : null, // Allow null for anonymous voting
        rankings: rankingsArray
      };

      const response = await axios.post(`${API_URL}/api/ballots`, voteData);

      setSuccess(true);
      setRankings({});

      if (onVoteSubmitted) {
        onVoteSubmitted(response.data);
        const confirmationMessage = window.confirm(
          "Vote submitted successfully!"
        );
      }
    } catch (error) {
      console.error("Error submitting vote:", error);
      setError(error.response?.data?.error || "Failed to submit vote");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="vote-form-container">
        <div className="success-message">
          <h3>✓ Vote submitted successfully!</h3>
          <p>Thank you for participating in this poll.</p>
          {!user && (
            <p className="anonymous-note">Your vote was submitted anonymously.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="vote-form-container">
      <h3>Rank the Options</h3>
      <p>Rank the options from 1 (most preferred) to {poll.pollOptions.length} (least preferred)</p>
      
      {!user && poll.allowAnonymous && (
        <div className="anonymous-voting-notice">
          <p>🔓 You are voting anonymously</p>
        </div>
      )}
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
        </div>
      )}

      <div className="options-voting-list">
        {poll.pollOptions
          .sort((a, b) => a.position - b.position)
          .map((option, index) => (
            <div key={option.id} className="vote-option-item">
              <div className="option-content">
                <span className="option-number">{index + 1}.</span>
                <span className="option-text">{option.text}</span>
              </div>

              <div className="rank-selector">
                <label htmlFor={`rank-${option.id}`}>Rank:</label>
                <select
                  id={`rank-${option.id}`}
                  value={rankings[option.id] || ""}
                  onChange={(e) => handleRankChange(option.id, e.target.value)}
                  className="rank-select"
                >
                  <option value="">No rank</option>
                  {Array.from({ length: poll.pollOptions.length }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
      </div>

      <button
        onClick={submitVote}
        disabled={submitting || Object.keys(rankings).length === 0}
        className="submit-vote-btn"
      >
        {submitting ? "Submitting..." : "Submit Vote"}
      </button>
    </div>
  );
};

export default VoteForm;
