import React, { useState } from "react";
import axios, { all } from "axios";
import { useNavigate } from "react-router-dom";

const NewPoll = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");
  const [isIndefinite, setIsIndefinite] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [restrictToUsers, setRestrictToUsers] = useState(false);
  const [allowedUsersInput, setAllowedUsersInput] = useState("");

  if (!user) {
    return (
      <div className="new-poll-container">
        <div className="loading-container">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const creator_id = user.id;

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOptionField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionField = (index) => {
    const updatedOptions = options.filter((_, i) => i != index);
    setOptions(updatedOptions);
  };

  const getMinDateTime = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleAddEndDate = () => {
    setIsIndefinite(false);
  };

  const handleRemoveEndDate = () => {
    setIsIndefinite(true);
    setEndDate("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return setError("Poll title is required.");
    }

    if (!isIndefinite) {
      if (!endDate) {
        return setError(
          "Please select an end date or remove the end date to make it indefinite."
        );
      }

      const selectedEndDate = new Date(endDate);
      const now = new Date();
      if (selectedEndDate <= now) {
        return setError("End date must be in the future.");
      }
    }

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (validOptions.length < 2) {
      return setError("At least two filled options are required.");
    }

    const allowedUserIds = restrictToUsers
      ? allowedUsersInput
          .split(",")
          .map((id) => parseInt(id.trim()))
          .filter((id) => !isNaN(id))
      : [];

    try {
      const pollData = {
        creator_id,
        title: title.trim(),
        description: description.trim(),
        allowAnonymous,
        allowListOnly: restrictToUsers,
        allowedUserIds,
        status: "published",
        pollOptions: validOptions.map((optionText, index) => ({
          text: optionText,
          position: index + 1,
        })),
      };

      if (!isIndefinite && endDate) {
        pollData.endAt = new Date(endDate).toISOString();
      }

      if (!window.confirm("Are you sure you want to create this poll?")) {
        await axios.post("http://localhost:8080/api/polls", pollData);
      }

      navigate("/poll-list");
    } catch (err) {
      setError("Failed to create poll.");
      console.error("Poll creation error:", err);
    }
  };

  return (
    <div className="new-poll-container">
      <h1>Create New Poll</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Poll Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your poll question"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Description (optional):</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add more details about your poll"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label>Poll Duration:</label>

          {isIndefinite ? (
            <div className="indefinite-section">
              <div className="indefinite-notice">
                <span>📅 This poll will run indefinitely</span>
              </div>
              <button
                type="button"
                onClick={handleAddEndDate}
                className="add-end-date-btn"
              >
                + Add end date
              </button>
            </div>
          ) : (
            <div className="date-input-section">
              <div className="date-input-header">
                <label htmlFor="endDate">Poll End Date & Time:</label>
                <button
                  type="button"
                  onClick={handleRemoveEndDate}
                  className="remove-end-date-btn"
                >
                  Remove end date
                </button>
              </div>
              <input
                id="endDate"
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={getMinDateTime()}
              />
              <small>Poll must end at least 1 hour from now</small>
            </div>
          )}
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={allowAnonymous}
              onChange={(e) => setAllowAnonymous(e.target.checked)}
            />
            Allow anonymous voting
          </label>
          <small>If checked, users can vote without logging in</small>
        </div>

        <div className="form-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={restrictToUsers}
              onChange={(e) => setRestrictToUsers(e.target.checked)}
            />
            Restrict voting to specific users
          </label>
          <small>
            If checked, only the listed user IDs will be allowed to vote
          </small>

          {restrictToUsers && (
            <div className="allowed-users-input">
              <label htmlFor="allowedUserIds">Allowed User IDs:</label>
              <textarea
                id="allowedUserIds"
                value={allowedUsersInput}
                onChange={(e) => setAllowedUsersInput(e.target.value)}
                placeholder="e.g. 3, 7, 12"
                rows="2"
              />
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Poll Options:</label>
          {options.map((option, index) => (
            <div key={index} className="option-input">
              <input
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
              />
              {options.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeOptionField(index)}
                  className="remove-option-btn"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addOptionField}
            className="add-option-btn"
          >
            + Add Option
          </button>
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate("/poll-list")}>
            Cancel
          </button>
          <button type="submit" className="create-poll-btn">
            Create Poll
          </button>
          <button
            type="button"
            className="save-draft-btn"
            onClick={async () => {
            const validOptions = options.filter((opt) => opt.trim() !== "");
            if (validOptions.length < 2) {
              return setError("At least two options are required to save.");
            }

            try {
                  const draftData = {
                    creator_id,
                    title: title.trim(),
                    description: description.trim(),
                    allowAnonymous,
                    status: "draft",
                    pollOptions: validOptions.map((optionText, index) => ({
                    text: optionText,
                    position: index + 1,
                })),
            };

            if (!isIndefinite && endDate) {
              draftData.endAt = new Date(endDate).toISOString();
            }
            if (window.confirm("Are you sure you want to save this draft?")) {
              const res = await axios.post("http://localhost:8080/api/polls", draftData);
              navigate(`/edit-draft/${res.data.id}`);
            }
            } catch (err) {
            console.error("Error saving draft:", err);
            setError("Failed to save draft.");
            }
          }}
        >
          Save as Draft
        </button>
        </div>
      </form>
    </div>
  );
};

export default NewPoll;
