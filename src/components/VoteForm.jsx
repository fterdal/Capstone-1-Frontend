import React, { useState, useEffect } from "react";

const VoteForm = ({ poll, readOnly = false }) => {
  const [rankings, setRankings] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [orderedOptions, setOrderedOptions] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [deletedOptions, setDeletedOptions] = useState(new Set());

  console.log("VoteForm rendered with poll:", poll);
  console.log("Poll options:", poll?.pollOptions);

  // Initialize ordered options when poll changes
  useEffect(() => {
    if (poll?.pollOptions) {
      setOrderedOptions([...poll.pollOptions]);
    }
  }, [poll?.pollOptions]);

  // Update rankings whenever the order changes
  useEffect(() => {
    const newRankings = {};
    orderedOptions.forEach((option, index) => {
      if (deletedOptions.has(option.id)) {
        // Keep deleted options as null for algorrithm
        newRankings[option.id] = null;
      } else {
        // Find the position among non-deleted options
        const nonDeletedBefore = orderedOptions
          .slice(0, index)
          .filter(opt => !deletedOptions.has(opt.id)).length;
        newRankings[option.id] = nonDeletedBefore + 1;
      }
    });
    setRankings(newRankings);
  }, [orderedOptions, deletedOptions]);

  if (!poll) {
    return <div className="vote-form">Loading poll data...</div>;
  }

  if (!poll.pollOptions || poll.pollOptions.length === 0) {
    return (
      <div className="vote-form">
        <p>No poll options available.</p>
        <p style={{ fontSize: "12px", color: "#666" }}>
          Debug: Poll data = {JSON.stringify(poll, null, 2)}
        </p>
      </div>
    );
  }

  const handleRankChange = (optionId, rank) => {
    setRankings((prev) => {
      const updated = { ...prev };
      // Remove this rank from any other option
      for (const key in updated) {
        if (updated[key] === rank) {
          updated[key] = "";
        }
      }
      // Assign the rank to this option
      updated[optionId] = rank;
      return updated;
    });
  };

  const handleDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.target.parentNode);
    e.dataTransfer.setDragImage(e.target.parentNode, 20, 20);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null) return;
    
    if (draggedItem !== index) {
      const newOrderedOptions = [...orderedOptions];
      const draggedOption = newOrderedOptions[draggedItem];
      
      // Remove the dragged item
      newOrderedOptions.splice(draggedItem, 1);
      
      // Insert at new position
      newOrderedOptions.splice(index, 0, draggedOption);
      
      setOrderedOptions(newOrderedOptions);
      setDraggedItem(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDeleteOption = (optionId) => {
    setDeletedOptions(prev => new Set([...prev, optionId]));
  };

  const handleRestoreOption = (optionId) => {
    setDeletedOptions(prev => {
      const newSet = new Set(prev);
      newSet.delete(optionId);
      return newSet;
    });
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
          rankings: rankings,
        }),
      });

      alert("Vote submitted!");
      setRankings({});
    } catch (err) {
      console.error("Failed to submit vote", err);
      alert("Failed to submit vote.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="vote-form">
      <h4>Drag to rank the options (top = highest rank). Click X to remove options from ranking:</h4>
      <div className="ranking-options">
        {orderedOptions?.map((option, index) => {
          const isDeleted = deletedOptions.has(option.id);
          const currentRank = rankings[option.id];
          
          return (
            <div 
              key={option.id} 
              className={`ranking-item ${draggedItem === index ? 'dragging' : ''} ${isDeleted ? 'deleted' : ''}`}
              draggable={!readOnly && !isDeleted}
              onDragStart={(e) => !isDeleted && handleDragStart(e, index)}
              onDragOver={(e) => !isDeleted && handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="ranking-content">
                {!isDeleted && <span className="drag-handle">⋮⋮</span>}
                <span className="option-text">
                  {option.optionText}
                </span>
                {!isDeleted && currentRank && (
                  <span className="rank-badge">
                    #{currentRank}
                  </span>
                )}
              </div>
              <div className="option-actions">
                {isDeleted ? (
                  <button
                    type="button"
                    onClick={() => handleRestoreOption(option.id)}
                    disabled={readOnly}
                  >
                    Restore
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleDeleteOption(option.id)}
                    disabled={readOnly}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rankings-summary">
        <p>Current Rankings:</p>
        <ul>
          {orderedOptions.map((option) => {
            const rank = rankings[option.id];
            const isDeleted = deletedOptions.has(option.id);
            
            return (
              <li key={option.id}>
                {isDeleted ? (
                  <span><strong>Unranked</strong>: {option.optionText} (excluded)</span>
                ) : (
                  <span><strong>#{rank}</strong>: {option.optionText}</span>
                )}
              </li>
            );
          })}
        </ul>
        <p><small>Note: Deleted options are sent as null/unranked for RCV processing</small></p>
      </div>

      <button type="submit" disabled={readOnly || submitting}>
        Submit Vote
      </button>
    </form>
  );
};

export default VoteForm;
