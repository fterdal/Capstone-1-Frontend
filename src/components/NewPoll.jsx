import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const NewPoll = () => {
  const [title, setTitle] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOptionField = () => {
    setOptions([...options, ""]);
  };

  const removeOptionField = (index) => {
    const updatedOptions = options.filter((_, i) => i != index); //explan
    setOptions(updatedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return setError("Poll title is required.");
    }
    const validOptions = options.filter(opt => opt.trim() != "");
    if (validOptions.length < 2) {
      return setError("At least two filled options are required.");
    }
    try {
      await axios.post("http://localhost:8080/api/polls", {
        title,
        options: validOptions
      });
      navigate("/poll-list");
    } catch (err) {
      setError("Failed to create poll.");
    }
  };

  return (
    <div>
      <h1>Create New Poll</h1>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Poll Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Options:</label>
          {options.map((option, index) => (
            <div>
              <input 
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
              {options.length > 2 && (
                <button type="button" onClick={() => removeOptionField(index)}>
                  Remove option
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={addOptionField}>
            Add Option
          </button>
        </div>
        <button type="submit">Create Poll</button>
      </form>
    </div>
  );
};

export default NewPoll;
