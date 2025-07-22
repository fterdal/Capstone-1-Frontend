import React, { useState, useEffect } from "react";
import axios from "axios";
import PollCard from "./PollCard";
import { useNavigate } from "react-router-dom";
import "./CSS/UsersPage.css";

const PollList = ({ poll }) => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const duplicatePoll = async (poll) => {
    try {
      const newPollData = {
        creator_id: poll.creator_id,
        title: poll.title + " (Copy)",
        description: poll.description,
        allowAnonymous: poll.allowAnonymous,
        endAt: poll.endAt,
        pollOptions: poll.pollOptions.map((opt) => ({
          text: opt.text,
          position: opt.position,
        })),
        status: "draft",
      };

      const response = await axios.post(
        "http://localhost:8080/api/polls",
        newPollData
      );
      const draftId = response.data.id;
      const fullDraftResponse = await axios.get(`http://localhost:8080/api/polls/${draftId}`);
      navigate(`/edit-draft/${draftId}`);
    } catch (error) {
      console.error("Failed to duplicate poll:", error);
      alert("Failed to duplicate poll");
    }
  };

  if (!polls) {
    return (
      <div className="polls-container">
        <div className="loading-container">
          <p>Loading polls...</p>
        </div>
      </div>
    );
  }
  const handleUserClick = (id) => {
    navigate(`/polls/${id}`);
  };

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/polls");
        setPolls(response.data);
      } catch (err) {
        setError("Failed to fetch polls.");
        console.error("Error fetching polls:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPolls();
  }, []);

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p>{error}</p>;

  const filteredPolls = polls.filter((poll) => {
    const Title = poll.title?.toLowerCase().includes(search.toLowerCase());
    const Description = poll.description?.toLowerCase().includes(search.toLowerCase());
    return Title || Description;
});

  return (
    <div className="polls-container">
      <h2>All Polls</h2>
      <input 
        className="search-input"
        type="text"
        placeholder="Search polls"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {filteredPolls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        filteredPolls.map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            onClick={() => handleUserClick(poll.id)}
            onDuplicate={() => duplicatePoll(poll)}
          />
        ))
      )}
    </div>
  );
};

export default PollList;