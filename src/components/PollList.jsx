import React from 'react';
import PollCard from './PollCard';


const PollsList = ({ polls }) => {
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
        <PollCard key={poll.id} poll={poll} />
      ))}
    </div>
  );
};

export default PollsList;