import React from 'react';
import PollCard from './PollCard';
import { Link, useNavigate } from 'react-router-dom'; 

const PollsList = ({ polls }) => {
  const navigate = useNavigate(); 

  const handleUserClick = (id) => {
    navigate(`/polls/${id}`);
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
        <PollCard key={poll.id} poll={poll} onClick={() => handleUserClick(poll.id)}/>
      ))}
    </div>
  );
};

export default PollsList;