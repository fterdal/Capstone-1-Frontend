import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";

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
  const [error, setError] = useState("");

useEffect(() => {
  if (!id && user) {
    axios
      .get("http://localhost:8080/api/polls")
      .then((res) => {
        const userDrafts = res.data.filter(
          (draft) => draft.creator_id === user.id
        );
        setDrafts(userDrafts);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load drafts:", err);
        setLoading(false);
      });
  }
}, [id, user]);

useEffect(() => {
  if (id) {
    axios.get(`http://localhost:8080/api/polls/${id}`)
      .then(res => {
        const data = res.data;
        setTitle(data.title || "");
        setDescription(data.description || "");
        setAllowAnonymous(data.allowAnonymous || false);
        setIsIndefinite(!data.endAt);
        setEndDate(data.endAt ? data.endAt.slice(0, 16) : "");

        setOptions(data.pollOptions?.map(opt => opt.text) || ["", ""]);
      })
      .catch(err => {
        console.error("Error loading draft:", err);
      });
  }
}, [id]);

const deleteDraft = async (draftId) => {
  if (!window.confirm("Are you sure you want to delete this draft?")) return;

  try {
    await axios.delete(`http://localhost:8080/api/polls/${draftId}`);
    setDrafts((prev) => prev.filter((d) => d.id !== draftId));
  } catch (err) {
    console.error("Failed to delete draft:", err);
    alert("Failed to delete draft");
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validOptions = options.filter((opt) => opt.trim() !== "");
    if (!title.trim()) return setError("Title required.");
    if (validOptions.length < 2) return setError("At least 2 options required.");

    try {
      await axios.patch(`http://localhost:8080/api/polls/${id}`, {
        title: title.trim(),
        description: description.trim(),
        allowAnonymous,
        endAt: isIndefinite ? null : new Date(endDate).toISOString(),
        pollOptions: validOptions.map((text, i) => ({
          text,
          position: i + 1,
        })),
      });

      navigate("/poll-list");
    } catch (err) {
      console.error("Failed to update draft:", err);
      setError("Update failed.");
    }
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
          <button type="button" onClick={() => navigate("/edit-draft")}>
            Cancel
          </button>
          <button type="submit" className="create-poll-btn">
            Update Draft
          </button>
        </div>
      </form>
    </div>
  );
};

export default DraftPoll;
