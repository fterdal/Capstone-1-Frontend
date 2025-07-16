import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// Simulate poll data and user login
const mockUser = { username: "testuser" };

const fallbackPoll = {
  questions: [
    {
      questionTitle: "Favorite Fruit?",
      options: ["Apple", "Banana", "Orange"],
      votes: 12,
    },
    {
      questionTitle: "Best Color?",
      options: ["Red", "Blue", "Green"],
      votes: 8,
    },
  ],
  endDate: "2025-07-20",
};

const VotingPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Replace with actual poll data source
  const poll = location.state?.poll || fallbackPoll;

  // State for rankings (select-based ranking)
  const [rankings, setRankings] = useState(
    poll.questions.map((q) => Array(q.options.length).fill(""))
  );
  // Track if ballot was submitted
  const [submitted, setSubmitted] = useState(false);
  // Track if user tried to submit incomplete ballot
  const [warning, setWarning] = useState(false);
  // Track if user saved for later
  const [saved, setSaved] = useState(false);

  // Prevent duplicate submissions
  const [hasVoted, setHasVoted] = useState(false);

  // Email state for results notification
  const [email, setEmail] = useState("");
  const [emailSubmitted, setEmailSubmitted] = useState(false);

  // Handle ranking selection
  const handleRankChange = (qIdx, oIdx, rank) => {
    setRankings((prev) =>
      prev.map((ranks, idx) =>
        idx === qIdx
          ? ranks.map((r, i) => (i === oIdx ? rank : r))
          : ranks
      )
    );
  };

  // Check if all rankings are complete and unique per question
  const isRankingComplete = () =>
    rankings.every((ranks) => {
      const filled = ranks.filter((r) => r !== "");
      const unique = new Set(filled).size === filled.length;
      return filled.length === ranks.length && unique;
    });

  // Submit vote
  const handleSubmit = (e) => {
    e.preventDefault();
    if (hasVoted) return; // Prevent duplicate submissions
    if (!isRankingComplete()) {
      setWarning(true);
      return;
    }
    setWarning(false);
    setSubmitted(true);
    setHasVoted(true);
    // Rankings submitted, now prompt for email
  };

  // Handle email submission
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setEmailSubmitted(true);
    // TODO: Send email to backend to receive results
    setTimeout(() => navigate("/dashboard"), 2000); // Redirect after confirmation
  };

  // Save for later (if logged in)
  const handleSaveForLater = () => {
    // TODO: Save rankings to backend or localStorage
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="voting-page">
      <h2>🗳️ Vote on This Poll</h2>
      <p>
        Poll ends: <strong>{poll.endDate}</strong> <br />
        Total votes so far:{" "}
        <strong>
          {poll.questions.reduce((sum, q) => sum + (q.votes || 0), 0)}
        </strong>
      </p>
      {hasVoted && (
        <div style={{ color: "red" }}>You have already submitted your ballot.</div>
      )}
      {warning && (
        <div style={{ color: "orange" }}>
          Please rank all options uniquely for each question!
        </div>
      )}
      {submitted && !emailSubmitted && (
        <form onSubmit={handleEmailSubmit}>
          <div style={{ color: "green" }}>
            Thank you for voting! Enter your email to receive poll results:
          </div>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            style={{ margin: "1em 0", padding: "0.5em" }}
          />
          <button type="submit">Submit Email</button>
        </form>
      )}
      {emailSubmitted && (
        <div style={{ color: "blue" }}>
          Your email was submitted! You will receive the results when the poll ends.
        </div>
      )}
      {!submitted && (
        <form onSubmit={handleSubmit}>
          {poll.questions.map((q, qIdx) => (
            <div key={qIdx} className="question-block">
              <h3>{q.questionTitle}</h3>
              <div className="options-list">
                {q.options.map((option, oIdx) => (
                  <div key={oIdx} style={{ marginBottom: "0.5em" }}>
                    <span>{option}</span>
                    {/* Select rank for each option */}
                    <select
                      value={rankings[qIdx][oIdx]}
                      onChange={(e) =>
                        handleRankChange(qIdx, oIdx, e.target.value)
                      }
                      disabled={hasVoted}
                    >
                      <option value="">Rank</option>
                      {q.options.map((_, rankIdx) => (
                        <option key={rankIdx} value={rankIdx + 1}>
                          {rankIdx + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
              <div>
                <span>Votes: {q.votes || 0}</span>
              </div>
            </div>
          ))}
          <button
            type="submit"
            className="submit-vote-btn"
            disabled={hasVoted}
          >
            Submit Vote
          </button>
          {mockUser && (
            <button
              type="button"
              onClick={handleSaveForLater}
              disabled={hasVoted}
              style={{ marginLeft: "1em" }}
            >
              Save for Later
            </button>
          )}
        </form>
      )}
    </div>
  );
};

export default VotingPage;