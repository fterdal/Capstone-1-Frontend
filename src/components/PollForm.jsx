import React, { useState, useEffect } from "react";

const PollForm = ({ onSubmit, onChange, initialData = {}, status = "draft" }) => {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [options, setOptions] = useState(
    initialData.options?.map((opt) => (typeof opt === "string" ? opt : opt.text)) || ["", ""]
  );
  const [allowGuests, setAllowGuests] = useState(initialData.allowGuests || false);
  const [endTime, setEndTime] = useState(initialData.endTime || "");

  const isDisabled = status !== "draft";

  useEffect(() => {
    onChange?.({
      title,
      description,
      options,
      allowGuests,
      endTime,
    });
  }, [title, description, options, allowGuests, endTime]);

  const handleOptionChange = (value, index) => {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      const updated = options.filter((_, i) => i !== index);
      setOptions(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({
      title,
      description,
      options: options.filter((opt) => opt.trim() !== ""),
      allowGuests,
      endTime,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Title:
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          disabled={isDisabled}
        />
      </label>

      <label>
        Description:
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          disabled={isDisabled}
        />
      </label>

      <label>Options:</label>
      {options.map((opt, idx) => (
        <div key={idx}>
          <input
            value={opt}
            onChange={(e) => handleOptionChange(e.target.value, idx)}
            required
            disabled={isDisabled}
          />
          <button
            type="button"
            onClick={() => removeOption(idx)}
            disabled={isDisabled}
          >
            Remove
          </button>
        </div>
      ))}

      <button type="button" onClick={addOption} disabled={isDisabled}>
        Add Option
      </button>

      <label>
        Allow Guest Voting:
        <input
          type="checkbox"
          checked={allowGuests}
          onChange={(e) => setAllowGuests(e.target.checked)}
          disabled={isDisabled}
        />
      </label>

      <label>
        End Time:
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          disabled={isDisabled}
        />
      </label>

      <button type="submit" disabled={isDisabled}>Create Poll</button>
    </form>
  );
};

export default PollForm;
