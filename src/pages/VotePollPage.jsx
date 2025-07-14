import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const VotePollPage = () => {
  const navigate = useNavigate();

  const poll = {
    question: "Rank your preferred front-end frameworks:",
    options: ["React", "Vue", "Angular", "Svelte"],
  };

  const [rankings, setRankings] = useState({});

  const handleChange = (option, rank) => {
    setRankings((prev) => {
      const updated = { ...prev };
      for (const key in updated) {
        if (updated[key] === rank) {
          updated[key] = "";
        }
      }
      updated[option] = rank;
      return updated;
    });
  };

  const handleSubmit = () => {
    const assignedRanks = Object.values(rankings);
    const uniqueRanks = new Set(assignedRanks);

    if (
      Object.keys(rankings).length !== poll.options.length ||
      uniqueRanks.size !== poll.options.length
    ) {
      alert("Please assign a unique rank to each option.");
      return;
    }

    console.log("Ranked vote submitted:", rankings);
    navigate("/polls/results");
  };

  return (
    <div
      className="vote-page"
      style={{
        padding: "2rem",
        maxWidth: "600px",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <h2>This is the voting page</h2>
      <h3>{poll.question}</h3>

      <form>
        {poll.options.map((option, index) => (
          <div key={index} style={{ margin: "1rem 0", fontSize: "1.1rem" }}>
            <label>
              {option}
              <select
                value={rankings[option] || ""}
                onChange={(e) =>
                  handleChange(option, parseInt(e.target.value))
                }
                style={{ marginLeft: "1rem", padding: "0.3rem" }}
              >
                <option value="">Select rank</option>
                {poll.options.map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </label>
          </div>
        ))}

        <button
          type="button"
          onClick={handleSubmit}
          style={{
            marginTop: "2rem",
            padding: "0.6rem 1.5rem",
            fontSize: "1rem",
            backgroundColor: "#4b2aad",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Submit Vote
        </button>
      </form>
    </div>
  );
};

export default VotePollPage;
