<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import axios from "axios";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
=======
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
>>>>>>> 53e01dc79ff974b16b5cf228df1dd1cba4127fe6

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/polls");
        setPolls(response.data);
      } catch (err) {
        setError("Failed to fetch polls.");
      } finally {
        setLoading(false);
      }
    };
    fetchPolls();
  }, []);

  if (loading) return <p>Loading polls...</p>;
  if (error) return <p>{error}</p>;

  return (
<<<<<<< HEAD
    <div>
      <h1>Poll List</h1>
      {polls.length === 0 ? (
        <p>No polls available</p>
      ) : (
        <ul>
          {polls.map((poll) => (
            <li>
              {poll.title}
              <br />
              Created by: {poll.creatorName || "Unknown"}
            </li>
          ))}
        </ul>
      )}
=======
    <div className="polls-container">
      {polls.map(poll => (
        <PollCard key={poll.id} poll={poll} onClick={() => handleUserClick(poll.id)}/>
      ))}
>>>>>>> 53e01dc79ff974b16b5cf228df1dd1cba4127fe6
    </div>
  );
};

export default PollList;
