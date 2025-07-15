import React, { useState, useEffect } from 'react';
import './CSS/PollCardStyles.css';

const PollCard = ({ poll }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const endTime = new Date(poll.end_at);
      const difference = endTime - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
          setTimeLeft(`${days}d ${hours}h left`);
        } else if (hours > 0) {
          setTimeLeft(`${hours}h ${minutes}m left`);
        } else if (minutes > 0) {
          setTimeLeft(`${minutes}m left`);
        } else {
          setTimeLeft('Less than 1m left');
        }
      } else {
        setTimeLeft('Poll ended');
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [poll.end_at]);

  // Fetch creator information
  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`/api/users/${poll.creator_id}`);
        if (response.ok) {
          const userData = await response.json();
          setCreator(userData);
        }
      } catch (error) {
        console.error('Error fetching creator:', error);
      }
    };

    if (poll.creator_id) {
      fetchCreator();
    }
  }, [poll.creator_id]);

  const isPollActive = new Date(poll.end_at) > new Date();

  return (
    <div className={`poll-card ${!isPollActive ? 'poll-ended' : ''}`}>
      <div className="poll-header">
        <h3 className="poll-title">{poll.title}</h3>
        <div>
          <span className="poll-creator">
            by {creator ? `@${creator.username}` : 'Loading...'}
          </span>
          <span className={`poll-time ${!isPollActive ? 'ended' : ''}`}>
            {timeLeft}
          </span>
        </div>
      </div>
      
      {!isPollActive && (
        <div className="poll-status">
          <span className="status-badge">Ended</span>
        </div>
      )}
    </div>
  );
};

export default PollCard;