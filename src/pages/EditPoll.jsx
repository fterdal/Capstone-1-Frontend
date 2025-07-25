// src/pages/EditPoll.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../shared";

const EditPoll = () => {
  const { id } = useParams(); // pollId from route
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    options: [],
    requireAuth: false
  });

  useEffect(() => {
    const fetchPoll = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/polls/${id}`, {
          withCredentials: true,
        });
        if (res.data.status !== "draft") {
          alert("You can only edit draft polls.");
          navigate("/dashboard/main");
          return;
        }
        setForm({
          title: res.data.title || "",
          description: res.data.description || "",
          deadline: res.data.deadline?.slice(0, 16) || "", // for datetime-local input
          requireAuth: res.data.requireAuth || false,
          options: res.data.options || [],
        });
      } catch (err) {
        setError("Failed to load poll.");
      } finally {
        setLoading(false);
      }
    };
    fetchPoll();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
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
    const updated = form.options.filter((_, i) => i !== index);
    setForm({ ...form, options: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`${API_URL}/api/polls/${id}`, form, {
        withCredentials: true,
      });
      alert("Poll updated!");
      navigate("/dashboard/main");
    } catch (err) {
      console.error("Update failed", err);
      alert("Error updating poll.");
    }
  };

  if (loading) return <p>Loading poll...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="edit-poll-page" style={{ maxWidth: "600px", margin: "auto" }}>
      <h2>Edit Poll</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={handleChange} />

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
          Require login to vote
        </label>

        <h4>Poll Options</h4>
        {form.options.map((opt, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={opt.text}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              style={{ flex: 1 }}
            />
            <button type="button" onClick={() => handleRemoveOption(index)}>🗑️</button>
          </div>
        ))}
        <button type="button" onClick={handleAddOption}>+ Add Option</button>

        <br />
        <button type="submit" style={{ marginTop: "1rem" }}>Save Changes</button>
      </form>
    </div>
  );
};

export default EditPoll;
