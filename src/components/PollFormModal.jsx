import React, { useState } from "react";
import "./PollFormModal.css";

const PollFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [options, setOptions] = useState(["", ""]);

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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create a Poll</h2>

        <input placeholder="Title" 
        value ={title}
        onChange= {(e)=> setTitle(e.target.value)}
        />

        <textarea placeholder="Description (1–3 sentences)"
        value={description}
        onChange= {(e)=> setDescription(e.target.value)} />

        
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
          <button
            className="add-option-btn"
            onClick={handleAddOption}
            disabled={options.length >= 10}
          >
            + Add option
          </button>
        </div>

        <div className="checkbox-row">
          <label><input type="checkbox" /> Allow guest voters</label>
          <label><input type="checkbox" /> End date/time</label>
          <label><input type="checkbox" /> Allow shared links</label>
        </div>

        <div className="modal-buttons">
          <button className="publish">Publish</button>
          <button className="draft">Save as draft</button>
        </div>
      </div>
    </div>
  );
};

export default PollFormModal;