import React, { useState } from "react";

const VoteForm = ({ poll, readOnly = false }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (option) => {
    if (readOnly) return;

    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
       await fetch(`http://localhost:8080/api/polls/${poll.id}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          pollId: poll.id,
          rankings: selectedOptions,
        }),
      });

      alert("Vote submitted!");
      setSelectedOptions([]);
    } catch (err) {
      console.error("Failed to submit vote", err);
      alert("Failed to submit vote.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vote-form">
      <h4>Rank the options:</h4>
      <ul>
        {poll.options?.map((option) => (
          <li key={option.id}>
            <label>
              <input
                type="checkbox"
                value={option.id}
                checked={selectedOptions.includes(option.id)}
                onChange={() => handleChange(option.id)}
                disabled={readOnly}
              />
              {option.text}
            </label>
          </li>
        ))}
      </ul>

      <button type="submit" disabled={readOnly || submitting}>
        Submit Vote
      </button>
    </form>
  );
};

export default VoteForm;
