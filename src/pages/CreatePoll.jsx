import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const CreatePoll = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    requireAuth: false,
    options: [{ text: "" }, { text: "" }] // start with 2 empty options
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleOptionChange = (index, value) => {
    const updated = [...form.options];
    updated[index].text = value;
    setForm({ ...form, options: updated });
  };

  const handleAddOption = () => {
    setForm({ ...form, options: [...form.options, { text: "" }] });
  };

  const handleRemoveOption = (index) => {
    if (form.options.length <= 2) {
      alert("You must have at least 2 options.");
      return;
    }
    const updated = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.options.filter((o) => o.text.trim() !== "").length < 2) {
      setError("You must provide at least 2 poll options.");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/polls`, form, {
        withCredentials: true
      });
      alert("Poll created!");
      navigate("/dashboard/main");
    } catch (err) {
      console.error("Poll creation failed", err);
      setError("Failed to create poll.");
    }
  };

  return (
    <div className="create-poll-page" style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Create New Poll</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} required />

        <label>Description</label>
        <textarea name="description" value={form.description} onChange={handleChange} />

        <label>Deadline</label>
        <input
          type="datetime-local"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="requireAuth"
            checked={form.requireAuth}
            onChange={handleChange}
          />
          Authentication Required
        </label>

        <h4>Poll Options</h4>
        {form.options.map((opt, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              style={{ flex: 1 }}
              required
            />
            <button type="button" onClick={() => handleRemoveOption(index)}>🗑️</button>
          </div>
        ))}
        <button type="button" onClick={handleAddOption}>+ Add Option</button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>Create Poll</button>
      </form>
    </div>
  );
};

export default CreatePoll;
