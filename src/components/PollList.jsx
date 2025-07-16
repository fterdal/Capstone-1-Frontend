import React from "react";
import PollCard from "./PollCard";
import { Link, useNavigate } from "react-router-dom";

const PollList = ({ polls }) => {
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
    <div className="polls-container">
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          onClick={() => handleUserClick(poll.id)}
        />
      ))}
    </div>
  );
};

export default PollList;
