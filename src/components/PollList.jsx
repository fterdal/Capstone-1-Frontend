import React, { useState, useEffect } from "react";
import axios from "axios";
import PollCard from "./PollCard";
import { useNavigate } from "react-router-dom";

const PollList = () => {
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
          />
        ))
      )}
    </div>
  );
};

export default PollList;