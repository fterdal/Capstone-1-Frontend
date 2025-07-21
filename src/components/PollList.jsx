import React from "react";
import PollCard from "./PollCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";


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

  if (polls.length === 0) {
    return (
      <div className="polls-container">
        <div className="empty-container">
          <p>No polls available</p>
        </div>
      </div>
    );
  }

  return (

    <div className="polls-container">
      {polls.map(poll => (
        <PollCard key={poll.id} poll={poll} onDuplicate={() => duplicatePoll(poll)}/>
      ))}
    </div>
  );
};

export default PollsList;