import React, { useState, useEffect } from 'react';
import './CSS/UserPollCardStyles.css';
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PollCard = ({ poll, onClick, onDelete }) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [creator, setCreator] = useState(null);
  const [polls, setPolls] = useState([]);
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      if (!poll.endAt) {
        setTimeLeft('No end date');
        return;
      }

      const now = new Date();
      const endTime = new Date(poll.endAt); 
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
    const timer = setInterval(calculateTimeLeft, 60000); 

    return () => clearInterval(timer);
  }, [poll.endAt]); 

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/users/${poll.creator_id}`);
        if (response.ok) {
          const userData = await response.json();
          setCreator(userData);
        } else {
          console.error('Failed to fetch creator:', response.status);
          setCreator({ username: 'Unknown' });
        }
      } catch (error) {
        console.error('Error fetching creator:', error);
        setCreator({ username: 'Unknown' }); 
      }
    };

    if (poll.creator_id) {
      fetchCreator();
    }
  }, [poll.creator_id]);

  const isPollActive = poll.endAt ? new Date(poll.endAt) > new Date() : true; 

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this poll?")) {
      onDelete(poll.id);
    }
  };

if(!poll){
  return(
    <div>
    <h1>No polls made yet</h1>
    </div>
  )};
  
  const copyToClipboard = async (e) => {
    e.stopPropagation(); 
    
    const pollUrl = `${window.location.origin}/polls/${poll.id}`;
    
    try {
      await navigator.clipboard.writeText(pollUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      const textArea = document.createElement('textarea');
      textArea.value = pollUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

return (
    <div 
      className={`poll-card ${!isPollActive ? 'poll-ended' : ''}`}
      onClick={onClick} 
      style={{ cursor: 'pointer' }} 
    >
      <div className="poll-header">
        <h3 className="poll-title">{poll.title}</h3>
        <button
            className={`copy-btn ${copied ? 'copied' : ''}`}
            onClick={copyToClipboard}
            title="Copy poll link"
          >
            {copied ? (
              <span className="copy-feedback">
                ✓ Copied!
              </span>
            ) : (
              <span className="copy-icon">
                📋 Copy Link
              </span>
            )}
          </button>
        <div className="poll-meta">
          <span className={`poll-time ${!isPollActive ? 'ended' : ''}`}>
            {timeLeft}
          </span>
        </div>
      </div>
      
      {poll.description && (
        <div className="poll-description">
          <p>{poll.description}</p>
        </div>
      )}

      <button onClick={handleDelete}>Delete</button>
      
      {!isPollActive && (
        <div className="poll-status">
          <span className="status-badge">Ended</span>
        </div>
      )}
    </div>
  );
};

export default PollCard;