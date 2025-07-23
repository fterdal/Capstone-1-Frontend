import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";
import RestrictedAccess from "./RestrictedAccess";
import VoteForm from "./VoteForm";
import IRVResults from "./IRVResults";
import "./CSS/PollDetailsStyles.css";

const PollDetails = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [poll, setPoll] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userLoading, setUserLoading] = useState(true);
  const [error, setError] = useState(null);
  const [requiresLogin, setRequiresLogin] = useState(false);
  const [userBallot, setUserBallot] = useState(null);
  const [voteSubmitted, setVoteSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await axios.get(`${API_URL}/api/polls/${id}`, {
          headers: getAuthHeaders(),
        });

        const pollData = response.data;

        if (!pollData.PollOptions && pollData.pollOptions) {
          pollData.PollOptions = pollData.pollOptions;
        }

        if (pollData.PollOptions) {
          pollData.pollOptions = pollData.PollOptions;
        }
        if (pollData.Ballots) {
          pollData.ballots = pollData.Ballots.map((ballot) => ({
            ...ballot,
            ballotRankings: ballot.BallotRankings || [],
          }));
        }

        setPoll(pollData);

        if (pollData.endAt && new Date(pollData.endAt) <= new Date()) {
          setShowResults(true);
        }

        if (user && pollData.Ballots && pollData.Ballots.length > 0) {
          const userBallotData = pollData.Ballots.find(
            (ballot) => ballot.user_id === user.id
          );
          if (userBallotData) {
            setUserBallot(userBallotData);
            setVoteSubmitted(true);
            setShowResults(true);
          }
        }
      } catch (error) {
        console.error("Error fetching poll:", error);
        if (error.response?.status === 403) {
          setError("restricted");
          setRequiresLogin(error.response.data.requiresLogin || false);
        } else if (error.response?.status === 404) {
          setError("Poll not found");
        } else {
          setError("Failed to load poll");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPoll();
    }
  }, [id, user]);

  useEffect(() => {
    if (!poll?.endAt) return;

    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(poll.endAt);
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m ${seconds}s`);
        } else {
          setTimeLeft(`${seconds}s`);
        }
      } else {
        setTimeLeft("Poll ended");
        setShowResults(true);
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [poll?.endAt]);

  const handleVoteSubmitted = async (voteData) => {
    try {
      const refreshResponse = await axios.get(`${API_URL}/api/polls/${id}`, {
        headers: getAuthHeaders(),
      });

      const updatedPollData = refreshResponse.data;

      if (!updatedPollData.PollOptions && updatedPollData.pollOptions) {
        updatedPollData.PollOptions = updatedPollData.pollOptions;
      }
      if (updatedPollData.PollOptions) {
        updatedPollData.pollOptions = updatedPollData.PollOptions;
      }
      if (updatedPollData.Ballots) {
        updatedPollData.ballots = updatedPollData.Ballots.map((ballot) => ({
          ...ballot,
          ballotRankings: ballot.BallotRankings || [],
        }));
      }

      setPoll(updatedPollData);

      if (updatedPollData.Ballots && user) {
        const userBallotData = updatedPollData.Ballots.find(
          (ballot) => ballot.user_id === user.id
        );
        if (userBallotData) {
          setUserBallot(userBallotData);
        }
      }

      setVoteSubmitted(true);
      setShowResults(true);
    } catch (error) {
      console.error("Error refreshing poll data:", error);
      setVoteSubmitted(true);
      setShowResults(true);
    }
  };

  const isPollActive = poll?.endAt ? new Date(poll.endAt) > new Date() : true;
  const canVote = poll?.permissions?.canVote && isPollActive && !voteSubmitted;

  if (loading) {
    return (
      <div className="poll-details-container">
        <div className="loading-spinner">Loading poll...</div>
      </div>
    );
  }

  if (error === "restricted") {
    return <RestrictedAccess requiresLogin={requiresLogin} />;
  }

  if (error) {
    return (
      <div className="poll-details-container">
        <div className="error-message">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/poll-list")} className="back-btn">
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  if (!poll) {
    return (
      <div className="poll-details-container">
        <div className="error-message">
          <h2>Poll not found</h2>
          <button onClick={() => navigate("/poll-list")} className="back-btn">
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  if (!poll.PollOptions || poll.PollOptions.length === 0) {
    return (
      <div className="poll-details-container">
        <div className="error-message">
          <h2>Invalid Poll</h2>
          <p>This poll has no options available.</p>
          <button onClick={() => navigate("/poll-list")} className="back-btn">
            Back to Polls
          </button>
        </div>
      </div>
    );
  }

  return (
      <div className="poll-details-container">
        <div className="poll-header">
          <button
            onClick={() => navigate("/poll-list")}
            className="back-button"
          >
            ← Back to Polls
          </button>

          <div className="poll-meta">
            {poll.creator && (
              <div className="creator-info">
                <img
                  src={
                    poll.creator.imageUrl ||
                    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                  }
                  alt={poll.creator.username}
                  className="creator-avatar"
                />
                <span className="creator-name">
                  by @{poll.creator.username}
                </span>
              </div>
            )}

            <div className="poll-restrictions">
              {poll.viewRestriction !== "public" && (
                <span className="restriction-badge view">
                  👁️ {poll.viewRestriction} view
                </span>
              )}
              {poll.voteRestriction !== "public" && (
                <span className="restriction-badge vote">
                  🗳️ {poll.voteRestriction} vote
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="poll-content">
          <h1 className="poll-title">{poll.title}</h1>

          {poll.description && (
            <p className="poll-description">{poll.description}</p>
          )}

          <div className="poll-status">
            {poll.endAt && (
              <div className={`poll-timer ${!isPollActive ? "ended" : ""}`}>
                {isPollActive ? `⏰ Time left: ${timeLeft}` : "⏰ Poll ended"}
              </div>
            )}

            <div className="poll-info">
              <p>📊 {poll.ballots?.length || 0} votes cast</p>
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
                {userLoading
                  ? "Loading..."
                  : master
                  ? master.username
                  : "Unknown"}
              </p>
            </div>

            {/* Use VoteForm component for voting */}
            {canVote && (
              <VoteForm
                poll={poll}
                user={user}
                onVoteSubmitted={handleVoteSubmitted}
              />
            )}

            {/* Show voting disabled message */}
            {!canVote && !showResults && (
              <div className="voting-disabled">
                <p>
                  {!user
                    ? "Please log in to vote"
                    : !poll.permissions?.canVote
                    ? "You don't have permission to vote on this poll"
                    : !isPollActive
                    ? "This poll has ended"
                    : "You have already voted on this poll"}
                </p>
                {!isPollActive || voteSubmitted ? (
                  <button
                    onClick={() => setShowResults(true)}
                    className="show-results-btn"
                  >
                    Show Results
                  </button>
                ) : null}
              </div>
            )}

            {/* Use IRVResults component for results */}
            {poll.status === "published" && poll.ballots?.length > 0 && (
              <div className="results-section">
                <h3>Results</h3>
                <IRVResults poll={poll} />

                {!voteSubmitted && canVote && (
                  <button
                    onClick={() => setShowResults(false)}
                    className="back-to-voting-btn"
                  >
                    Back to Voting
                  </button>
                )}
              </div>
            )}

            {/* Show user's vote if they voted */}
            {userBallot && userBallot.BallotRankings && (
              <div className="user-vote-section">
                <h4>Your Vote:</h4>
                <div className="user-rankings">
                  {userBallot.BallotRankings.sort(
                    (a, b) => a.rank - b.rank
                  ).map((ranking) => (
                    <div key={ranking.id} className="user-ranking">
                      <span className="rank-number">{ranking.rank}.</span>
                      <span className="rank-option">
                        {ranking.PollOption?.text || "Unknown option"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
  );
};

export default PollDetails;
