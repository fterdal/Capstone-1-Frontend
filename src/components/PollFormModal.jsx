import React, { useState } from "react";
import "./PollFormModal.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PollFormModal = ({ isOpen, onClose }) => {
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

  // Form validation (skipped for drafts)
  const validateForm = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Unified handler for submit & draft
  const handleSubmit = async (status) => {
    // For publish: validate. For draft: skip validation.
    if (status === "published" && !validateForm()) return;

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
      const res = await axios.post( "http://localhost:8080/api/polls",
        payload, { 
        withCredentials: true});

      const data = res.data;

      if (!res.status) {
        setSubmitError(data.error || "Poll creation failed.");
      } else {
        console.log("✅ Poll created:", JSON.stringify(data, null, 2));
        console.log("Poll options:", data.poll.PollOptions);
        console.log("Number of options:", data.poll.PollOptions?.length);
        onClose();
        resetForm(); // clear form
        navigate(`/polls/host/${data.poll.id}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setSubmitError("Network error. Try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (status) => {
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
      // Use relative path only (assumes correct proxy or base URL setup)
      const res = await axios.post( "http://localhost:8080/api/polls",
        payload,
        { withCredentials: true }
      );

      console.log(`✅ Poll ${payload.status === "draft" ? "saved as draft" : "published"}:`, res.data);
      resetForm();
      onClose();
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
        <h2>Create a Poll</h2>

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
