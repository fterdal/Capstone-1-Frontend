import React, { useState, useEffect } from "react";
import axios from "axios";
import PollCard from "./PollCard";
import { useNavigate } from "react-router-dom";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();


const PollsList = ({ polls }) => {
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

  return (
    <div className="polls-container">
      {polls.length === 0 ? (
        <p>No polls available.</p>
      ) : (
        polls.map((poll) => (
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