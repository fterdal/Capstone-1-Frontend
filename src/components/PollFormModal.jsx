import React, { useState } from "react";
import "./PollFormModal.css";

const PollFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [allowEndDateTime, setAllowEndDateTime] = useState(false);
  const [endDateTime, setEndDateTime] = useState("");
  const [errors, setErrors] = useState({});

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
          <label><input type="checkbox" /> Allow guest voters</label>
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
          <label><input type="checkbox" /> Allow shared links</label>
        </div>

        <div className="modal-buttons">
          <button
            className="publish"
            onClick={() => {
              if (validateForm()) {
                console.log("Submitting:", { title, description, options });
                // TODO: handle actual form submit
              }
            }}
          >
            Publish
          </button>
          <button className="draft">Save as draft</button>
        </div>
      </div>
    </div>
  );
};

export default PollFormModal;
