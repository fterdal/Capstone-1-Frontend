import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import { API_URL } from "../shared";
import UserSearchInput from "./UserSearchInput";

const DraftPoll = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [endDate, setEndDate] = useState("");
  const [isIndefinite, setIsIndefinite] = useState(true);
  const [allowAnonymous, setAllowAnonymous] = useState(false);
  const [viewRestriction, setViewRestriction] = useState("public");
  const [voteRestriction, setVoteRestriction] = useState("public");
  const [customViewUsers, setCustomViewUsers] = useState([]);
  const [customVoteUsers, setCustomVoteUsers] = useState([]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  //commit

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

useEffect(() => {
  if (!id && user) {
    console.log("Loading drafts for user:", user.id); 
    
    axios
      .get(`${API_URL}/api/polls`, {
        headers: getAuthHeaders()
      })
      .then((res) => {
        console.log("All polls received:", res.data); 
        
        const userDrafts = res.data.filter(
          (poll) => poll.creator_id === user.id && poll.status === "draft"
        );
        
        console.log("User drafts found:", userDrafts);
        setDrafts(userDrafts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load drafts:", err);
        setError("Failed to load drafts: " + (err.response?.data?.error || err.message));
        setLoading(false);
      });
  } else if (!id && !user) {
    setLoading(false);
    setError("Please log in to view drafts");
  } else if (id) {
    setLoading(false);
  }
}, [id, user]);

  useEffect(() => {
  if (id) {
    axios.get(`${API_URL}/api/polls/${id}`, {
      headers: getAuthHeaders()
    })
      .then(res => {
        const data = res.data;
        setTitle(data.title || "");
        setDescription(data.description || "");
        setAllowAnonymous(data.allowAnonymous || false);
        setIsIndefinite(!data.endAt);
        setEndDate(data.endAt ? data.endAt.slice(0, 16) : "");
        setViewRestriction(data.viewRestriction || "public");
        setVoteRestriction(data.voteRestriction || "public");
        
        const pollOptions = data.PollOptions || data.pollOptions || [];
        setOptions(pollOptions.length > 0 ? pollOptions.map(opt => opt.text) : ["", ""]);
        if (data.viewRestriction === "custom" || data.voteRestriction === "custom") {
          return axios.get(`${API_URL}/api/polls/${id}/permissions`, {
            headers: getAuthHeaders()
          });
        }
        return { data: { customViewUsers: [], customVoteUsers: [] } };
      })
      .then(permissionsRes => {
        const permissions = permissionsRes.data;
        setCustomViewUsers(permissions.customViewUsers || []);
        setCustomVoteUsers(permissions.customVoteUsers || []);
      })
      .catch(err => {
        console.error("Error loading draft:", err);
        setError("Failed to load draft: " + (err.response?.data?.error || err.message));
      });
  }
}, [id]);

  const deleteDraft = async (draftId) => {
    if (window.confirm("Are you sure you want to delete this draft?")) {
      try {
        await axios.delete(`${API_URL}/api/polls/${draftId}`, {
          headers: getAuthHeaders()
        });
        setDrafts((prev) => prev.filter((d) => d.id !== draftId));
      } catch (err) {
        console.error("Failed to delete draft:", err);
        alert("Failed to delete draft: " + (err.response?.data?.error || err.message));
      }
    }
  };

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOptionField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionField = (index) => {
    const updated = options.filter((_, i) => i !== index);
    setOptions(updated);
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
      creator_id: user.id,
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

    return pollData;
  };

  const handleSubmit = async (e, isDraft = false) => {
    e.preventDefault();
    
    const validationError = validatePoll(isDraft);
    if (validationError) {
      return setError(validationError);
    }

    const action = isDraft ? "save draft" : "publish poll";
    const confirmMessage = isDraft 
      ? "Save changes to this draft?" 
      : "Are you sure you want to publish this draft?";

    if (window.confirm(confirmMessage)) {
      setIsSubmitting(true);
      try {
        const pollData = createPollData(isDraft ? "draft" : "published");
        
        await axios.put(`${API_URL}/api/polls/${id}`, pollData, {
          headers: getAuthHeaders()
        });
        
        if (isDraft) {
          alert("Draft saved successfully!");
          setError(""); 
        } else {
          navigate("/poll-list");
        }
      } catch (err) {
        console.error(`Failed to ${action}:`, err);
        setError(`Failed to ${action}: ` + (err.response?.data?.error || err.message));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSaveDraft = (e) => {
    handleSubmit(e, true);
  };

  const handlePublish = (e) => {
    handleSubmit(e, false);
  };

  if (!id) {
    if (loading) return <p>Loading drafts...</p>;
    return (
      <div>
        <h2>My Draft Polls</h2>
        {drafts.length === 0 ? (
          <p>You don't have any saved drafts.</p>
        ) : (
          <ul>
            {drafts.map((draft) => (
              <li key={draft.id}>
                <Link to={`/edit-draft/${draft.id}`}>
                  {draft.title || "(Untitled Draft)"}
                </Link>
                <button onClick={() => deleteDraft(draft.id)}>Delete draft</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="new-poll-container">
      <h1>Edit Drafted Poll</h1>
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
            onClick={() => navigate("/edit-draft")}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button 
            type="button" 
            onClick={handleSaveDraft}
            className="save-draft-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Draft"}
          </button>
          <button 
            type="submit" 
            className="publish-poll-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Publishing..." : "Publish Draft"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraftPoll;