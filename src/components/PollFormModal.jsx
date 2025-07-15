import React from "react";
import "./PollFormModal.css";

const PollFormModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Create a Poll</h2>

        <input placeholder="Title" />
        <textarea placeholder="Description (1–3 sentences)" />

        <div className="poll-options">
          <div><input placeholder="Option 1" /></div>
          <div><input placeholder="Option 2" /></div>
          <div><input placeholder="Option 3" /></div>
          <button className="add-option-btn">+ Add option</button>
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
