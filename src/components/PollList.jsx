import React, { useState, useEffect} from "react";
import axios from "axios";

const PollList = () => {
   
   const [polls, setPolls] = useState([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null); 

   useEffect(() => {
    const fetchPolls = async () => {
        try {
            const response = await axios.get("/api/polls");
            setPolls(response.data);
        } catch (err) {
            setError("Failed to fetch polls.");
        } finally {
            setLoading(false);
        }
    };
    fetchPolls();
   }, []);

   if(loading) return <p>Loading polls...</p>;
   if(error) return <p>{error}</p>;

  return (
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
    </div>
  );
};

export default PollList;
