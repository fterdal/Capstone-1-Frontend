import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // <-- Add this import


// This is just mock data to help during this moment, disregard
const mockPolls = [
  { id: 1, title: "Favorite Food", status: "draft" },
  { id: 2, title: "Best Movie", status: "published" },
  { id: 3, title: "Summer Plans", status: "ended" },
  
];

const PollsDashboard = () => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate(); // <-- Add this line

  // Normalize search string for case-insensitive matching
  const normalizedSearch = search.toLowerCase();

  // Filter polls by status and title
  const filteredPolls = mockPolls.filter(poll => {
    const matchesStatus = filter === "all" || poll.status === filter;
    const matchesTitle = poll.title.toLowerCase().includes(normalizedSearch);
    return matchesStatus && matchesTitle;
  });

  return (
    <div>
      <h1>📋 Your Polls</h1>
      <div>
        {/* Search input for filtering polls by title */}
        <input
          type="text"
          placeholder="Search by title…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        {/* Dropdown to filter polls by status */}
        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="ended">Ended</option>
        </select>
        {/* Button to navigate to the poll creation page */}
        <button
          type="button"
          onClick={() => navigate("/create")} // <-- Use navigate instead of window.location.href
        >
          Create a New Poll ＋
        </button>
      </div>
      {/* List of filtered polls with status emoji */}
      <ul>
        {filteredPolls.map(poll => (
          <li key={poll.id}>
            <span>
              {poll.title}{" "}
              <span style={{ fontWeight: "bold" }}>
                {poll.status === "draft" && "📝"}
                {poll.status === "published" && "✅"}
                {poll.status === "ended" && "⏰"}
                {poll.status}
              </span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PollsDashboard;