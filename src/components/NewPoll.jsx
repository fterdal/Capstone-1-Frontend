import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../shared";
import UserSearchInput from "./UserSearchInput";

const NewPoll = ({ user }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");
  const [isIndefinite, setIsIndefinite] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [error, setError] = useState("");
  const [viewRestriction, setViewRestriction] = useState("public");
  const [voteRestriction, setVoteRestriction] = useState("public");
  const [customViewUsers, setCustomViewUsers] = useState([]);
  const [customVoteUsers, setCustomVoteUsers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

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
    const updatedOptions = options.filter((_, i) => i !== index);
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

  const validatePoll = (isDraft = false) => {
  if (!title.trim()) {
    return "Poll title is required.";
  }

  const validOptions = options.filter((opt) => opt.trim() !== "");
  if (validOptions.length < 1) {
    return "At least one option is required.";
  }

  if (!isDraft) {
    if (!isIndefinite) {
      if (!endDate) {
        return "Please select an end date or remove the end date to make it indefinite.";
      }

      const selectedEndDate = new Date(endDate);
      const now = new Date();
      if (selectedEndDate <= now) {
        return "End date must be in the future.";
      }
    }

    if (validOptions.length < 2) {
      return "At least two filled options are required for publishing.";
    }
  }

  return null;
};

  const createPollData = (status) => {
  const validOptions = options.filter((opt) => opt.trim() !== "");
  
  const pollData = {
    creator_id,
    title: title.trim(),
    description: description.trim(),
    allowAnonymous: allowAnonymous && voteRestriction === "public",
    status: status,
    viewRestriction,
    voteRestriction,
    customViewUsers: viewRestriction === "custom" ? customViewUsers.map(u => u.id) : [],
    customVoteUsers: voteRestriction === "custom" ? customVoteUsers.map(u => u.id) : [],
    pollOptions: validOptions.map((optionText, index) => ({
      text: optionText.trim(),
      position: index + 1,
    })),
  };

  if (!isIndefinite && endDate) {
    pollData.endAt = new Date(endDate).toISOString();
  }

  console.log("Creating poll data:", pollData); 

  return pollData;
};

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    
    const validationError = validatePoll(isDraft);
    if (validationError) {
      return setError(validationError);
    }

    const confirmMessage = isDraft 
      ? "Save this poll as a draft?" 
      : "Are you sure you want to publish this poll?";

    if (window.confirm(confirmMessage)) {
      setIsSubmitting(true);
      try {
        const pollData = createPollData(isDraft ? "draft" : "published");
        
        await axios.post(`${API_URL}/api/polls`, pollData, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        
        if (isDraft) {
          alert("Poll saved as draft successfully!");
        }
        
        navigate("/poll-list");
      } catch (err) {
        const action = isDraft ? "save draft" : "publish poll";
        setError(`Failed to ${action}.`);
        console.error(`Poll ${action} error:`, err);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSaveAsDraft = (e) => {
    handleSubmit(e, true);
  };

  const handlePublish = (e) => {
    handleSubmit(e, false);
  };

  return (
    <div className="new-poll-container">
      <h1>Create New Poll</h1>
      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handlePublish}>
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

        {/* View Restrictions */}
        <div className="form-group">
          <label>Who can view this poll?</label>
          <div className="restriction-options">
            <label className="radio-label">
              <input
                type="radio"
                name="viewRestriction"
                value="public"
                checked={viewRestriction === "public"}
                onChange={(e) => setViewRestriction(e.target.value)}
              />
              Public (anyone with the link)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="viewRestriction"
                value="followers"
                checked={viewRestriction === "followers"}
                onChange={(e) => setViewRestriction(e.target.value)}
              />
              Followers only
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="viewRestriction"
                value="friends"
                checked={viewRestriction === "friends"}
                onChange={(e) => setViewRestriction(e.target.value)}
              />
              Friends only (mutual followers)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="viewRestriction"
                value="custom"
                checked={viewRestriction === "custom"}
                onChange={(e) => setViewRestriction(e.target.value)}
              />
              Choose specific users
            </label>
          </div>

          {viewRestriction === "custom" && (
            <div className="custom-users-section">
              <label>Search and select users who can view:</label>
              <UserSearchInput
                selectedUsers={customViewUsers}
                onUsersChange={setCustomViewUsers}
                placeholder="Search users by username..."
                currentUser={user}
              />
            </div>
          )}
        </div>

        {/* Vote Restrictions */}
        <div className="form-group">
          <label>Who can vote on this poll?</label>
          <div className="restriction-options">
            <label className="radio-label">
              <input
                type="radio"
                name="voteRestriction"
                value="public"
                checked={voteRestriction === "public"}
                onChange={(e) => setVoteRestriction(e.target.value)}
              />
              Public (anyone who can view)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="voteRestriction"
                value="followers"
                checked={voteRestriction === "followers"}
                onChange={(e) => setVoteRestriction(e.target.value)}
              />
              Followers only
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="voteRestriction"
                value="friends"
                checked={voteRestriction === "friends"}
                onChange={(e) => setVoteRestriction(e.target.value)}
              />
              Friends only (mutual followers)
            </label>
            <label className="radio-label">
              <input
                type="radio"
                name="voteRestriction"
                value="custom"
                checked={voteRestriction === "custom"}
                onChange={(e) => setVoteRestriction(e.target.value)}
              />
              Choose specific users
            </label>
          </div>

          {voteRestriction === "custom" && (
            <div className="custom-users-section">
              <label>Search and select users who can vote:</label>
              <UserSearchInput
                selectedUsers={customVoteUsers}
                onUsersChange={setCustomVoteUsers}
                placeholder="Search users by username..."
              />
            </div>
          )}
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

        {voteRestriction === "public" && (
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
        )}

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
          <button 
            type="button" 
            onClick={() => navigate("/poll-list")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSaveAsDraft}
            className="save-draft-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save as Draft"}
          </button>
          <button 
            type="submit" 
            className="publish-poll-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Poll"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewPoll;