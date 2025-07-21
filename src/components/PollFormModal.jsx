import React, { useState, useEffect } from "react";
import "./PollFormModal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PollFormModal = ({ isOpen, onClose, onPollCreated, initialData }) => {
  if (!isOpen) return null;

  // =============================
  // State Management
  // =============================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowEndDateTime, setAllowEndDateTime] = useState(false);
  const [endDateTime, setEndDateTime] = useState("");
  const [allowGuests, setAllowGuests] = useState(false);
  const [allowSharedLinks, setAllowSharedLinks] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);


  const navigate = useNavigate();

  // New: loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Populate form with initial data when editing a draft
  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || "");
      setDescription(initialData.description || "");
      setOptions(initialData.options || ["", ""]);
      setAllowEndDateTime(!!initialData.deadline);
      setEndDateTime(initialData.deadline ? new Date(initialData.deadline).toISOString().slice(0, 16) : "");
      setAllowGuests(!initialData.authRequired);
      setAllowSharedLinks(initialData.allowSharedLinks || false);
    } else {
      resetForm();
    }
  }, [initialData]);

  // Reset all form fields after submission
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setOptions(["", ""]);
    setAllowEndDateTime(false);
    setEndDateTime("");
    setAllowGuests(false);
    setAllowSharedLinks(false);
    setErrors({});
  };

  const normalizeOption = (opt) =>
    opt.trim().toLowerCase().replace(/\s+/g, "");

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const handleAddOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  // combined validation for all fields
  const validateAll = (status) => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    const normalizedOptions = options.map(opt => normalizeOption(opt));
    const uniqueOptions = new Set(normalizedOptions);
    if (normalizedOptions.some(opt => !opt)) {
      newErrors.options = "All options must be filled.";
    } else if (uniqueOptions.size < options.length) {
      newErrors.options = "Options must be unique (ignoring case and spaces).";
    }
    if (allowEndDateTime && !endDateTime) {
      newErrors.endDateTime = "Please enter an end date/time.";
    }
    setErrors(newErrors);
    // For publish: require all fields; for draft: only block on date/time if enabled
    if (status === "published") {
      return Object.keys(newErrors).length === 0;
    } else {
      // For draft, only block if date/time error
      return !newErrors.endDateTime;
    }
  };

  // Unified handler for submit & draft
  const handleSubmit = async (status) => {
    if (!validateAll(status)) return;

    const payload = {
      title,
      description,
      options,
      deadline: allowEndDateTime ? new Date(endDateTime).toISOString() : null,
      authRequired: !allowGuests,
      restricted: false, // backend: support later if needed
      allowSharedLinks, // backend: use to allow link-based access
      status,
    };

    setIsLoading(true);
    setSubmitError("");

    try {
      let res;
      if (initialData) {
        // update existing draft 
        res = await axios.patch(`http://localhost:8080/api/polls/${initialData.id}`,
          payload, { 
          withCredentials: true});
      } else {
        // create new poll
        res = await axios.post("http://localhost:8080/api/polls",
          payload, { 
          withCredentials: true});
      }

      const data = res.data;

      if (res.status < 200 || res.status >= 300) {
        setSubmitError(data.error || "poll creation/update failed.");
      } else {
        console.log("poll created/updated:", JSON.stringify(data, null, 2));
        onClose();
        resetForm(); // clear form
        if (onPollCreated) onPollCreated(); // refresh dashboard
        
        // navigate to host view - use initialData.id for updates, data.poll?.id for new polls
        const pollId = initialData ? initialData.id : (data.poll?.id || data.id);
        navigate(`/polls/host/${pollId}`);
      }
    } catch (err) {
      console.error("error:", err);
      setSubmitError("network error. try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (status) => {
    if (!validateAll(status)) return;
    // Skip validation for drafts to allow partial saves
  const payload = {
      title,
      description,
      options,
      deadline: allowEndDateTime ? new Date(endDateTime).toISOString() : null,
      authRequired: !allowGuests,
      restricted: false,
      allowSharedLinks, // same as above
      status,
    };

    setIsLoading(true);
    setSubmitError("");
    try {
      let res;
      if (initialData) {
        // update existing draft 
        res = await axios.patch(`http://localhost:8080/api/polls/${initialData.id}`,
          payload,
          { withCredentials: true }
        );
      } else {
        // create new poll
        res = await axios.post("http://localhost:8080/api/polls",
          payload,
          { withCredentials: true }
        );
      }

      console.log(`✅ Poll ${payload.status === "draft" ? "saved as draft" : "published"}:`, res.data);
      resetForm();
      onClose();
      if (onPollCreated) onPollCreated(); // Refresh dashboard
      navigate("/dashboard");
    } catch (err) {
      console.error(`Error during ${payload.status} save:`, err);
      setSubmitError(`Network error while ${payload.status === "draft" ? "saving draft" : "publishing"}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>{initialData ? "Edit Draft" : "Create a Poll"}</h2>

        <h2>Title</h2>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {errors.title && <p className="error">{errors.title}</p>}

        <h2>Description</h2>
        <textarea
          placeholder="Description (1–3 sentences)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {errors.description && <p className="error">{errors.description}</p>}

        <h3>Options</h3>
        <div className="poll-options">
          {options.map((option, index) => (
            <div key={index} className="option-row">
              <input
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {options.length > 2 && (
                <button
                  className="remove-option-btn"
                  onClick={() => handleRemoveOption(index)}
                >
                  🗑
                </button>
              )}
            </div>
          ))}
          {errors.options && <p className="error">{errors.options}</p>}
          <button
            className="add-option-btn"
            onClick={handleAddOption}
            disabled={options.length >= 10}
          >
            + Add option
          </button>
        </div>

        <h3>Settings</h3>
        <div className="checkbox-row">
          <label>
            <input 
           type="checkbox" 
           checked={allowGuests}
           onChange={(e) => setAllowGuests(e.target.checked)} /> 
          Allow guest voters</label>
          <label>
            <input
              type="checkbox"
              checked={allowEndDateTime}
              onChange={(e) => setAllowEndDateTime(e.target.checked)}
            />
            End date/time
          </label>
              {allowEndDateTime && (
                <div className="datetime-picker">
                  <label>Choose end date/time:</label>
                  <input
                    type="datetime-local"
                    value={endDateTime}
                    onChange={(e) => setEndDateTime(e.target.value)}
                  />
                  {errors.endDateTime && (
                    <p className="error" style={{ color: 'red' }}>{errors.endDateTime}</p>
                  )}
                </div>
              )}
          <label><input 
            type="checkbox"
            checked={allowSharedLinks}
            onChange={(e) => setAllowSharedLinks(e.target.checked)}/> 
          Allow shared links
          </label>
        </div>

        {isLoading && <p className="loading">Submitting...</p>}
        {submitError && <p className="error">{submitError}</p>}

        <div className="modal-buttons">
          <button className="publish" onClick={() => handleSubmit("published")} disabled={isLoading}>
            Publish
          </button>
          <button className="draft" onClick={() => handleSaveDraft("draft")} disabled={isLoading}>
            Save as draft
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollFormModal;
